import Image, { getImageProps } from "next/image";
import type { GlassIconName } from "@/types/content";

// Every glass icon is requested at one size, so the same file serves the row,
// the large heading icon and the cards: once loaded, a step never waits on it.
const SOURCE_SIZE = 192;
const props = (name: GlassIconName) =>
  ({ src: `/images/icons/${name}.png`, alt: "", width: SOURCE_SIZE, height: SOURCE_SIZE, quality: 75 }) as const;

type GlassIconProps = Readonly<{
  name: GlassIconName;
  /** Rendered size in CSS pixels; the PNG carries its own tile and shadow. */
  size: number;
  className?: string;
}>;

export function GlassIcon({ name, size, className }: GlassIconProps) {
  return (
    <Image
      {...props(name)}
      alt=""
      className={className ? `glass-icon ${className}` : "glass-icon"}
      style={{ width: size, height: size }}
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
