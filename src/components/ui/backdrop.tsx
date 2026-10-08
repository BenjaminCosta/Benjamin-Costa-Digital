import { ArtDirectedPicture } from "@/components/ui/art-directed-picture";

type BackdropProps = Readonly<{
  src: string;
  /** What the photo shows (the backdrop itself stays hidden from screen readers). */
  alt: string;
  sizes: string;
  /** Landscape crop used from the desktop breakpoint up. */
  desktopSrc?: string;
  desktopSizes?: string;
  className?: string;
}>;

export function Backdrop({
  src,
  alt,
  sizes,
  desktopSrc,
  desktopSizes = "100vw",
  className,
}: BackdropProps) {
  return (
    <ArtDirectedPicture
      src={src}
      alt={alt}
      sizes={sizes}
      sources={desktopSrc ? [{ media: "(min-width: 64rem)", src: desktopSrc, sizes: desktopSizes }] : []}
      className={className ? `backdrop ${className}` : "backdrop"}
      quality={75}
    />
  );
}
