import type { CSSProperties } from "react";
import { skills } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";
import SkillIcon from "./SkillIcon";

// Every skill in page order, so each icon's glint waits its turn.
const order: string[] = skills.flatMap((g) => g.items.map((item) => item.id));

/** A row per group, between rules: the group's name and count on the
 *  left, its skills on the right, each with the year it first appeared in
 *  mono (aria-hidden: the timeline lists the same years with their
 *  events). The icons are drawn in the text colour and take their brand's
 *  colour when pointed at. One column of skills below 380px, where two
 *  would leave "Ensamblador" no room. Each skill carries its year for the
 *  worlds of the timeline (src/quantum/time.ts). The groups stay shadcn/ui
 *  cards, flat here, because the eras style them as cards. */
export default function Skills({ t }: { t: Dictionary }) {
  const s = t.skills;
  const names: Partial<Record<string, string>> = s.names;
  const notes: Partial<Record<string, string>> = s.notes;
  return (
    <Section id="skills" title={s.title}>
      <ol className="skill-groups">
        {skills.map(({ group, items }, g) => (
          <li key={group}>
            <Card className="skill-group gap-6 rounded-none border-0 border-b bg-transparent py-8 shadow-none md:grid md:grid-cols-12 md:gap-8 md:py-10">
              <CardHeader className="gap-2 px-0 md:col-span-4">
                <span aria-hidden className="label">
                  {String(g + 1).padStart(2, "0")} · {String(items.length).padStart(2, "0")}
                </span>
                <CardTitle role="heading" aria-level={3} className="text-2xl font-normal tracking-[-0.03em] sm:text-3xl">
                  {s.groups[group]}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 md:col-span-8">
                <ul className="skill-list grid gap-x-8 gap-y-1 min-[380px]:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      data-skill={item.id}
                      data-skill-year={item.year}
                      className="skill flex items-center gap-3 py-2"
                    >
                      <span
                        aria-hidden
                        className="icon-tile"
                        style={{ "--c": item.color, "--i": order.indexOf(item.id) } as CSSProperties}
                      >
                        <SkillIcon id={item.id} ink={"ink" in item ? item.ink : undefined} />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="block">{"name" in item ? item.name : names[item.id]}</span>
                        {notes[item.id] && <span className="block text-xs text-muted-foreground">{notes[item.id]}</span>}
                      </span>
                      <span aria-hidden className="skill-year label hidden sm:block">
                        {item.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
