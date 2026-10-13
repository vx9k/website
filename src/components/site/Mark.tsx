/** The e/acc mark: a white frame, black inside, and white under an
 *  exponential curve. With `flag`, it carries Uruguay's: the white under
 *  the curve takes the flag's nine stripes (four blue), and a small Sun of
 *  May sits in the top-left corner, where the flag has it. The same
 *  drawing is the favicon (src/app/icon.svg). Decorative wherever it's
 *  used: the name next to it says what it is. */

// The flag's blue and gold.
const blue = "#0038a8";
const gold = "#fcd116";

const curve = "M4 28 C17 28 27.5 22 28 4 V28 Z";

// Stripe height: the frame's 24 units split into the flag's nine.
const h = 24 / 9;

export default function Mark({ size, flag = false, id }: { size: number; flag?: boolean; id: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden className="block shrink-0">
      <rect x="2.5" y="2.5" width="27" height="27" fill="#000" stroke="#fff" strokeWidth="2.5" />
      <path d={curve} fill="#fff" />
      {flag && (
        <>
          <clipPath id={`${id}-curve`}>
            <path d={curve} />
          </clipPath>
          <g clipPath={`url(#${id}-curve)`} fill={blue}>
            {[1, 3, 5, 7].map((k) => (
              <rect key={k} x="4" y={4 + k * h} width="24" height={h} />
            ))}
          </g>
          {/* The Sun of May, simplified to what survives at 16 pixels: a
              disc and eight rays. */}
          <g fill={gold} stroke={gold} strokeWidth="0.9" strokeLinecap="round">
            <circle cx="9.5" cy="9.5" r="2.4" stroke="none" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              const x1 = 9.5 + Math.cos(a) * 3.3;
              const y1 = 9.5 + Math.sin(a) * 3.3;
              const x2 = 9.5 + Math.cos(a) * 4.7;
              const y2 = 9.5 + Math.sin(a) * 4.7;
              return <line key={i} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} />;
            })}
          </g>
        </>
      )}
    </svg>
  );
}
