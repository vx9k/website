import { principles } from "../content";
import Section from "./SectionHeading";

export default function Principles() {
  return (
    <Section
      id="principles"
      index="01"
      kicker="Principles"
      title="How I build"
      aside="Three rules that decide most of my trade-offs before I write a line."
    >
      <ol className="border-b border-line">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="reveal grid gap-x-10 gap-y-4 border-t border-line py-10 sm:grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,16rem)_minmax(0,1fr)] md:py-12"
          >
            <span aria-hidden className="eyebrow pt-1.5 text-moss!">
              P.{String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl leading-tight font-medium tracking-[-0.03em] text-balance">
              {p.title}
            </h3>
            <p className="max-w-[36rem] text-[1.05rem] leading-8 text-pretty text-muted sm:col-start-2 md:col-start-auto md:pt-0.5">
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
