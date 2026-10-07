type IconName = "search" | "link" | "plus" | "check" | "restart" | "back" | "close";

// Line glyphs for the tool's controls; the options and ideas use 3D icons.
const paths: Record<IconName, string> = {
  search: "M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM15 15l5 5",
  link: "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  plus: "M12 5v14M5 12h14",
  check: "M5.5 12.5l4 4 9-9",
  restart: "M5 12a7 7 0 1 0 2.05-4.95M5 4.5V8h3.5",
  back: "M19 12H5M10.5 6.5 5 12l5.5 5.5",
  close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
};

type IdeaIconProps = Readonly<{
  name: IconName;
  className?: string;
}>;

export function IdeaIcon({ name, className }: IdeaIconProps) {
  return (
    <svg
      className={className ? `idea-icon ${className}` : "idea-icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
