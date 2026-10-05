import Image from "next/image";

type BackdropProps = Readonly<{
  src: string;
  sizes: string;
  className?: string;
  eager?: boolean;
}>;

/**
 * Decorative glass/acrylic photography that sits quietly behind a section's
 * content. Purely ornamental, so it is hidden from assistive technology.
 */
export function Backdrop({ src, sizes, className, eager = false }: BackdropProps) {
  return (
    <div className={className ? `backdrop ${className}` : "backdrop"} aria-hidden="true">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        quality={50}
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
