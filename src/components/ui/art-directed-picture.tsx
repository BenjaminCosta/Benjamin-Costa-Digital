import { getImageProps } from "next/image";

type PictureSource = Readonly<{ media: string; src: string; sizes: string }>;

type ArtDirectedPictureProps = Readonly<{
  src: string;
  sizes: string;
  /** Wider-screen crops, most specific media query first. */
  sources?: readonly PictureSource[];
  className: string;
  quality?: 50 | 75;
  eager?: boolean;
}>;

/**
 * Decorative photo that swaps to a different crop per breakpoint. Uses
 * <picture> so each screen only downloads its own file, with no client JS.
 */
export function ArtDirectedPicture({
  src,
  sizes,
  sources = [],
  className,
  quality = 50,
  eager = false,
}: ArtDirectedPictureProps) {
  const common = {
    alt: "",
    fill: true,
    quality,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : undefined,
  } as const;
  const { props } = getImageProps({ ...common, src, sizes });

  return (
    <div className={className} aria-hidden="true">
      <picture>
        {sources.map((source) => {
          const wide = getImageProps({ ...common, src: source.src, sizes: source.sizes }).props;
          return <source key={source.media} media={source.media} srcSet={wide.srcSet} sizes={wide.sizes} />;
        })}
        <img {...props} alt="" />
      </picture>
    </div>
  );
}
