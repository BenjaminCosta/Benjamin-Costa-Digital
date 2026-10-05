import assert from "node:assert/strict";
import test from "node:test";
import { businessGoals } from "../src/data/business-goals";
import { normaliseBusinessLink, isSocialBusinessLink } from "../src/lib/business-ideas/link";
import { normaliseWhatsAppNumber, buildWhatsAppLink } from "../src/lib/business-ideas/whatsapp";
import { allowedAreas, requestSchema, validateGeneratedIdeas } from "../src/lib/business-ideas/schema";
import { extractPageText, resolveContext } from "../src/lib/business-ideas/resolve-context";
import { fetchPublicPage, isPublicAddress } from "../src/lib/business-ideas/safe-page";
import { IdeasError } from "../src/lib/business-ideas/errors";
import type { BusinessContext, IdeasRequest, Opportunity } from "../src/types/business-ideas";

const signal = () => new AbortController().signal;
const context: BusinessContext = {
  link: "https://example.com/", source: "website",
  text: "Example Barbers is a Gold Coast barbershop. Book a haircut online.",
  description: "We would like more repeat bookings.",
};
const idea = (area: Opportunity["area"]): Opportunity => ({
  area, title: `Explore ${area}`, explanation: "This could help the business.",
  build: "A focused first version.", basis: "possibility", evidence: null,
});
const result = (areas: Opportunity["area"][] = ["local-presence", "conversion", "retention"]) => ({
  businessName: "Example Barbers", opportunities: areas.map(idea),
});
const input: IdeasRequest = { goal: "more-bookings", link: context.link, description: "" };

test("normalises public domains and drops fragments/advertising tracking", () => {
  assert.equal(normaliseBusinessLink(" example.com.au/?utm_source=x#about "), "https://example.com.au/");
  assert.equal(normaliseBusinessLink("https://www.instagram.com/mybusiness/"), "https://www.instagram.com/mybusiness/");
  assert.equal(normaliseBusinessLink("http://example.com:80/"), "http://example.com/");
  assert.equal(normaliseBusinessLink("https://google.com/maps?q=barber"), "https://google.com/maps?q=barber");
});

test("rejects schemes, credentials, nonstandard ports and literal/encoded local addresses", () => {
  for (const value of ["", "javascript:alert(1)", "file:///etc/passwd", "ftp://example.com", "//example.com", "https://name:password@example.com", "localhost", "127.0.0.1", "http://2130706433", "http://0x7f000001", "http://0177.0.0.1", "http://[::1]", "https://example.com:8000", "http://my.local", "http://foo.internal", "http://foo.test", "https://example.com\\@localhost", "https://example.com/\nsecret", "https://example.com/" + "a".repeat(2048)]) {
    assert.throws(() => normaliseBusinessLink(value), Error, value);
  }
});

test("identifies social links without matching lookalike domains", () => {
  for (const link of ["https://instagram.com/business", "https://maps.app.goo.gl/abc", "https://g.page/business", "https://www.google.com.au/maps"]) assert.equal(isSocialBusinessLink(link), true);
  assert.equal(isSocialBusinessLink("https://instagram.com.example.com/"), false);
});

test("approved goal areas are exactly the user’s catalogue mapping", () => {
  assert.deepEqual(allowedAreas("more-bookings"), ["local-presence", "conversion", "retention"]);
  assert.deepEqual(allowedAreas("less-manual-work"), ["automation", "internal-tools", "ai"]);
  assert.deepEqual(allowedAreas("better-website"), ["website", "conversion", "local-presence"]);
  assert.deepEqual(allowedAreas("build-an-idea"), ["custom-tools", "apps", "ai", "e-commerce"]);
  assert.equal(allowedAreas("not-sure").length, 10);
  assert.equal(businessGoals.find((goal) => goal.id === "not-sure")?.ideas.length, 0);
});

test("request schema rejects unexpected properties, unknown goals and long descriptions", () => {
  assert.equal(requestSchema.safeParse({ ...input, extra: "secret" }).success, false);
  assert.equal(requestSchema.safeParse({ ...input, goal: "other" }).success, false);
  assert.equal(requestSchema.safeParse({ ...input, description: "a".repeat(601) }).success, false);
  assert.equal(requestSchema.parse({ goal: input.goal, link: input.link }).description, "");
});

