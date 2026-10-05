import "server-only";
import type { BusinessContext, BusinessGoalId, IdeasRequest, IdeasResponse, IdeasResult } from "@/types/business-ideas";
import { requestSchema } from "./schema";
import { normaliseBusinessLink } from "./link";
import { IdeasError } from "./errors";

type Dependencies = {
  available: () => boolean;
  limit: (request: Request) => Promise<void>;
  resolve: (input: IdeasRequest, signal: AbortSignal) => Promise<BusinessContext>;
  generate: (goal: BusinessGoalId, context: BusinessContext, signal: AbortSignal) => Promise<IdeasResult>;
};

export async function readRequestBody(request: Request, signal: AbortSignal): Promise<unknown> {
  if (!request.body || Number(request.headers.get("content-length")) > 8192) {
    throw new IdeasError("invalid-input", "The request is too large or empty.", 413);
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener("abort", abort, { once: true });
  try {
    signal.throwIfAborted();
    while (true) {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      size += value.length;
      if (size > 8192) {
        void reader.cancel().catch(() => {});
        throw new IdeasError("invalid-input", "Keep your business description short.", 413);
      }
      chunks.push(value);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { throw new IdeasError("invalid-input", "Send a valid business link and goal."); }
  } finally {
    signal.removeEventListener("abort", abort);
    reader.releaseLock();
  }
}

export async function handleIdeasRequest(request: Request, deps: Dependencies): Promise<Response> {
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(45000)]);
  const reply = (body: IdeasResponse, status = 200) => Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...(status === 429 ? { "Retry-After": "600" } : {}),
    },
  });
  try {
    // No cross-origin form posts or anonymous server-to-server usage of paid generation.
    // Next may reconstruct Request.url with its internal hostname. Browser Origin
    // must match the actual Host and proxy protocol instead (never forwarded-host).
    const url = new URL(request.url);
    const host = request.headers.get("host") ?? url.host;
    const protocol = request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1);
    if (!["http", "https"].includes(protocol) || request.headers.get("origin") !== `${protocol}://${host}` ||
        request.headers.get("sec-fetch-site") === "cross-site") {
      throw new IdeasError("invalid-input", "Please use the business ideas form on this website.", 403);
    }
    if (!/^application\/json(?:;|$)/i.test(request.headers.get("content-type") ?? "")) {
      throw new IdeasError("invalid-input", "Send a JSON request.", 415);
    }
    const parsed = requestSchema.safeParse(await readRequestBody(request, signal));
    if (!parsed.success) throw new IdeasError("invalid-input", "Choose a goal, paste a valid link, and keep the description under 600 characters.");
    let link: string;
    try { link = parsed.data.link ? normaliseBusinessLink(parsed.data.link) : ""; }
    catch (error) { throw new IdeasError("invalid-input", (error as Error).message); }
    if (!deps.available()) throw new IdeasError("unavailable", "Personalised ideas are temporarily unavailable. You can still talk to Ben directly.", 503);
    await deps.limit(request);
    signal.throwIfAborted();
    const context = await deps.resolve({ ...parsed.data, link }, signal);
    signal.throwIfAborted();
    const result = await deps.generate(parsed.data.goal, context, signal);
    signal.throwIfAborted();
    return reply({ status: "success", result });
  } catch (error) {
    if (signal.aborted) return reply({ status: "error", code: "timeout", message: "That took too long. Please try again or talk to Ben directly." }, 504);
    if (error instanceof IdeasError) return reply({ status: "error", code: error.code, message: error.message }, error.httpStatus);
    // Never log external content, user input, provider response bodies or credentials.
    return reply({ status: "error", code: "generation-failed", message: "We couldn’t prepare reliable ideas this time. Please try again or talk to Ben directly." }, 502);
  }
}
