import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";

type ButtonLinkProps = Readonly<{
  href?: string;
  children: ReactNode;
  tone?: "dark" | "light" | "glass";
  arrow?: "right" | "up-right";
  className?: string;
  pendingLabel?: string;
  /** Opens in a new tab; read to screen readers, e.g. "opens WhatsApp". */
  newTab?: string;
}>;

export function ButtonLink({
  href,
  children,
  tone = "dark",
  arrow = "right",
  className,
  pendingLabel,
  newTab,
}: ButtonLinkProps) {
  const classes = ["button", `button--${tone}`, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <span>{children}</span>
      <ArrowIcon direction={arrow} />
    </>
  );

  if (!href) {
    return (
      <span className={classes} data-pending title={pendingLabel}>
        {content}
      </span>
    );
  }

  if (newTab) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="visually-hidden"> ({newTab})</span>
      </a>
    );
  }

  return (
    <a className={classes} href={href}>
      {content}
    </a>
  );
}
