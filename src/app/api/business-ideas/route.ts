import { getIdeasConfig } from "@/lib/business-ideas/config";
import { generateIdeas } from "@/lib/business-ideas/generate-ideas";
import { handleIdeasRequest } from "@/lib/business-ideas/handle-request";
import { enforceRateLimit } from "@/lib/business-ideas/rate-limit";
import { resolveContext } from "@/lib/business-ideas/resolve-context";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleIdeasRequest(request, {
    available: () => getIdeasConfig().available,
    limit: enforceRateLimit,
    resolve: resolveContext,
    generate: generateIdeas,
  });
}
