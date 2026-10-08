import { ArtDirectedPicture } from "@/components/ui/art-directed-picture";

type BackdropProps = Readonly<{
  src: string;
  sizes: string;
  /** Landscape crop used from the desktop breakpoint up. */
  desktopSrc?: string;
  desktopSizes?: string;
  className?: string;
}>;

export function Backdrop({
  src,
  sizes,
  desktopSrc,
  desktopSizes = "100vw",
  className,
}: BackdropProps) {
  return (
    <ArtDirectedPicture
      src={src}
      sizes={sizes}
      sources={desktopSrc ? [{ media: "(min-width: 64rem)", src: desktopSrc, sizes: desktopSizes }] : []}
      className={className ? `backdrop ${className}` : "backdrop"}
      quality={75}
    />
  );
}
