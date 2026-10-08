/** Decorative check inspired by the owner's reference, not a certification asset. */
export function VerifiedBadge() {
  return (
    <svg className="verified-badge" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.00 1.75L14.23 3.69L17.13 3.12L18.08 5.92L20.88 6.88L20.31 9.77L22.25 12.00L20.31 14.23L20.88 17.13L18.08 18.08L17.13 20.88L14.23 20.31L12.00 22.25L9.77 20.31L6.88 20.88L5.92 18.08L3.12 17.13L3.69 14.23L1.75 12.00L3.69 9.77L3.12 6.87L5.92 5.92L6.87 3.12L9.77 3.69Z"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="m8 12.3 2.6 2.6 5.3-5.3"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
