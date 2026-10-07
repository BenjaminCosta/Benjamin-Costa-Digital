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
  /** Supplied brand assets; never recreate client lettering with a font. */
  isotipo?: string;
  wordmark?: Readonly<{
    src: string;
    width: number;
    height: number;
    viewBox: string;
  }>;
  /** Original capture, used when the live deployment has not been confirmed. */
  previewHref?: string;
}>;

export type Testimonial = Readonly<{
  id: string;
  quote: string;
  author: string;
  project: string;
  source: "Workana";
}>;

export type IdeaIconName =
  | "calendar"
  | "gear"
  | "monitor"
  | "bulb"
  | "compass"
  | "search"
  | "chart"
  | "users"
  | "flow"
  | "grid"
  | "sparkle"
  | "pin"
  | "cube"
  | "phone"
  | "bag";

export type IdeaAnswer = Readonly<{
  icon: IdeaIconName;
  title: string;
  text: string;
}>;

/** One of the starting options in the Business Ideas tool. */
export type IdeaOption = Readonly<{
  id: BusinessGoalId;
  label: string;
  icon: IdeaIconName;
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
