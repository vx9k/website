import { ArrowDownIcon } from "lucide-react";
import { Fragment, type CSSProperties } from "react";
import type { Dictionary } from "@/app/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GitHubLink from "./GitHubLink";
import { SpectrumIndex } from "./Spectrum";

/** Who vx is, filling the first screen: the status, the headline set wide
 *  and as large as the screen allows, then the lede and the two buttons,
 *  and under it all the spectrum, whose lines lead to each place on the
 *  page. The headline's words resolve one by one when the page loads, in
 *  an order the early script in <head> picks at random (`.word` in
 *  globals.css). */
export default function Intro({ t }: { t: Dictionary }) {
  const words = t.hero.line.split(" ");
  return (
    <>
      <div data-branch-view="top" className="intro shell relative isolate flex min-h-[calc(100svh-3.5rem-10rem)] flex-col">
        <div className="intro-body flex flex-1 flex-col justify-center gap-10 py-14 sm:gap-14 sm:py-20">
          <Badge variant="outline" className="reveal-now gap-2 self-start font-mono text-[0.6875rem] tracking-wide uppercase">
            <span aria-hidden className="size-1.5 rounded-[1px] bg-signal" />
            {t.hero.status}
          </Badge>
          <h1 data-branch-echo className="relative max-w-[17ch] text-display text-balance">
            {words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="word" style={{ "--w": i } as CSSProperties}>
                  {word}
                </span>
              </Fragment>
            ))}
          </h1>
          <div className="intro-foot reveal-now grid items-end gap-8 md:grid-cols-12">
            <p className="text-lg text-muted-foreground text-pretty sm:text-xl md:col-span-6 md:col-start-7 md:row-start-1">
              {t.hero.lede}
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:row-start-1">
              <GitHubLink />
              <Button asChild size="lg" variant="outline">
                <a href="#skills">
                  {t.nav.skills}
                  <ArrowDownIcon data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SpectrumIndex
        names={{ top: t.quantum.branches.top, skills: t.nav.skills, principles: t.nav.principles, contact: t.nav.contact }}
      />
    </>
  );
}
