import type { CSSProperties } from "react";
import { skills, started } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";
import SkillIcon from "./SkillIcon";

// Every skill in page order, so each icon's glint waits its turn.
const all: { id: string; color: string; year: number }[] = skills.flatMap((g) => [...g.items]);
const order: string[] = all.map((item) => item.id);

// The years' scale: a little either side of the first and last.
const from = 1968;
const to = 2026;
const at = (year: number) => `${(((year - from) / (to - from)) * 100).toFixed(2)}%`;
const decades = [1970, 1980, 1990, 2000, 2010, 2020];

// Pointing at a skill (or its entangled partner lighting up) lights its
// line in the years above. One rule per skill, since CSS can't match an
// attribute's value against another's.
const rules = order
  .map(
    (id) =>
      `.skills-body:has([data-skill="${id}"]:is(:hover,[data-entangled])) .years .spectrum-line[data-for="${id}"]{opacity:1;width:4px;translate:-2px 0}`,
  )
  .join("");

/** The skills' years as a spectrum, aria-hidden: the timeline in the
 *  header lists the same years with the events they stand for. Skills
 *  that share a year stand side by side, each a step lower. */
function Years({ label }: { label: string }) {
  const seen = new Map<number, number>();
  return (
    <div aria-hidden className="years">
      {decades.map((year) => (
        <span key={year} className="years-tick label" style={{ "--x": at(year) } as CSSProperties}>
          {year}
        </span>
      ))}
      <span className="years-start" style={{ "--x": at(started) } as CSSProperties}>
        {/* On phones there's only room for the year. */}
        <span className="label">
          <span className="max-sm:hidden">{label} · </span>
          {started}
        </span>
      </span>
      {all.map((item) => {
        const k = seen.get(item.year) ?? 0;
        seen.set(item.year, k + 1);
        return (
          <span
            key={item.id}
            data-for={item.id}
            className="spectrum-line"
            style={{ "--x": at(item.year), "--c": item.color, "--k": k } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

/** The skills: their years as a spectrum, then a column per group (four
 *  from lg, two from md), each a list of skills between hairlines with
 *  the year each first appeared in mono, aria-hidden like the spectrum.
 *  Each skill carries its year for the worlds of the timeline
 *  (src/quantum/time.ts). The groups stay shadcn/ui cards, flat here,
 *  because the eras style them as cards. */
export default function Skills({ t }: { t: Dictionary }) {
  const s = t.skills;
  const names: Partial<Record<string, string>> = s.names;
  const notes: Partial<Record<string, string>> = s.notes;
  return (
    <Section id="skills" title={s.title}>
      <div className="skills-body">
        <style>{rules}</style>
        <Years label={t.quantum.time.started} />
        <div className="skill-groups grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-4">
          {skills.map(({ group, items }) => (
            <Card key={group} className="skill-group gap-0 rounded-none border-0 bg-transparent py-0 shadow-none">
              <CardHeader className="flex items-baseline justify-between gap-4 px-0 pb-4">
                <CardTitle role="heading" aria-level={3} className="text-xl font-semibold [font-stretch:120%]">
                  {s.groups[group]}
                </CardTitle>
                <span aria-hidden className="label">
                  {String(items.length).padStart(2, "0")}
                </span>
              </CardHeader>
              <CardContent className="px-0">
                <ul className="skill-list border-b">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      data-skill={item.id}
                      data-skill-year={item.year}
                      className="skill flex items-center gap-3 border-t px-1 py-3"
                    >
                      <span
                        aria-hidden
                        className="icon-tile"
                        style={{ "--c": item.color, "--i": order.indexOf(item.id) } as CSSProperties}
                      >
                        <SkillIcon id={item.id} ink={"ink" in item ? item.ink : undefined} />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="block font-medium">{"name" in item ? item.name : names[item.id]}</span>
                        {notes[item.id] && <span className="block text-xs text-muted-foreground">{notes[item.id]}</span>}
                      </span>
                      <span aria-hidden className="skill-year label">
                        {item.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
