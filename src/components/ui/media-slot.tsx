import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageAsset } from "@/types/content";

type MediaSlotProps = Readonly<{
  slot: string;
  image?: ImageAsset;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** Use "span" when the slot sits inside phrasing content such as a button. */
  as?: "div" | "span";
  children?: ReactNode;
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
  as: Tag = "div",
  children,
}: MediaSlotProps) {
  const classes = className ? `media-slot ${className}` : "media-slot";

  if (!image) {
    return (
      <Tag className={classes} data-media={slot} data-placeholder>
        <span className="media-slot__caption" aria-hidden="true">
          [ {slot} ]
        </span>
        {children}
      </Tag>
    );
  }

  return (
    <Tag className={classes} data-media={slot}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} />
      {children}
    </Tag>
  );
}
