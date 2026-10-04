type WorkanaLogoProps = Readonly<{
  className?: string;
}>;

/**
 * Workana wordmark: lowercase set in Poppins with the multicolour "o".
 * Swap for the official SVG from Workana's brand assets when available.
 */
export function WorkanaLogo({ className }: WorkanaLogoProps) {
  return (
    <span
      className={className ? `workana-logo ${className}` : "workana-logo"}
      role="img"
      aria-label="Workana"
    >
      <span aria-hidden="true">w</span>
      <span className="workana-logo__o" aria-hidden="true" />
      <span aria-hidden="true">rkana</span>
    </span>
  );
}
