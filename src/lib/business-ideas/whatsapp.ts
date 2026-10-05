import { businessGoals } from "@/data/business-goals";
import type { IdeasRequest, IdeasResult } from "@/types/business-ideas";

export function normaliseWhatsAppNumber(value: string | undefined): string | null {
  const number = value?.trim().replace(/[+\s()-]/g, "") ?? "";
  return /^[1-9]\d{6,14}$/.test(number) ? number : null;
}

export function buildWhatsAppLink(number: string, input: IdeasRequest, result?: IdeasResult): string {
  if (!normaliseWhatsAppNumber(number)) throw new Error("Invalid WhatsApp number.");
  const goal = businessGoals.find((item) => item.id === input.goal)?.label ?? input.goal;
  const lines = [
    result ? "Hey Ben, I tried the business ideas tool." : "Hey Ben, I’d love your take on my business.",
    `My business: ${result?.businessName ?? (input.link || "Described below")}`,
    `I selected: ${goal}`,
  ];
  if (input.link) lines.push(`Here’s my link: ${input.link}`);
  if (input.description.trim()) lines.push(`Context: ${input.description.trim().slice(0, 600)}`);
  if (result) lines.push(`Ideas: ${result.opportunities.map((idea) => idea.title).join("; ")}`);
  lines.push("Would love your take.");
  return `https://wa.me/${normaliseWhatsAppNumber(number)}?text=${encodeURIComponent(lines.join("\n"))}`;
}
