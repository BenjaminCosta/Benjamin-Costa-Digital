import type { ReactNode } from "react";

type SectionHeadProps = Readonly<{
  index: string;
  title: string;
  /** Replaces the title on desktop, where the index sits in its own column. */
  desktopTitle?: string;
  aside?: ReactNode;
}>;

export function SectionHead({ index, title, desktopTitle, aside }: SectionHeadProps) {
  return (
    <div className="section-head">
      <p className="mono-label section-head__label">
        <span className="section-head__index">{index}</span>
        <span className="section-head__sep" aria-hidden="true">
          {" / "}
        </span>
        {desktopTitle ? (
          <>
            <span className="only-mobile">{title}</span>
            <span className="only-desktop">{desktopTitle}</span>
          </>
        ) : (
          title
        )}
      </p>
      {aside ? <div className="mono-label section-head__aside">{aside}</div> : null}
    </div>
  );
}
