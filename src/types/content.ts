import type { BusinessGoalId } from "./business-ideas";

export type ImageAsset = Readonly<{
  src: string;
  alt: string;
}>;

export type Project = Readonly<{
  id: string;
  name: string;
  /** Industry, e.g. "Barbershop". Shown as "Industry · Location". */
  category?: string;
  location: string;
  /** What the problem was → what was built → what changed, in about 30–35 words. */
  summary: string;
  href?: string;
  image?: ImageAsset;
  /** Supplied brand assets; never recreate client lettering with a font. */
  isotipo?: string;
  wordmark?: Readonly<{
    src: string;
    width: number;
    height: number;
    /**
     * Desktop width in px. Set per logo from its proportions and ink weight
     * so every wordmark reads at the same visual size.
     */
    display: number;
  }>;
  /** User-approved preview destination, with priority over the main website. */
  previewHref?: string;
}>;

export type Testimonial = Readonly<{
  id: string;
  quote: string;
  originalQuote: string;
  author: string;
  project: string;
  tags: readonly string[];
  rating: 5;
  featured: boolean;
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
