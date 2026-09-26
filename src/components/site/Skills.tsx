import type { CSSProperties } from "react";
import { skills } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";
import SkillIcon from "./SkillIcon";

// Every skill in page order, so each icon's glint waits its turn.
const order: string[] = skills.flatMap((g) => g.items.map((item) => item.id));

/** A card per group: the group's name, then its skills on one shared
 *  column grid, so the icons line up from card to card. From md up the
 *  name sits to the left of the skills. One column below 380px, where two
 *  would leave "Ensamblador" no room beside its tile. */
export default function Skills({ t }: { t: Dictionary }) {
  const s = t.skills;
  const names: Partial<Record<string, string>> = s.names;
  const notes: Partial<Record<string, string>> = s.notes;
  return (
    <Section id="skills" title={s.title}>
      <div className="flex flex-col gap-4">
        {skills.map(({ group, items }) => (
          <Card key={group} className="gap-4 md:flex-row md:items-center md:gap-0">
            <CardHeader className="md:w-44 md:shrink-0">
              <CardTitle role="heading" aria-level={3}>
                {s.groups[group]}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 md:pl-0">
              <ul className="grid gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {items.map((item) => (
                  <li key={item.id} className="skill flex items-center gap-3">
                    <span
                      aria-hidden
                      className="icon-tile"
                      style={{ "--c": item.color, "--i": order.indexOf(item.id) } as CSSProperties}
                    >
                      <SkillIcon id={item.id} ink={"ink" in item ? item.ink : undefined} />
                    </span>
                    <span className="min-w-0 leading-snug">
                      <span className="block text-sm font-medium">{"name" in item ? item.name : names[item.id]}</span>
                      {notes[item.id] && <span className="block text-xs text-muted-foreground">{notes[item.id]}</span>}
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
