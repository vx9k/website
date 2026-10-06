import { ArrowDownIcon } from "lucide-react";
import { Fragment, type CSSProperties } from "react";
import type { Dictionary } from "@/app/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GitHubLink from "./GitHubLink";

/** Who vx is: the status, one line of introduction, what vx writes, and
 *  the way to the code, centred over the background. The headline's words
 *  resolve one by one when the page loads, in an order the early script
 *  in <head> picks at random (see `.word` in globals.css). */
export default function Intro({ t }: { t: Dictionary }) {
  const words = t.hero.line.split(" ");
  return (
    <div
      data-branch-view="top"
      className="intro shell relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-24 text-center"
    >
      <Badge variant="outline" className="reveal-now gap-2 font-mono text-[0.6875rem] tracking-wider uppercase">
        <span aria-hidden className="size-1.5 rounded-[1px] bg-signal" />
        {t.hero.status}
      </Badge>
      <h1 data-branch-echo className="relative mt-8 max-w-5xl text-display font-medium text-balance">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="word" style={{ "--w": i } as CSSProperties}>
              {word}
            </span>
          </Fragment>
        ))}
      </h1>
      <p className="reveal-now mt-8 max-w-xl text-lg text-muted-foreground text-pretty sm:text-xl">{t.hero.lede}</p>
      <div className="reveal-now mt-10 flex flex-wrap justify-center gap-3">
        <GitHubLink />
        <Button asChild size="lg" variant="outline">
          <a href="#skills">
            {t.nav.skills}
            <ArrowDownIcon data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </div>
  );
}
