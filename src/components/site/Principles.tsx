import { Fragment, type CSSProperties } from "react";
import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";

/** The line that sums the principles up, large, its words darkening one
 *  by one as it scrolls into view (`.fill` in globals.css), then a tall
 *  tile for each principle, its number at the top and its words at the
 *  foot. */
export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  const words = p.quote.split(" ");
  return (
    <Section id="principles" title={p.title}>
      <blockquote className="statement max-w-[24ch] text-statement text-pretty">
        <p>
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="fill" style={{ "--p": (i / (words.length - 1)).toFixed(3) } as CSSProperties}>
                {word}
              </span>
            </Fragment>
          ))}
        </p>
      </blockquote>
      <ol className="mt-16 grid gap-3 sm:mt-24 md:grid-cols-3">
        {p.items.map((item, i) => (
          <li key={item.title} className="flex">
            <Card className="principle tile flex-1 justify-between gap-16 rounded-none border-0 bg-card px-6 py-6 shadow-none sm:min-h-[22rem]">
              <span aria-hidden className="label">
                {String(i + 1).padStart(2, "0")}
              </span>
              <CardHeader className="gap-3 px-0">
                <CardTitle role="heading" aria-level={3} className="text-2xl leading-tight font-normal tracking-[-0.03em] text-balance">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-base text-pretty">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
