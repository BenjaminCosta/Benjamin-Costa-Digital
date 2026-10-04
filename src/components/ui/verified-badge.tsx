/** Workana-style verified rosette. */
export function VerifiedBadge() {
  return (
    <svg className="verified-badge" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M10 1.2l2.1 1.5 2.6-.1.8 2.4 2.1 1.6-.8 2.5.8 2.5-2.1 1.6-.8 2.4-2.6-.1L10 18.8l-2.1-1.5-2.6.1-.8-2.4-2.1-1.6.8-2.5-.8-2.5 2.1-1.6.8-2.4 2.6.1Z"
      />
      <path
        d="M6.8 10.2l2.2 2.2 4.3-4.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
