import { getImageProps } from "next/image";
import type { ReactNode } from "react";

type PictureSource = Readonly<{ media: string; src: string; sizes: string }>;

type ArtDirectedPictureProps = Readonly<{
  src: string;
  /** What the photo shows. */
  alt: string;
  /** Section backgrounds are hidden from screen readers; a content photo is not. */
  decorative?: boolean;
  sizes: string;
  /** Wider-screen crops, most specific media query first. */
  sources?: readonly PictureSource[];
  className: string;
  quality?: 50 | 75;
  eager?: boolean;
  /** Drawn over the photo, inside its frame (e.g. a caption). */
  children?: ReactNode;
}>;

/**
 * Photo that swaps to a different crop per breakpoint. Uses <picture> so each
 * screen only downloads its own file, with no client JS.
 */
export function ArtDirectedPicture({
  src,
  alt,
  decorative = true,
  sizes,
  sources = [],
  className,
  quality = 50,
  eager = false,
  children,
}: ArtDirectedPictureProps) {
  const common = {
    alt,
    fill: true,
    quality,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : undefined,
  } as const;
  const { props } = getImageProps({ ...common, src, sizes });

  return (
    <div className={className} aria-hidden={decorative || undefined}>
      <picture>
        {sources.map((source) => {
          const wide = getImageProps({ ...common, src: source.src, sizes: source.sizes }).props;
          return <source key={source.media} media={source.media} srcSet={wide.srcSet} sizes={wide.sizes} />;
        })}
        <img {...props} alt={alt} />
      </picture>
      {children}
    </div>
  );
}
