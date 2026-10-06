import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";

/** The line that sums the principles up, large, marked with a signal
 *  rule, then each principle as a numbered row between hairlines. */
export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  return (
    <Section id="principles" title={p.title}>
      <blockquote className="mb-12 border-l-2 border-signal pl-5 text-xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">
        <p>{p.quote}</p>
      </blockquote>
      <ol className="border-b">
        {p.items.map((item, i) => (
          <li key={item.title}>
            <Card className="principle flex-row gap-4 rounded-none border-x-0 border-b-0 bg-transparent py-6 shadow-none sm:gap-6">
              <span aria-hidden className="label w-8 shrink-0 pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <CardHeader className="flex-1 px-0">
                <CardTitle role="heading" aria-level={3} className="text-lg leading-snug font-medium text-balance">
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
