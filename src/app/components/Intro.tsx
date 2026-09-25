import { sections } from "../content";
import type { Dictionary } from "../i18n";

/** Who this is, in a dialogue box, then the facts and the section menu. */
export default function Intro({ t }: { t: Dictionary }) {
  return (
    <>
      <h1 className="dialog mt-10 px-6 pt-5 pb-6 sm:px-8 sm:pb-8">
        <span className="chip [--frame:var(--ink)]">vx</span>
        <span className="mt-4 block text-title font-semibold text-balance">{t.hero.line}</span>
      </h1>

      <p className="mt-8 max-w-[38rem] text-lg leading-8 text-pretty">{t.hero.lede}</p>

      <dl className="mt-8 max-w-[38rem]">
        {t.hero.facts.map(({ k, v }) => (
          <div key={k} className="rule grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-2.5">
            <dt className="eyebrow pt-0.5">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <nav aria-label={t.nav.label} className="mt-10">
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group inline-flex min-h-11 items-center gap-2 px-2 font-semibold hover:bg-ink hover:text-bg"
              >
                <span aria-hidden className="text-soft group-hover:text-bg">
                  ▸
                </span>
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
