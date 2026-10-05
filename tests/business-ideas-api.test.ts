import assert from "node:assert/strict";
import test from "node:test";
import { MockLanguageModelV4 } from "ai/test";
import { createOpenAI } from "@ai-sdk/openai";
import { handleIdeasRequest } from "../src/lib/business-ideas/handle-request";
import { generateIdeas } from "../src/lib/business-ideas/generate-ideas";
import { IdeasError } from "../src/lib/business-ideas/errors";
import { resolveContext } from "../src/lib/business-ideas/resolve-context";
import { enforceRateLimit } from "../src/lib/business-ideas/rate-limit";
import { getIdeasConfig } from "../src/lib/business-ideas/config";
import type { BusinessContext, IdeasResult } from "../src/types/business-ideas";

const request = (body: unknown, headers = {}, signal?: AbortSignal) => new Request("https://example.com/api/business-ideas", {
  method: "POST", headers: { Origin: "https://example.com", "Content-Type": "application/json", ...headers }, body: JSON.stringify(body), signal,
});
const input = { goal: "more-bookings", link: "example.com", description: "Example Barbers is a local barbershop. We want more repeat bookings." };
const context: BusinessContext = { link: "https://example.com/", source: "description", text: "", description: input.description };
const generated = {
  businessName: "example.com",
  opportunities: ["local-presence", "conversion", "retention"].map((area) => ({
    area, title: `Explore ${area}`, explanation: "This could help customers book.", build: "A focused booking journey.", basis: "possibility", evidence: null,
  })),
};

function mockModel(value: unknown = generated) {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: "text", text: JSON.stringify(value) }], finishReason: { unified: "stop", raw: undefined },
      usage: { inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 20, text: 20, reasoning: undefined } }, warnings: [],
    }),
  });
}
const defaults = {
  available: () => true, limit: async () => {},
  resolve: async () => context,
  generate: async (): Promise<IdeasResult> => ({ ...generated, link: context.link, source: context.source } as IdeasResult),
};

