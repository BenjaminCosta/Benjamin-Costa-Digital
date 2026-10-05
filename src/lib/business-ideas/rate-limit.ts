import "server-only";
import { checkRateLimit } from "@vercel/firewall";
import { IdeasError } from "./errors";
import { getIdeasConfig } from "./config";

// Deliberately only a local-development fallback. No personal data is retained.
let localWindow = { start: 0, count: 0 };
export async function enforceRateLimit(request: Request, check = checkRateLimit) {
  const config = getIdeasConfig();
  if (!config.onVercel) {
    if (process.env.NODE_ENV === "production") throw new IdeasError("unavailable", "Personalised ideas are temporarily unavailable. You can still talk to Ben.", 503);
    const now = Date.now();
    if (now - localWindow.start >= 600000) localWindow = { start: now, count: 0 };
    if (++localWindow.count > 10) throw new IdeasError("rate-limited", "That’s a few requests in a short time. Please try again in ten minutes or talk to Ben.", 429);
    return;
  }
  if (!config.rateLimitRule) throw new IdeasError("unavailable", "Personalised ideas are temporarily unavailable. You can still talk to Ben.", 503);
  try {
    // The SDK uses Host to contact its API. Use deployment configuration, not a caller-supplied Host.
    const host = process.env.VERCEL_URL;
    if (!host || !/^[a-z\d.-]+$/i.test(host)) throw new Error("Missing deployment hostname");
    const headers = new Headers(request.headers);
    headers.set("host", host);
    const withinDeadline = <T,>(promise: Promise<T>) => {
      let timer: ReturnType<typeof setTimeout>;
      return Promise.race([promise, new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Rate limiter timeout")), 5000);
      })]).finally(() => clearTimeout(timer));
    };
    // Hobby allows one rate-limit rule. The same ID has independent buckets:
    // the SDK's trusted client-IP default, then a shared budget key.
    // Both buckets intentionally use the same dashboard limit/window.
    const ip = await withinDeadline(check(config.rateLimitRule, { headers }));
    if (ip.error === "not-found") throw new Error("Missing IP rule");
    if (ip.rateLimited) throw new IdeasError("rate-limited", "Please try again in ten minutes or talk to Ben directly.", 429);
    const global = await withinDeadline(check(config.rateLimitRule, { headers, rateLimitKey: "business-ideas-budget" }));
    if (global.error === "not-found") throw new Error("Missing global rule");
    if (global.rateLimited) throw new IdeasError("rate-limited", "The ideas tool is busy. Please try again later or talk to Ben directly.", 429);
  } catch (error) {
    if (error instanceof IdeasError) throw error;
    throw new IdeasError("unavailable", "Personalised ideas are temporarily unavailable. You can still talk to Ben.", 503);
  }
}
