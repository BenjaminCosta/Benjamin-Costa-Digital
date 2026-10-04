type ArrowDirection = "right" | "left" | "down" | "up-right";

type ArrowIconProps = Readonly<{
  direction?: ArrowDirection;
  className?: string;
}>;

const paths: Record<ArrowDirection, string> = {
  right: "M1 8h14M9.5 2.5 15 8l-5.5 5.5",
  left: "M15 8H1M6.5 2.5 1 8l5.5 5.5",
  down: "M8 1v14M2.5 9.5 8 15l5.5-5.5",
  "up-right": "M3 13 13 3M5 3h8v8",
};

export function ArrowIcon({ direction = "right", className }: ArrowIconProps) {
  return (
    <svg
      className={className ? `arrow-icon ${className}` : "arrow-icon"}
      data-direction={direction}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}
