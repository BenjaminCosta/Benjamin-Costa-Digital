import Image from "next/image";
import type { ImageAsset } from "@/types/content";

type MediaSlotProps = Readonly<{
  slot: string;
  image?: ImageAsset;
  sizes: string;
  className?: string;
  preload?: boolean;
}>;

/**
 * Art-directed image area. Renders a neutral placeholder until the final
 * photography is added, so the layout is already final.
 */
export function MediaSlot({
  slot,
  image,
  sizes,
  className,
  preload = false,
}: MediaSlotProps) {
  const classes = className ? `media-slot ${className}` : "media-slot";

  if (!image) {
    return (
      <div className={classes} data-media={slot} data-placeholder aria-hidden="true">
        <span className="media-slot__caption">[ {slot} ]</span>
      </div>
    );
  }

  return (
    <div className={classes} data-media={slot}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} />
    </div>
  );
}
