import type { CSSProperties } from "react";
import { marks } from "../marks";

// Icons for the skills, all 24×24 and drawn in currentColor, which the
// tile sets to the skill's colour. Brands get their own mark; the rest are
// drawn here, and each has one small part that moves (see "skill icons"
// in globals.css).

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/** A brand mark. For the square ones with cut-out letters, ink fills the
 *  letters, as in the real logo. */
function Mark({ path, ink }: { path: string; ink?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      {ink && <rect x="1.5" y="1.5" width="21" height="21" fill={ink} />}
      <path d={path} />
    </svg>
  );
}

/** The seven OSI layers, L1 at the bottom. The ones a skill covers run
 *  full width and pulse from the top down, the way a packet is wrapped on
 *  its way out; the rest are short and dim. `lit` lists them in order. */
function Layers({ lit }: { lit: number[] }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      {[7, 6, 5, 4, 3, 2, 1].map((n, row) => {
        const turn = lit.indexOf(n);
        const on = turn >= 0;
        return (
          <rect
            key={n}
            x={on ? 2.5 : 7}
            y={2.6 + row * 2.8}
            width={on ? 19 : 10}
            height="1.8"
            rx="0.9"
            opacity={on ? undefined : 0.3}
            className={on ? "pulse" : undefined}
            style={on ? d(turn) : undefined}
          />
        );
      })}
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A chip, for x86 Assembly: its core pulses like a clock. */
function Chip() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3" />
      <rect className="pulse" x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A filter, for nftables: a packet drops through it. */
function Filter() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 6h16l-6 7v5l-4 2v-7z" />
      <circle className="fall" cx="12" cy="2.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A small network, for how LLMs work: each layer lights in turn. */
const inputs = [8, 16];
const hidden = [5, 12, 19];
function Network() {
  const edges =
    inputs.flatMap((a) => hidden.map((b) => `M5 ${a}L12 ${b}`)).join("") +
    hidden.map((b) => `M12 ${b}L19 12`).join("");
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d={edges} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      {inputs.map((y) => (
        <circle key={`i${y}`} className="pulse" style={d(0)} cx="5" cy={y} r="1.9" />
      ))}
      {hidden.map((y) => (
        <circle key={`h${y}`} className="pulse" style={d(1)} cx="12" cy={y} r="1.9" />
      ))}
      <circle className="pulse" style={d(2)} cx="19" cy="12" r="1.9" />
    </svg>
  );
}

/** A spark, for working with AI: the stars turn. */
function Spark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path className="turn" d="M11 4c.7 4.4 2.8 6.5 7.2 7.2-4.4.7-6.5 2.8-7.2 7.2-.7-4.4-2.8-6.5-7.2-7.2C8.2 10.5 10.3 8.4 11 4z" />
      <path className="turn" style={d(1)} d="M19 2.5c.25 1.4.85 2 2.25 2.25-1.4.25-2 .85-2.25 2.25-.25-1.4-.85-2-2.25-2.25 1.4-.25 2-.85 2.25-2.25z" />
    </svg>
  );
}

export default function SkillIcon({ id, ink }: { id: string; ink?: string }) {
  if (id in marks) return <Mark path={marks[id as keyof typeof marks]} ink={ink} />;
  switch (id) {
    case "asm":
      return <Chip />;
    case "l23":
      return <Layers lit={[3, 2]} />;
    case "l4":
      return <Layers lit={[4]} />;
    case "l67":
      return <Layers lit={[7, 6]} />;
    case "nftables":
      return <Filter />;
    case "llm":
      return <Network />;
    default:
      return <Spark />;
  }
}
