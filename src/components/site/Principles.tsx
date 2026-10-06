import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";

/** On a block of H-beta: the line that sums the principles up, large,
 *  then the three principles side by side, each under a tall condensed
 *  numeral. */
export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  return (
    <Section id="principles" title={p.title} tone="block">
      <blockquote className="max-w-[28ch] border-l-4 border-signal pl-5 text-[clamp(1.6rem,0.9rem+2.6vw,3.4rem)] leading-[1.05] font-semibold tracking-tight text-balance [font-stretch:108%] sm:pl-8">
        <p>{p.quote}</p>
      </blockquote>
      <ol className="mt-16 grid gap-10 sm:mt-24 md:grid-cols-3 md:gap-8">
        {p.items.map((item, i) => (
          <li key={item.title} className="flex">
            <Card className="principle flex-1 gap-4 rounded-none border-0 border-t bg-transparent pt-4 pb-0 shadow-none">
              <span aria-hidden className="numeral text-[7rem] leading-[0.8] font-black [font-stretch:50%]">
                {i + 1}
              </span>
              <CardHeader className="gap-2 px-0">
                <CardTitle role="heading" aria-level={3} className="text-xl leading-snug font-semibold text-balance">
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
