/** The site's mark: a round badge like the emblem on an ES EVM console, a
 *  red star on ink inside a cream ring. The favicon is the same drawing
 *  (src/app/icon.svg). Decorative: the name next to it says what it is. */
export default function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden className="block shrink-0">
      <circle cx="16" cy="16" r="15" fill="#efe6d0" />
      <circle cx="16" cy="16" r="12.5" fill="#101633" />
      <path d="M16.00 7.80L18.12 13.89L24.56 14.02L19.42 17.91L21.29 24.08L16.00 20.40L10.71 24.08L12.58 17.91L7.44 14.02L13.88 13.89Z" fill="#d3261a" />
    </svg>
  );
}
