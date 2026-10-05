import "server-only";
import { z } from "zod";
import { businessGoals } from "@/data/business-goals";
import { serviceCatalog } from "@/data/service-catalog";
import type { BusinessAreaId, BusinessContext, BusinessGoalId } from "@/types/business-ideas";
import { IdeasError } from "./errors";

export const requestSchema = z.object({
  goal: z.enum(["more-bookings", "less-manual-work", "better-website", "build-an-idea", "not-sure"]),
  link: z.string().trim().max(2048).default(""),
  description: z.string().trim().max(600).default(""),
}).strict();

const text = (max: number) => z.string().trim().min(1).max(max);
export const generatedIdeasSchema = z.object({
  businessName: text(100),
  opportunities: z.array(z.object({
    area: z.enum(["local-presence", "conversion", "retention", "automation", "internal-tools", "ai", "website", "custom-tools", "apps", "e-commerce"]),
    title: text(100),
    explanation: text(400),
    build: text(300),
    basis: z.enum(["public-content", "your-description", "possibility"]),
    evidence: z.string().trim().min(8).max(240).nullable(),
  }).strict()).length(3),
}).strict();

export function allowedAreas(goalId: BusinessGoalId): BusinessAreaId[] {
  const goal = businessGoals.find((item) => item.id === goalId)!;
  return goal.selection === "automatic"
    ? Object.keys(serviceCatalog) as BusinessAreaId[]
    : goal.ideas.map((idea) => idea.area);
}

const comparable = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();

export function validateGeneratedIdeas(value: unknown, goal: BusinessGoalId, context: BusinessContext) {
  const parsed = generatedIdeasSchema.safeParse(value);
  if (!parsed.success) throw new IdeasError("generation-failed", "The ideas weren’t clear enough to share. Please try again or talk to Ben.", 502);
  const ideas = parsed.data.opportunities;
  const allowed = allowedAreas(goal);
  const name = comparable(parsed.data.businessName);
  const fallbackName = context.link ? new URL(context.link).hostname.toLowerCase() : "your business";
  if (name !== fallbackName && !comparable(`${context.text} ${context.description}`).includes(name)) {
    throw new IdeasError("generation-failed", "We couldn’t confirm the business name behind these ideas. Please try again or talk to Ben.", 502);
  }
  if (new Set(ideas.map((idea) => idea.area)).size !== 3 || new Set(ideas.map((idea) => comparable(idea.title))).size !== 3 || ideas.some((idea) => !allowed.includes(idea.area))) {
    throw new IdeasError("generation-failed", "The ideas didn’t match your goal. Please try again or talk to Ben.", 502);
  }
  for (const idea of ideas) {
    const source = idea.basis === "public-content" ? context.text : context.description;
    const valid = idea.basis === "possibility"
      ? idea.evidence === null
      : idea.evidence !== null && comparable(source).includes(comparable(idea.evidence));
    if (!valid) throw new IdeasError("generation-failed", "We couldn’t verify the context behind these ideas. Please try again or talk to Ben.", 502);
  }
  return parsed.data;
}
