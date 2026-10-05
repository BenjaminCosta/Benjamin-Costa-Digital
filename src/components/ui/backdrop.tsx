import { getImageProps } from "next/image";

type BackdropProps = Readonly<{
  src: string;
  sizes: string;
  /** Art-directed image for wide screens (≥ 64rem); only one is downloaded. */
  desktopSrc?: string;
  desktopSizes?: string;
  className?: string;
  eager?: boolean;
}>;

/**
 * Decorative glass/acrylic photography that sits quietly behind a section's
 * content. Purely ornamental, so it is hidden from assistive technology.
 * Rendered as a plain <picture> (no client JS) so the browser can pick the
 * mobile or desktop crop.
 */
export function Backdrop({
  src,
  sizes,
  desktopSrc,
  desktopSizes = "100vw",
  className,
  eager = false,
}: BackdropProps) {
  const common = {
    alt: "",
    fill: true,
    quality: 50,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : undefined,
  } as const;
  const { props } = getImageProps({ ...common, src, sizes });
  const desktop = desktopSrc
    ? getImageProps({ ...common, src: desktopSrc, sizes: desktopSizes }).props
    : null;

  return (
    <div className={className ? `backdrop ${className}` : "backdrop"} aria-hidden="true">
      <picture>
        {desktop ? (
          <source media="(min-width: 64rem)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
        ) : null}
        <img {...props} alt="" />
      </picture>
    </div>
  );
}