test("output enforces exactly three distinct approved areas", () => {
  assert.equal(validateGeneratedIdeas(result(), "more-bookings", context).opportunities.length, 3);
  for (const areas of [["conversion", "retention"], ["conversion", "conversion", "retention"], ["ai", "retention", "conversion"], ["local-presence", "conversion", "retention", "ai"]] as Opportunity["area"][][]) {
    assert.throws(() => validateGeneratedIdeas(result(areas), "more-bookings", context), IdeasError);
  }
  assert.equal(validateGeneratedIdeas(result(["apps", "ai", "retention"]), "not-sure", context).opportunities.length, 3);
});

test("observations must cite the actual source, not fabricated evidence", () => {
  const generated = result();
  generated.opportunities[0] = { ...idea("local-presence"), basis: "public-content", evidence: "Gold Coast barbershop" };
  generated.opportunities[1] = { ...idea("conversion"), basis: "your-description", evidence: "more repeat bookings" };
  assert.doesNotThrow(() => validateGeneratedIdeas(generated, "more-bookings", context));
  generated.opportunities[0] = { ...generated.opportunities[0], evidence: "500 verified reviews" };
  assert.throws(() => validateGeneratedIdeas(generated, "more-bookings", context), IdeasError);
  generated.opportunities[0] = { ...idea("local-presence"), evidence: "a fake quote" };
  assert.throws(() => validateGeneratedIdeas(generated, "more-bookings", context), IdeasError);
});

test("business names and distinct titles are validated, not trusted blindly", () => {
  assert.throws(() => validateGeneratedIdeas({ ...result(), businessName: "Invented Business" }, "more-bookings", context), IdeasError);
  const repeated = { ...result(), opportunities: result().opportunities.map((item) => ({ ...item, title: "Repeated idea" })) };
  assert.throws(() => validateGeneratedIdeas(repeated, "more-bookings", context), IdeasError);
});

test("description-only results have a safe generic name fallback and no fake website in WhatsApp", () => {
  const source = { ...context, link: "", text: "", source: "description" as const };
  assert.doesNotThrow(() => validateGeneratedIdeas({ ...result(), businessName: "Your business" }, "more-bookings", source));
  assert.throws(() => validateGeneratedIdeas({ ...result(), businessName: "Invented business" }, "more-bookings", source), IdeasError);
  const url = new URL(buildWhatsAppLink("61409871882", { ...input, link: "", description: source.description }));
  assert.match(url.searchParams.get("text")!, /more repeat bookings/);
  assert.doesNotMatch(url.searchParams.get("text")!, /Here’s my link/);
});

test("extracts bounded decoded text, excluding scripts/styles/hidden content", () => {
  const text = extractPageText('<title>Example Barbers</title><meta name="description" content="Haircuts &amp; bookings"><script>bad instructions</script><style>bad css</style><nav>Menu</nav><main><h1>Gold Coast</h1><p hidden>secret</p><div aria-hidden="true">secret2</div><div style="display:none">secret3</div><p>Book &amp; return</p></main><footer>Links</footer>');
  assert.match(text, /Example Barbers/);
  assert.match(text, /Haircuts & bookings/);
  assert.match(text, /Book & return/);
  assert.doesNotMatch(text, /bad|secret|Menu|Links/);
  assert.equal(extractPageText(`<p>${"x".repeat(15000)}</p>`).length, 6000);
});

test("social links require owner context and never claim to have scraped a profile", async () => {
  const social = { ...input, link: "https://instagram.com/example" };
  const neverRead = async () => { throw new Error("Should not be called"); };
  await assert.rejects(resolveContext(social, signal(), neverRead), (error: unknown) => error instanceof IdeasError && error.code === "needs-context");
  const resolved = await resolveContext({ ...social, description: context.description }, signal(), neverRead);
  assert.equal(resolved.source, "description");
  assert.equal(resolved.text, "");
});

