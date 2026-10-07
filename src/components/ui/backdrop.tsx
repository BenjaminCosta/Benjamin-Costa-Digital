import { ArtDirectedPicture } from "@/components/ui/art-directed-picture";

type BackdropProps = Readonly<{
  src: string;
  sizes: string;
  /** Landscape crop, used from `desktopMedia` up (desktop by default). */
  desktopSrc?: string;
  desktopSizes?: string;
  desktopMedia?: string;
  className?: string;
}>;

export function Backdrop({
  src,
  sizes,
  desktopSrc,
  desktopSizes = "100vw",
  desktopMedia = "(min-width: 64rem)",
  className,
}: BackdropProps) {
  return (
    <ArtDirectedPicture
      src={src}
      sizes={sizes}
      sources={desktopSrc ? [{ media: desktopMedia, src: desktopSrc, sizes: desktopSizes }] : []}
      className={className ? `backdrop ${className}` : "backdrop"}
    />
  );
}