test("full API pipeline uses actual AI SDK structured output with a test-only mock provider", async () => {
  const model = mockModel({ ...generated, businessName: "Example Barbers" });
  const calls: string[] = [];
  const response = await handleIdeasRequest(request(input), {
    ...defaults,
    limit: async () => { calls.push("limit"); },
    resolve: async (body, signal) => { calls.push("context"); assert.equal(body.link, "https://example.com/"); return resolveContext({ ...body, link: "https://instagram.com/test" }, signal); },
    generate: async (goal, source, signal) => { calls.push("generate"); return generateIdeas(goal, source, signal, model); },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  const body = await response.json();
  assert.equal(body.status, "success");
  assert.equal(body.result.opportunities.length, 3);
  assert.equal(body.result.source, "description");
  assert.deepEqual(calls, ["limit", "context", "generate"]);
  assert.equal(model.doGenerateCalls.length, 1);
  assert.equal(model.doGenerateCalls[0].tools, undefined);
  assert.equal(model.doGenerateCalls[0].maxOutputTokens, 1600);
  assert.equal(model.doGenerateCalls[0].reasoning, "none");
  assert.match(JSON.stringify(model.doGenerateCalls[0].prompt), /UNTRUSTED DATA/);
});

test("all five goals pass through scoped generation including automatic area selection", async () => {
  const mapping = {
    "more-bookings": ["local-presence", "conversion", "retention"],
    "less-manual-work": ["automation", "internal-tools", "ai"],
    "better-website": ["website", "conversion", "local-presence"],
    "build-an-idea": ["custom-tools", "apps", "e-commerce"],
    "not-sure": ["conversion", "ai", "retention"],
  } as const;
  for (const [goal, areas] of Object.entries(mapping)) {
    const value = { ...generated, opportunities: areas.map((area) => ({ ...generated.opportunities[0], area, title: `Explore ${area}` })) };
    const response = await handleIdeasRequest(request({ ...input, goal }), {
      ...defaults, generate: (id, source, signal) => generateIdeas(id, source, signal, mockModel(value)),
    });
    assert.equal(response.status, 200, goal);
    assert.deepEqual((await response.json()).result.opportunities.map((item: { area: string }) => item.area), areas);
  }
});

test("businesses without a website use owner context and one generation, never network discovery", async () => {
  const model = mockModel({ ...generated, businessName: "Example Barbers" });
  const response = await handleIdeasRequest(request({ ...input, link: "" }), {
    ...defaults,
    resolve: (body, signal) => resolveContext(body, signal, async () => { throw new Error("Must not fetch"); }),
    generate: (goal, source, signal) => generateIdeas(goal, source, signal, model),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.source, "description");
  assert.equal(body.result.link, "");
  assert.deepEqual(body.result.sourceLinks, []);
  assert.equal(body.result.opportunities.length, 3);
  assert.equal(model.doGenerateCalls.length, 1);

  let generations = 0;
  const missing = await handleIdeasRequest(request({ goal: "not-sure", link: "", description: "" }), {
    ...defaults,
    resolve: (body, signal) => resolveContext(body, signal),
    generate: async () => { generations++; return defaults.generate(); },
  });
  assert.equal(missing.status, 422);
  assert.equal((await missing.json()).code, "needs-context");
  assert.equal(generations, 0);
});

test("multi-page website context reaches one generation and returns only the sources read", async () => {
  const model = mockModel({ ...generated, businessName: "Example Barbers" });
  const description = "Example Barbers offers haircuts and appointments on the Gold Coast. ".repeat(5);
  const response = await handleIdeasRequest(request({ ...input, description: "" }), {
    ...defaults,
    resolve: (body, signal) => resolveContext(body, signal, async (link) => ({
      link, html: `<main><p>${description}</p></main>${link.endsWith("/") ? '<a href="/booking">Book</a>' : ""}`,
    })),
    generate: (goal, source, signal) => generateIdeas(goal, source, signal, model),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.source, "website");
  assert.deepEqual(body.result.sourceLinks, ["https://example.com/", "https://example.com/booking"]);
  assert.equal(body.result.opportunities.length, 3);
  assert.equal(model.doGenerateCalls.length, 1);
});

test("direct OpenAI adapter sends the bounded structured contract without storage or premium tier", async () => {
  let requests = 0;
  const openai = createOpenAI({
    apiKey: "test-only-unused",
    fetch: async (url, init) => {
      requests++;
      assert.equal(String(url), "https://api.openai.com/v1/responses");
      const body = JSON.parse(String(init?.body));
      assert.equal(body.model, "gpt-6-luna");
      assert.equal(body.reasoning.effort, "none");
      assert.equal(body.max_output_tokens, 1600);
      assert.equal(body.store, false);
      assert.equal(body.service_tier, "default");
      assert.equal(body.text.format.type, "json_schema");
      assert.equal(body.text.format.strict, true);
      assert.equal(body.tools?.length ?? 0, 0);
      return Response.json({
        id: "test-response", model: "gpt-6-luna",
        output: [{ id: "test-message", type: "message", role: "assistant", content: [{ type: "output_text", text: JSON.stringify(generated), annotations: [] }] }],
        usage: { input_tokens: 10, output_tokens: 20, total_tokens: 30 },
      });
    },
  });
  const result = await generateIdeas("more-bookings", context, new AbortController().signal, openai.responses("gpt-6-luna"));
  assert.equal(result.opportunities.length, 3);
  assert.equal(requests, 1);
});

test("generation bounds page context and validates evidence against only that excerpt", async () => {
  const longContext = { ...context, source: "website" as const, text: "x".repeat(6000) + "This quote is outside the supplied excerpt." };
  const model = mockModel();
  await generateIdeas("more-bookings", longContext, new AbortController().signal, model);
  const call = model.doGenerateCalls[0];
  const user = call.prompt.find((message) => message.role === "user")!;
  assert.equal(user.role, "user");
  if (user.role !== "user") throw new Error("Expected user data");
  const part = user.content.find((content) => content.type === "text")!;
  if (part.type !== "text") throw new Error("Expected JSON text");
  const data = JSON.parse(part.text);
  assert.equal(data.publicText.length, 6000);
  assert.equal(data.allowedServices, undefined);
  const system = call.prompt.find((message) => message.role === "system")!;
  assert.match(JSON.stringify(system), /Approved scope/);
  assert.match(JSON.stringify(system), /local-presence/);
  assert.doesNotMatch(JSON.stringify(system), /"id":"apps"/);
  const fabricated = { ...generated, opportunities: generated.opportunities.map((item, index) => index === 0
    ? { ...item, basis: "public-content", evidence: "This quote is outside the supplied excerpt." }
    : item) };
  await assert.rejects(generateIdeas("more-bookings", longContext, new AbortController().signal, mockModel(fabricated)), IdeasError);
});

test("provider failure never triggers a second paid generation", async () => {
  const model = new MockLanguageModelV4({ doGenerate: async () => { throw new Error("Transient provider error"); } });
  await assert.rejects(generateIdeas("more-bookings", context, new AbortController().signal, model));
  assert.equal(model.doGenerateCalls.length, 1);
});

test("WhatsApp and economical model defaults work without secrets and support overrides", () => {
  const names = ["WHATSAPP_NUMBER", "BUSINESS_IDEAS_MODEL", "OPENAI_API_KEY"];
  const saved = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    for (const name of names) delete process.env[name];
    assert.equal(getIdeasConfig().whatsappNumber, "61409871882");
    assert.equal(getIdeasConfig().model, "gpt-6-luna");
    assert.equal(getIdeasConfig().available, false);
    process.env.WHATSAPP_NUMBER = "+61 409 871 882";
    process.env.BUSINESS_IDEAS_MODEL = "gpt-6-sol";
    assert.equal(getIdeasConfig().whatsappNumber, "61409871882");
    assert.equal(getIdeasConfig().model, "gpt-6-sol");
    process.env.WHATSAPP_NUMBER = "invalid";
    assert.equal(getIdeasConfig().whatsappNumber, null);
  } finally {
    for (const name of names) { if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name]; }
  }
});

test("invalid JSON contracts, origin, content-type and oversized bodies never call paid generation", async () => {
  let generations = 0;
  const deps = { ...defaults, generate: async () => { generations++; return defaults.generate(); } };
  for (const [req, expected] of [
    [request({ ...input, goal: "unknown" }), 400],
    [request({ ...input, link: "http://127.0.0.1" }), 400],
    [request(input, { Origin: "https://other.example" }), 403],
    [request(input, { "Content-Type": "text/plain" }), 415],
    [request({ ...input, description: "a".repeat(9000) }), 413],
  ] as const) assert.equal((await handleIdeasRequest(req, deps)).status, expected);
  assert.equal(generations, 0);
});

test("disabled configuration never extracts a page or generates", async () => {
  const response = await handleIdeasRequest(request(input), {
    ...defaults, available: () => false,
    resolve: async () => { throw new Error("Must not read"); },
    generate: async () => { throw new Error("Must not generate"); },
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "unavailable");
});

test("same-origin requests work behind Next’s internal hostname and HTTPS proxy", async () => {
  const response = await handleIdeasRequest(request(input, { Host: "public.example.com", Origin: "https://public.example.com", "x-forwarded-proto": "https" }), defaults);
  assert.equal(response.status, 200);
  const forged = await handleIdeasRequest(request(input, { Host: "public.example.com", Origin: "https://attacker.example.com", "x-forwarded-proto": "https" }), defaults);
  assert.equal(forged.status, 403);
});

test("rate limit and missing context return actionable errors before generation", async () => {
  const limited = await handleIdeasRequest(request(input), { ...defaults, limit: async () => { throw new IdeasError("rate-limited", "Wait", 429); } });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");
  const noContext = await handleIdeasRequest(request({ ...input, link: "https://instagram.com/test", description: "" }), {
    ...defaults, resolve: resolveContext, generate: async () => { throw new Error("Must not generate"); },
  });
  assert.equal(noContext.status, 422);
  assert.equal((await noContext.json()).code, "needs-context");
});

test("malformed model output and provider errors are not exposed to visitors", async () => {
  const bad = await handleIdeasRequest(request(input), { ...defaults, generate: (goal, source, signal) => generateIdeas(goal, source, signal, mockModel({ ...generated, opportunities: [] })) });
  assert.equal(bad.status, 502);
  const provider = await handleIdeasRequest(request(input), { ...defaults, generate: async () => { throw new Error("secret-provider-key-and-body"); } });
  assert.equal(provider.status, 502);
  assert.doesNotMatch(await provider.text(), /secret-provider/);
});

test("cancelled requests stop before generation", async () => {
  const active = new AbortController();
  active.abort();
  const response = await handleIdeasRequest(request(input, {}, active.signal), { ...defaults, generate: async () => { throw new Error("Must not generate"); } });
  assert.equal(response.status, 504);
});

test("production configuration and firewall checks fail closed on absent rules", async () => {
  const names = ["NODE_ENV", "VERCEL", "VERCEL_URL", "BUSINESS_IDEAS_ENABLED", "OPENAI_API_KEY", "BUSINESS_IDEAS_IP_RULE", "BUSINESS_IDEAS_GLOBAL_RULE"];
  const saved = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL: "1", VERCEL_URL: "deployment.vercel.app", BUSINESS_IDEAS_ENABLED: "true", OPENAI_API_KEY: "test-only-unused", BUSINESS_IDEAS_IP_RULE: "ideas-ip", BUSINESS_IDEAS_GLOBAL_RULE: "ideas-global" });
    delete process.env.BUSINESS_IDEAS_GLOBAL_RULE;
    assert.equal(getIdeasConfig().available, false);
    process.env.BUSINESS_IDEAS_GLOBAL_RULE = "ideas-global";
    assert.equal(getIdeasConfig().available, true);
    await assert.rejects(enforceRateLimit(request(input), async () => ({ rateLimited: false, error: "not-found" })), (error: unknown) => error instanceof IdeasError && error.code === "unavailable");
    await assert.rejects(enforceRateLimit(request(input), async () => ({ rateLimited: true })), (error: unknown) => error instanceof IdeasError && error.code === "rate-limited");
    const keys: (string | undefined)[] = [];
    await enforceRateLimit(request(input), async (_id, options) => { keys.push(options?.rateLimitKey); assert.equal(new Headers(options?.headers as Headers).get("host"), "deployment.vercel.app"); return { rateLimited: false }; });
    assert.deepEqual(keys, [undefined, "business-ideas-budget"]);
    process.env.VERCEL = "0";
    assert.equal(getIdeasConfig().available, false);
  } finally {
    for (const name of names) { if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name]; }
  }
});