test("unreadable pages recover through context, unsafe links do not", async () => {
  const unavailable = async () => { throw new Error("403 public page"); };
  await assert.rejects(resolveContext(input, signal(), unavailable), (error: unknown) => error instanceof IdeasError && error.code === "needs-context");
  assert.equal((await resolveContext({ ...input, description: context.description }, signal(), unavailable)).source, "description");
  await assert.rejects(resolveContext({ ...input, description: context.description }, signal(), async () => { throw new IdeasError("unsafe-link", "Blocked"); }), /Blocked/);
});

test("public IP validation blocks private/reserved/mapped IPv6 destinations", () => {
  for (const address of ["127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "192.0.2.1", "198.18.0.1", "240.0.0.1", "224.0.0.1", "::1", "fc00::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:8.8.8.8", "2001:db8::1", "2002:7f00:1::", "not an ip"]) assert.equal(isPublicAddress(address), false, address);
  assert.equal(isPublicAddress("8.8.8.8"), true);
  assert.equal(isPublicAddress("2606:4700:4700::1111"), true);
});

test("DNS validation rejects mixed public/private records before connecting", async () => {
  let connections = 0;
  await assert.rejects(fetchPublicPage(input.link, signal(), {
    resolve: async () => [{ address: "8.8.8.8", family: 4 }, { address: "127.0.0.1", family: 4 }],
    read: async () => { connections++; return { status: 200, html: "" }; },
  }), (error: unknown) => error instanceof IdeasError && error.code === "unsafe-link");
  assert.equal(connections, 0);
});

test("redirects are revalidated and connections use the pinned DNS address", async () => {
  let reads = 0;
  const resolved: string[] = [];
  await assert.rejects(fetchPublicPage(input.link, signal(), {
    resolve: async (host) => { resolved.push(host); return [{ address: host === "private.example.com" ? "10.0.0.1" : "8.8.8.8", family: 4 }]; },
    read: async (_url, address) => { reads++; assert.equal(address.address, "8.8.8.8"); return { status: 302, location: "https://private.example.com/", html: "" }; },
  }), IdeasError);
  assert.equal(reads, 1);
  assert.deepEqual(resolved, ["example.com", "private.example.com"]);
  await assert.rejects(fetchPublicPage(input.link, signal(), {
    resolve: async () => [{ address: "8.8.8.8", family: 4 }],
    read: async () => ({ status: 302, location: "http://169.254.169.254/latest/meta-data/", html: "" }),
  }), IdeasError);
});

test("redirect loops and aborted DNS lookups are bounded", async () => {
  let reads = 0;
  await assert.rejects(fetchPublicPage(input.link, signal(), {
    resolve: async () => [{ address: "8.8.8.8", family: 4 }],
    read: async () => { reads++; return { status: 302, location: "/again", html: "" }; },
  }), /Too many redirects/);
  assert.equal(reads, 4);
  const active = new AbortController();
  const pending = fetchPublicPage(input.link, active.signal, { resolve: () => new Promise(() => {}), read: async () => ({ status: 200, html: "" }) });
  active.abort(new Error("Cancelled"));
  await assert.rejects(pending, /Cancelled/);
});

test("WhatsApp is encoded, configurable and includes business + goal + context + ideas", () => {
  assert.equal(normaliseWhatsAppNumber("+61 409 871 882"), "61409871882");
  assert.equal(normaliseWhatsAppNumber("+61 (400) 123-456"), "61400123456");
  assert.equal(normaliseWhatsAppNumber(""), null);
  assert.equal(normaliseWhatsAppNumber("0412345678"), null);
  const url = new URL(buildWhatsAppLink("61400123456", { ...input, description: "Barbers & bookings" }, { ...result(), link: input.link, source: "website" }));
  const message = url.searchParams.get("text")!;
  assert.equal(url.hostname, "wa.me");
  assert.match(message, /Example Barbers/);
  assert.match(message, /I need more bookings/);
  assert.match(message, /https:\/\/example.com\//);
  assert.match(message, /Barbers & bookings/);
  assert.match(message, /Explore retention/);
  assert.throws(() => buildWhatsAppLink("invalid", input));
});
