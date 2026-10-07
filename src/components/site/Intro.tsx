import { ArrowDownIcon } from "lucide-react";
import { Fragment, type CSSProperties } from "react";
import type { Dictionary } from "@/app/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GitHubLink from "./GitHubLink";

/** The first screen, dark and centred: the status, the headline, what vx
 *  writes, and the two ways on. In the headline, "vx" is set in the mono
 *  face, the one typographic accent on the page. Its words resolve one by
 *  one when the page loads, in an order the early script in <head> picks
 *  at random (`.word` in globals.css). */
export default function Intro({ t }: { t: Dictionary }) {
  const words = t.hero.line.split(" ");
  return (
    <div
      data-branch-view="top"
      className="intro shell relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-24 text-center"
    >
      <Badge variant="outline" className="reveal-now gap-2 font-mono text-[0.625rem] font-normal tracking-wider uppercase">
        <span aria-hidden className="status-dot size-1.5 rounded-full bg-signal" />
        {t.hero.status}
      </Badge>
      <h1 data-branch-echo className="relative mt-8 max-w-[15ch] text-display text-balance">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="word" style={{ "--w": i } as CSSProperties}>
              {word.startsWith("vx") ? (
                <>
                  <span className="vx">vx</span>
                  {word.slice(2)}
                </>
              ) : (
                word
              )}
            </span>
          </Fragment>
        ))}
      </h1>
      <p className="reveal-now mt-8 max-w-[38rem] text-lg text-muted-foreground text-pretty sm:text-xl">{t.hero.lede}</p>
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
