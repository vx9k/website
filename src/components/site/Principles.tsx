import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";

/** The line that sums the principles up, marked with a signal rule, then
 *  a card for each. */
export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  return (
    <Section id="principles" title={p.title}>
      <blockquote className="mb-8 max-w-2xl border-l-2 border-signal pl-4 text-lg text-pretty sm:text-xl">
        <p>{p.quote}</p>
      </blockquote>
      <ol className="grid gap-4 md:grid-cols-3">
        {p.items.map((item) => (
          <li key={item.title} className="flex">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle role="heading" aria-level={3} className="leading-snug text-balance">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-pretty">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
