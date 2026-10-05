import "server-only";
import { lookup } from "node:dns/promises";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import ipaddr from "ipaddr.js";
import { normaliseBusinessLink } from "./link";
import { IdeasError } from "./errors";

const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;
type Address = { address: string; family: number };
type Page = { status: number; location?: string; html: string };

export function isPublicAddress(address: string): boolean {
  try {
    const parsed = ipaddr.parse(address);
    // Includes mapped IPv4, loopback, multicast, documentation and reserved ranges.
    if (parsed.range() !== "unicast") return false;
    return parsed.kind() !== "ipv6" || parsed.match(ipaddr.parse("2000::"), 3);
  } catch {
    return false;
  }
}

async function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted();
  let abort: () => void = () => {};
  const interruption = new Promise<never>((_, reject) => {
    abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
  });
  try { return await Promise.race([promise, interruption]); }
  finally { signal.removeEventListener("abort", abort); }
}

// Only call after destination validation. Exported separately to test transport bounds.
export async function readPinnedPage(url: URL, address: Address, signal: AbortSignal): Promise<Page> {
  return new Promise((resolve, reject) => {
    const get = url.protocol === "https:" ? httpsGet : httpGet;
    const req = get(url, {
      signal,
      agent: false,
      family: address.family,
      // Pin the validated address for the actual connection: no DNS rebinding gap.
      lookup: (_host, _options, callback) => callback(null, address.address, address.family),
      headers: {
        "User-Agent": "BenjaminCostaBusinessIdeas/1.0 (public page preview)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Encoding": "identity",
      },
      maxHeaderSize: 16 * 1024,
    }, (res) => {
      const status = res.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        resolve({ status, location: res.headers.location, html: "" });
        res.destroy();
        return;
      }
      const type = res.headers["content-type"] ?? "";
      const encoding = res.headers["content-encoding"];
      if (status !== 200 || !/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(type) || (encoding && encoding !== "identity")) {
        reject(new Error("No readable public HTML"));
        res.destroy();
        return;
      }
      if (Number(res.headers["content-length"]) > MAX_BYTES) {
        reject(new Error("Page too large"));
        res.destroy();
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      res.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BYTES) {
          reject(new Error("Page too large"));
          res.destroy();
        } else chunks.push(chunk);
      });
      res.on("end", () => resolve({ status, html: Buffer.concat(chunks).toString("utf8") }));
      res.on("error", reject);
      res.on("aborted", () => reject(new Error("Incomplete page")));
    });
    req.on("error", reject);
  });
}

// Dependency injection is for tests, not public configuration or mock results.
export async function fetchPublicPage(link: string, signal: AbortSignal, dependencies = {
  resolve: (host: string): Promise<Address[]> => lookup(host, { all: true, verbatim: true }),
  read: readPinnedPage,
}, allowedOrigin?: string): Promise<{ html: string; link: string }> {
  let current = link;
  const bounded = AbortSignal.any([signal, AbortSignal.timeout(8000)]);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    let url: URL;
    try { url = new URL(normaliseBusinessLink(current)); }
    catch { throw new IdeasError("unsafe-link", "That link can’t be accessed safely. Use a public business link."); }
    // Secondary pages must remain on the original site, including every redirect.
    if (allowedOrigin && url.origin !== allowedOrigin) throw new Error("Page left the business website");
    const addresses = await abortable(dependencies.resolve(url.hostname), bounded);
    if (!addresses.length || addresses.some((item) => !isPublicAddress(item.address))) {
      throw new IdeasError("unsafe-link", "That link doesn’t resolve to a public website. Use a public business link.");
    }
    const pinned = addresses.find((item) => item.family === 4) ?? addresses[0];
    const page = await dependencies.read(url, pinned, bounded);
    if (page.status === 200) return { html: page.html, link: url.toString() };
    if (!page.location || redirects === MAX_REDIRECTS) throw new Error("Too many redirects");
    current = new URL(page.location, url).toString();
  }
  throw new Error("No readable page");
}
