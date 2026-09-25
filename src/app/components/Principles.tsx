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
            className="group reveal grid gap-x-10 gap-y-3 border-t border-line py-9 text-center sm:grid-cols-[4rem_minmax(0,1fr)] sm:text-left md:py-11 lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            <span aria-hidden className="eyebrow pt-2 text-ember! transition-transform duration-300 ease-out-soft sm:group-hover:translate-x-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-subhead font-medium text-balance transition-transform duration-300 ease-out-soft sm:group-hover:translate-x-1">
              {p.title}
            </h3>
            <p className="mx-auto max-w-[36rem] text-[1.05rem] leading-7 text-pretty text-muted sm:col-start-2 sm:mx-0 lg:col-start-auto lg:pt-1">
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
