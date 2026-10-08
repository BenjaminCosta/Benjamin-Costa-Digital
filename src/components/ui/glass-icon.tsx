import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { GlassIconName } from "@/types/content";

// Every glass icon is requested at one size, so the same file serves the row,
// the large heading icon and the cards: once loaded, a step never waits on it.
const SOURCE_SIZE = 192;

/** What each icon shows. Always next to its own label, so screen readers skip it. */
const alts: Readonly<Record<GlassIconName, string>> = {
  bag: "Glass shopping bag icon",
  calendar: "Glass calendar icon",
  "calendar-2": "Glass calendar icon",
  compass: "Glass compass icon",
  cubes: "Glass building blocks icon",
  flow: "Glass workflow icon",
  funnel: "Glass funnel icon",
  gear: "Glass gear icon",
  lightbulb: "Glass light bulb icon",
  "location-pin": "Glass location pin icon",
  monitor: "Glass computer monitor icon",
  search: "Glass magnifying glass icon",
  sparkle: "Glass sparkle icon",
  sync: "Glass refresh arrows icon",
  "window-clock": "Glass browser window with a clock icon",
};
const props = (name: GlassIconName) =>
  ({ src: `/images/icons/${name}.png`, alt: alts[name], width: SOURCE_SIZE, height: SOURCE_SIZE, quality: 75 }) as const;

type GlassIconProps = Readonly<{
  name: GlassIconName;
  /** Rendered size in CSS pixels (a parent can override it with --glass-fit);
   *  the PNG carries its own tile and shadow. */
  size: number;
  className?: string;
}>;

export function GlassIcon({ name, size, className }: GlassIconProps) {
  return (
    <Image
      {...props(name)}
      alt={alts[name]}
      aria-hidden="true"
      className={className ? `glass-icon ${className}` : "glass-icon"}
      style={{ "--glass-size": `${size}px` } as CSSProperties}
      draggable={false}
    />
  );
}

/** Warm the cache for icons the next step will show (client only). */
export function prefetchGlassIcons(names: readonly GlassIconName[]) {
  for (const name of names) {
    const { srcSet, src } = getImageProps(props(name)).props;
    const image = new window.Image();
    if (srcSet) image.srcset = srcSet;
    image.src = src;
  }
}
