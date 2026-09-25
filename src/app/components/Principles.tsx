import { principles } from "../content";
import SectionHeading from "./SectionHeading";

export default function Principles() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <div className="reveal">
        <SectionHeading
          id="principles-title"
          index="01"
          kicker="principles"
          title="How I build"
          aside="Three rules that decide most of my trade-offs before I write a line."
        />
      </div>

      <ol className="mt-12 sm:mt-16">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="reveal grid gap-x-8 gap-y-3 border-t border-line py-9 sm:grid-cols-[5.5rem_minmax(0,1fr)] md:grid-cols-[7rem_minmax(0,17rem)_minmax(0,1fr)] md:py-11"
          >
            <span
              aria-hidden
              className="font-display text-5xl leading-none font-[300] text-moss sm:row-span-2 md:row-span-1 md:text-6xl"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl leading-snug font-[450] text-balance md:pt-1">
              {p.title}
            </h3>
            <p className="max-w-[38rem] text-lg leading-8 text-pretty text-muted md:pt-1.5">
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
