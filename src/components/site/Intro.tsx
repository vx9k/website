import type { Dictionary } from "@/app/i18n";
import { Badge } from "@/components/ui/badge";
import GitHubLink from "./GitHubLink";

/** Who vx is: the status, one line of introduction, what vx writes, and
 *  the way to the code. */
export default function Intro({ t }: { t: Dictionary }) {
  return (
    <div className="shell pt-20 pb-8 sm:pt-28 sm:pb-10">
      <Badge variant="outline" className="gap-2">
        <span aria-hidden className="size-1.5 rounded-[1px] bg-signal" />
        {t.hero.status}
      </Badge>
      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
        {t.hero.line}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl">{t.hero.lede}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <GitHubLink />
      </div>
    </div>
  );
}
