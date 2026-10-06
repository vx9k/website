import type { CSSProperties } from "react";
import { skills } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";
import SkillIcon from "./SkillIcon";

// Every skill in page order, so each icon's glint waits its turn.
const order: string[] = skills.flatMap((g) => g.items.map((item) => item.id));

/** A card per group: a header row with the group's name and its count,
 *  then its skills as cells on one shared column grid, divided by
 *  hairlines. From md up, where the cells have room, each shows the year
 *  it first appeared in mono; it's aria-hidden, since the timeline lists
 *  the same years with their events. One column below 380px, where two
 *  would leave "Ensamblador" no room beside its tile. Each skill carries
 *  its year for the worlds of the timeline (src/quantum/time.ts). */
export default function Skills({ t }: { t: Dictionary }) {
  const s = t.skills;
  const names: Partial<Record<string, string>> = s.names;
  const notes: Partial<Record<string, string>> = s.notes;
  return (
    <Section id="skills" title={s.title}>
      <div className="flex flex-col gap-6">
        {skills.map(({ group, items }) => (
          <Card key={group} className="skill-group gap-0 overflow-hidden rounded-md py-0 shadow-none">
            <CardHeader className="flex items-center justify-between gap-4 border-b px-4 py-3 [.border-b]:pb-3">
              <CardTitle role="heading" aria-level={3} className="font-medium">
                {s.groups[group]}
              </CardTitle>
              <span aria-hidden className="label">
                {String(items.length).padStart(2, "0")}
              </span>
            </CardHeader>
            <CardContent className="px-0">
              {/* Each cell draws its right and bottom edges; the list hangs
                  1px past the card, which clips the outer ones. */}
              <ul className="-mr-px -mb-px grid min-[380px]:grid-cols-2 sm:grid-cols-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    data-skill={item.id}
                    data-skill-year={item.year}
                    className="skill flex items-center gap-3 border-r border-b p-4"
                  >
                    <span
                      aria-hidden
                      className="icon-tile"
                      style={{ "--c": item.color, "--i": order.indexOf(item.id) } as CSSProperties}
                    >
                      <SkillIcon id={item.id} ink={"ink" in item ? item.ink : undefined} />
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">
                      <span className="block text-sm font-medium">{"name" in item ? item.name : names[item.id]}</span>
                      {notes[item.id] && <span className="block text-xs text-muted-foreground">{notes[item.id]}</span>}
                    </span>
                    <span aria-hidden className="skill-year label hidden self-start md:block">
                      {item.year}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
