import type { Brand } from "@/types/content";

// Most specific first: "Google Calendar" must not read as plain "Google".
const brandPatterns: ReadonlyArray<readonly [Brand, RegExp]> = [
  ["google-calendar", /\bgoogle calendar\b/i],
  ["gmail", /\bgmail\b/i],
  ["google", /\bgoogle\b/i],
  ["whatsapp", /\bwhats\s?app\b/i],
  ["instagram", /\binstagram\b/i],
  ["facebook", /\b(?:facebook|messenger)\b/i],
  ["tiktok", /\btik\s?tok\b/i],
  // Case-sensitive: "Square" the platform, not a square shape.
  ["square", /\bSquare\b/],
  ["shopify", /\bshopify\b/i],
  ["stripe", /\bstripe\b/i],
  ["xero", /\bxero\b/i],
  ["calendly", /\bcalendly\b/i],
];

/** The platform a piece of text mentions first, if it mentions one. */
export function brandIn(text: string): Brand | null {
  let found: Brand | null = null;
  let at = Infinity;
  for (const [brand, pattern] of brandPatterns) {
    const index = text.search(pattern);
    if (index !== -1 && index < at) {
      found = brand;
      at = index;
    }
  }
  return found;
}

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const wordCount = (value: string) => value.split(/\s+/).length;

/**
 * "Focused landing page; Direct booking to Square" → one deliverable per row.
 * Also reads a plain "A, B and C" list of short items; anything else stays a
 * single row rather than being cut mid-sentence.
 */
export function buildSteps(build: string): string[] {
  const text = build.trim().replace(/[\s.;]+$/, "");
  let steps = text.split(/\s*(?:;|\n|•)\s*/).filter(Boolean);

  if (steps.length === 1 && text.includes(",")) {
    const items = text.split(/\s*,\s*(?:and\s+)?/);
    const last = items.pop() ?? "";
    const tail = last.split(/\s+and\s+/);
    items.push(...(tail.length === 2 ? tail : [last]));
    if (items.length >= 3 && items.length <= 4 && items.every((item) => item && wordCount(item) <= 7)) {
      steps = items;
    }
  }

  return steps.slice(0, 4).map((step) => capitalise(step.replace(/\.$/, "")));
}
