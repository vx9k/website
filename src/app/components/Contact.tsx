import { links } from "../content";
import SectionHeading from "./SectionHeading";

const channels = [
  { label: "GitHub", value: "github.com/vx9k", href: links.github },
  { label: "Website", value: "kthread.dev", href: links.site },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-t border-line pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      <div className="reveal">
        <SectionHeading
          id="contact-title"
          index="04"
          kicker="contact"
          title="Say hello"
        />
      </div>

      <figure className="reveal mt-12 max-w-[52rem] sm:mt-16">
        <blockquote
          className="font-display text-[clamp(1.6rem,1.1rem+2.1vw,2.75rem)] leading-[1.25] font-[340] text-balance italic"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 96' }}
        >
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

      <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2">
        {channels.map((c) => (
          <li key={c.href} className="reveal">
            <a
              href={c.href}
              className="group flex min-h-24 items-center justify-between gap-6 rounded-3xl border border-line p-6 transition-colors hover:border-moss hover:bg-moss-wash sm:p-7 eink:border-2 eink:border-ink"
            >
              <span>
                <span className="eyebrow block">{c.label}</span>
                <span className="mt-1.5 block font-mono text-lg text-ink sm:text-xl">
                  {c.value}
                </span>
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
    </section>
  );
}
