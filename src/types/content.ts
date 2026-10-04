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

export type ProfileLink = Readonly<{
  id: string;
  label: string;
  value: string;
  href?: string;
}>;

export type Principle = Readonly<{
  id: string;
  title: string;
  text: string;
}>;
