import { links } from "../content";
import Section from "./SectionHeading";

const channels = [
  { label: "GitHub", value: "github.com/vx9k", href: links.github },
  { label: "Website", value: "kthread.dev", href: links.site },
];

export default function Contact() {
  return (
    <Section id="contact" index="04" kicker="Contact" title="Say hello">
      <figure className="reveal max-w-[46rem]">
        <blockquote className="text-[clamp(1.4rem,1.05rem+1.5vw,2.25rem)] leading-[1.25] font-normal tracking-[-0.03em] text-balance text-muted">
          <p>
            <span aria-hidden className="text-moss">
              “
            </span>
            I&apos;d rather ship something small that I fully understand than
            something large I&apos;m still discovering the edges of.
            <span aria-hidden className="text-moss">
              ”
            </span>
          </p>
        </blockquote>
      </figure>

      <ul className="mt-16 border-b border-line sm:mt-24">
        {channels.map((c) => (
          <li key={c.href} className="reveal border-t border-line">
            <a
              href={c.href}
              className="group grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 transition-colors hover:bg-moss-wash sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:px-4 sm:-mx-4"
            >
              <span className="eyebrow col-span-2 sm:col-span-1">{c.label}</span>
              <span className="truncate text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] leading-none font-medium tracking-[-0.045em] text-ink transition-colors group-hover:text-moss">
                {c.value}
              </span>
              <span
                aria-hidden
                className="text-2xl text-moss transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗︎
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
