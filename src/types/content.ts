import type { BusinessGoalId } from "./business-ideas";

export type ImageAsset = Readonly<{
  src: string;
  alt: string;
}>;

export type Project = Readonly<{
  id: string;
  name: string;
  /** Business type, e.g. "Barbershop". Shown with the location on desktop. */
  category?: string;
  location: string;
  services: readonly string[];
  /** One-line summary used on small screens. */
  summary: string;
  /** Longer case-study blurb used where there is room for it. */
  description?: string;
  href?: string;
  image?: ImageAsset;
}>;

export type Testimonial = Readonly<{
  id: string;
  quote: string;
  author: string;
  project: string;
  source: "Workana";
}>;

/** 3D glass icons in /public/images/icons (file name without extension). */
export type GlassIconName =
  | "bag"
  | "calendar"
  | "calendar-2"
  | "compass"
  | "cubes"
  | "flow"
  | "funnel"
  | "gear"
  | "lightbulb"
  | "location-pin"
  | "monitor"
  | "search"
  | "sparkle"
  | "sync"
  | "window-clock";

/** Platforms with an official mark we can show next to an idea. */
export type Brand =
  | "google"
  | "google-calendar"
  | "gmail"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "square"
  | "shopify"
  | "stripe"
  | "xero"
  | "calendly"
  | "google-analytics"
  | "zapier"
  | "airtable"
  | "supabase"
  | "firebase"
  | "figma"
  | "claude";

export type IdeaAnswer = Readonly<{
  icon: GlassIconName;
  title: string;
  text: string;
}>;

/** One of the starting options in the Business Ideas tool. */
export type IdeaOption = Readonly<{
  id: BusinessGoalId;
  label: string;
  icon: GlassIconName;
  /** Line shown above the instant answers (or on its own when there are none). */
  intro: string;
  answers: readonly IdeaAnswer[];
  /** Options that skip the instant answers and go straight to the form. */
  direct?: boolean;
}>;

/** Where a generated idea comes from. */
export type IdeaBasis = "public" | "owner" | "explore";

/** A personalised opportunity returned by the ideas generator. */
export type BusinessIdea = Readonly<{
  id: string;
  title: string;
  summary: string;
  build: string;
  basis?: IdeaBasis;
}>;
