// The ">_" prompt mark, shared by the header and the app icon.
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="32" height="32" rx="9" fill="currentColor" opacity="0.14" />
      <path
        d="M9.5 10.5 15 16l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 22h6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
