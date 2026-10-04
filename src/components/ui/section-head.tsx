import type { ReactNode } from "react";

type SectionHeadProps = Readonly<{
  index: string;
  title: string;
  aside?: ReactNode;
  ruled?: boolean;
}>;

export function SectionHead({ index, title, aside, ruled = true }: SectionHeadProps) {
  return (
    <div className={ruled ? "section-head section-head--ruled" : "section-head"}>
      <p className="mono-label">
        {index} / {title}
      </p>
      {aside ? <div className="mono-label">{aside}</div> : null}
    </div>
  );
}
