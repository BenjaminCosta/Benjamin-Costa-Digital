export type ImageAsset = Readonly<{
  src: string;
  alt: string;
}>;

export type Project = Readonly<{
  id: string;
  name: string;
  location: string;
  services: readonly string[];
  summary: string;
  href?: string;
  image?: ImageAsset;
}>;

export type AvatarTone = Readonly<{
  background: string;
  foreground: string;
}>;

export type Testimonial = Readonly<{
  id: string;
  quote: string;
  author: string;
  project: string;
  source: "Workana";
  avatar: AvatarTone;
}>;

export type ProfileLink = Readonly<{
  id: string;
  label: string;
  value: string;
  href?: string;
}>;
