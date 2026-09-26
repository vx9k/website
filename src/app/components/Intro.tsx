import type { Dictionary } from "../i18n";

/** One large statement across the shell, then the lede and the facts
 *  hanging from the content track. The facts are a pane of label-over-value
 *  cells: stacked on phones, three across from sm up. The grid is pulled
 *  out by a pixel and clipped, so only the inner rules show. */
export default function Intro({ t }: { t: Dictionary }) {
  return (
    <div className="shell split pt-20 pb-24 sm:pt-28 lg:grid lg:pt-36 lg:pb-28">
      <h1 className="max-w-[16ch] text-display font-medium text-balance wrap-break-word lg:col-span-2">
        {t.hero.line}
      </h1>
      <p className="mt-8 max-w-[36rem] text-lg text-muted text-pretty sm:text-xl sm:leading-8 lg:col-start-2">
        {t.hero.lede}
      </p>
      <div className="glass mt-14 overflow-hidden lg:col-start-2">
        <dl className="-m-px grid sm:grid-cols-3">
          {t.hero.facts.map(({ k, v }) => (
            <div key={k} className="border-t border-l border-line px-4 py-3">
              <dt className="label">{k}</dt>
              <dd className="mt-1.5 text-pretty">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
