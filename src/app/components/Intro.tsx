import type { Dictionary } from "../i18n";
import Specs from "./Specs";

/** One large statement across the shell, then the lede and the facts
 *  hanging from the content track. */
export default function Intro({ t }: { t: Dictionary }) {
  return (
    <div className="shell split pt-20 pb-24 sm:pt-28 lg:grid lg:pt-40 lg:pb-28">
      <h1 className="max-w-[16ch] text-display font-medium text-balance wrap-break-word lg:col-span-2">
        {t.hero.line}
      </h1>
      <p className="mt-8 max-w-[36rem] text-lg text-muted text-pretty sm:text-xl sm:leading-8 lg:col-start-2">
        {t.hero.lede}
      </p>
      <Specs rows={t.hero.facts.map(({ k, v }) => [k, v] as const)} className="mt-16 lg:col-start-2" />
    </div>
  );
}
