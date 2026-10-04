export type Project = Readonly<{
  id: string;
  name: string;
  location: string;
  services: readonly string[];
  summary: string;
  href?: string;
}>;

export type Testimonial = Readonly<{
  id: string;
  quote: string;
  author: string;
  project: string;
  source: "Workana";
}>;
