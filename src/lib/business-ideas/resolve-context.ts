import "server-only";
import { Parser } from "htmlparser2";
import type { BusinessContext, IdeasRequest } from "@/types/business-ideas";
import { IdeasError } from "./errors";
import { fetchPublicPage } from "./safe-page";
import { isSocialBusinessLink } from "./link";
import { selectBusinessPages } from "./website-links";

export const MAX_PUBLIC_TEXT = 6000;
const hiddenTags = new Set(["script", "style", "noscript", "svg", "template", "nav", "footer"]);
const isUsefulText = (value: string) => value.length >= 120 &&
  !/verify (?:that )?you are human|checking your browser|enable javascript and cookies|cloudflare ray id|access denied|sign in to continue/i.test(value);

type ReadPage = (link: string, signal: AbortSignal, allowedOrigin?: string) => Promise<{ html: string; link: string }>;
const readBusinessPage: ReadPage = (link, signal, allowedOrigin) => fetchPublicPage(link, signal, undefined, allowedOrigin);

export function extractPageText(html: string): string {
  let text = "";
  const stack: boolean[] = [];
  const parser = new Parser({
    onopentag(name, attributes) {
      const hidden = Boolean(stack.at(-1)) || hiddenTags.has(name) ||
        "hidden" in attributes || attributes["aria-hidden"] === "true" ||
        /display\s*:\s*none|visibility\s*:\s*hidden/i.test(attributes.style ?? "");
      stack.push(hidden);
      if (name === "meta" && !hidden && attributes.name?.toLowerCase() === "description") {
        text += ` ${attributes.content ?? ""} `;
      }
    },
    ontext(value) { if (!stack.at(-1) && text.length < MAX_PUBLIC_TEXT) text += `${value.slice(0, MAX_PUBLIC_TEXT - text.length)} `; },
    onclosetag() { stack.pop(); },
  }, { decodeEntities: true });
  parser.write(html);
  parser.end();
  return text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_PUBLIC_TEXT);
}

export async function resolveContext(input: IdeasRequest, signal: AbortSignal, read: ReadPage = readBusinessPage): Promise<BusinessContext> {
  let text = "";
  const sourceLinks: string[] = [];
  // Homepage plus two same-origin pages, within one shared network/text budget.
  const crawlSignal = AbortSignal.any([signal, AbortSignal.timeout(12000)]);
  if (input.link && !isSocialBusinessLink(input.link)) {
    try {
      const page = await read(input.link, crawlSignal);
      // A redirect to a social/login destination is not useful business evidence.
      if (!isSocialBusinessLink(page.link)) {
        const primary = extractPageText(page.html);
        if (isUsefulText(primary)) {
          const origin = new URL(page.link).origin;
          const links = selectBusinessPages(page.html, page.link);
          text = primary;
          sourceLinks.push(page.link);
          const pages = await Promise.all(links.map(async (link) => {
            try {
              const secondary = await read(link, crawlSignal, origin);
              if (new URL(secondary.link).origin !== origin) return null;
              const content = extractPageText(secondary.html);
              return isUsefulText(content) ? { link: secondary.link, text: content } : null;
            } catch {
              signal.throwIfAborted();
              // A failed secondary page must not discard a useful primary page.
              return null;
            }
          }));
          // Only shorten the primary page when a useful secondary page exists.
          if (pages.some((secondary) => secondary && secondary.link !== page.link)) text = primary.slice(0, 4000);
          for (const secondary of pages) {
            if (!secondary || sourceLinks.includes(secondary.link)) continue;
            const excerpt = secondary.text.slice(0, Math.min(999, MAX_PUBLIC_TEXT - text.length - 1));
            if (excerpt.length < 120) continue;
            text += `\n${excerpt}`;
            sourceLinks.push(secondary.link);
          }
        }
      }
    } catch (error) {
      signal.throwIfAborted();
      if (error instanceof IdeasError && error.code === "unsafe-link") throw error;
      // Public access failures are recoverable through user-provided context.
    }
  }
  if (!text && input.description.trim().length < 20) {
    throw new IdeasError("needs-context", "Tell us in one sentence what your business does and what you’d like to improve. Include your business name if you can.", 422);
  }
  return {
    link: input.link,
    source: text ? "website" : "description",
    text,
    description: input.description.trim(),
    sourceLinks,
  };
}
