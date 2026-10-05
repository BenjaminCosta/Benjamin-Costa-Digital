import "server-only";
import { Parser } from "htmlparser2";
import { normaliseBusinessLink } from "./link";

// A small deterministic crawl, not an agent: never follow arbitrary model URLs.
export function selectBusinessPages(html: string, baseLink: string): string[] {
  const base = new URL(baseLink);
  const candidates = new Map<string, number>();
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name !== "a" || !attributes.href || "download" in attributes) return;
      try {
        const url = new URL(normaliseBusinessLink(new URL(attributes.href, base).toString()));
        if (url.origin !== base.origin || url.search || url.pathname === base.pathname) return;
        const path = decodeURIComponent(url.pathname).toLowerCase();
        if (/\.(?:pdf|jpe?g|png|svg|webp|zip|mp4|docx?)$/.test(path) ||
          /(?:^|\/)(?:login|sign-in|account|checkout|cart|admin|api)(?:\/|$)/.test(path)) return;
        const rank = /(?:^|\/)(?:services?|book(?:ing|ings)?|appointments?|contact)(?:[/-]|$)/.test(path) ? 0
          : /(?:^|\/)(?:about|about-us)(?:[/-]|$)/.test(path) ? 1 : null;
        if (rank !== null && candidates.size < 40) candidates.set(url.toString(), rank);
      } catch { /* Malformed and non-public links are not crawl targets. */ }
    },
  });
  parser.write(html);
  parser.end();
  return [...candidates].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])).slice(0, 2).map(([link]) => link);
}
