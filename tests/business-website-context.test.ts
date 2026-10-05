import assert from "node:assert/strict";
import test from "node:test";
import { selectBusinessPages } from "../src/lib/business-ideas/website-links";
import { resolveContext, MAX_PUBLIC_TEXT } from "../src/lib/business-ideas/resolve-context";
import { fetchPublicPage } from "../src/lib/business-ideas/safe-page";

const input = { goal: "more-bookings" as const, link: "https://example.com/", description: "" };
const signal = () => new AbortController().signal;
const home = `<main><h1>Example Barbers</h1><p>${"We offer haircuts and booking appointments in Broadbeach. ".repeat(100)}</p></main>
<a href="/services">Services</a><a href="/contact">Contact</a><a href="/about">About us</a>`;

test("chooses at most two deterministic relevant same-origin pages", () => {
  const html = `${home}<a href="/services#cuts">Duplicate</a><a href="https://other.example.com/booking">External</a>
    <a href="javascript:alert(1)">Booking</a><a href="/account/contact">Private</a>
    <a href="/contact.pdf">PDF</a><a href="/booking?token=secret">Query</a><a href="/book" download>Download</a>`;
  assert.deepEqual(selectBusinessPages(html, input.link), ["https://example.com/contact", "https://example.com/services"]);
  assert.deepEqual(selectBusinessPages('<a href="/services">Same page</a><a href="/about">About</a>', "https://example.com/services"), ["https://example.com/about"]);
});

test("collects up to three pages with a shared 6000-character budget and source links", async () => {
  const requested: { link: string; origin?: string; signal: AbortSignal }[] = [];
  const context = await resolveContext(input, signal(), async (link, active, origin) => {
    requested.push({ link, origin, signal: active });
    return { link, html: link === input.link ? home : `<p>${"Book a haircut and explore our services. ".repeat(100)}</p>` };
  });
  assert.equal(requested.length, 3);
  assert.equal(requested[0].origin, undefined);
  assert.ok(requested.slice(1).every((item) => item.origin === "https://example.com"));
  assert.ok(requested.every((item) => item.signal === requested[0].signal));
  assert.equal(context.source, "website");
  assert.deepEqual(context.sourceLinks, requested.map((item) => item.link));
  assert.ok(context.text.length <= MAX_PUBLIC_TEXT);
  assert.match(context.text, /Book a haircut/);
});

test("secondary errors, challenge pages and external redirects preserve useful primary context", async () => {
  let reads = 0;
  const context = await resolveContext(input, signal(), async (link) => {
    reads++;
    if (link === input.link) return { link, html: home };
    if (link.endsWith("/contact")) throw new Error("Page unavailable");
    return { link: "https://external.com/services", html: `<p>${"Incorrect evidence ".repeat(30)}</p>` };
  });
  assert.equal(reads, 3);
  assert.equal(context.source, "website");
  assert.deepEqual(context.sourceLinks, [input.link]);
  assert.doesNotMatch(context.text, /Incorrect evidence/);
  const challenged = await resolveContext(input, signal(), async (link) => ({ link, html: link === input.link ? home : `<p>Verify you are human ${"challenge ".repeat(30)}</p>` }));
  assert.deepEqual(challenged.sourceLinks, [input.link]);
});

test("secondary redirects are rejected before connecting to another origin", async () => {
  const resolved: string[] = [];
  let connections = 0;
  await assert.rejects(fetchPublicPage("https://example.com/services", signal(), {
    resolve: async (host) => { resolved.push(host); return [{ address: "8.8.8.8", family: 4 }]; },
    read: async () => { connections++; return { status: 302, location: "https://other.example.com/booking", html: "" }; },
  }, "https://example.com"), /Page left the business website/);
  assert.deepEqual(resolved, ["example.com"]);
  assert.equal(connections, 1);
});

test("external cancellation is never swallowed as a secondary-page failure", async () => {
  const controller = new AbortController();
  await assert.rejects(resolveContext(input, controller.signal, async (link) => {
    if (link === input.link) return { link, html: home };
    controller.abort(new Error("Cancelled crawl"));
    throw controller.signal.reason;
  }), /Cancelled crawl/);
});
