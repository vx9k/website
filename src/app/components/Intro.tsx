import type { Dictionary } from "../i18n";
import Specs from "./Specs";

/** One large statement, a lede, then the facts as a spec row. */
export default function Intro({ t }: { t: Dictionary }) {
  return (
    <div className="wrap pt-20 pb-24 sm:pt-28 lg:pt-40 lg:pb-36">
      <h1 className="max-w-[16ch] text-display font-medium text-balance">{t.hero.line}</h1>
      <p className="mt-8 max-w-[40rem] text-lg text-muted text-pretty sm:text-xl sm:leading-8">{t.hero.lede}</p>
      <Specs rows={t.hero.facts.map(({ k, v }) => [k, v] as const)} className="mt-16 lg:mt-24" />
    </div>
  );
}
