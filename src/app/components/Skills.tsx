import type { CSSProperties } from "react";
import { skills } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";
import SkillIcon from "./SkillIcon";

// Every skill in page order, so each icon's glint waits its turn.
const order: string[] = skills.flatMap((g) => g.items.map((item) => item.id));

/** One pane with a row per group: the group on the left of the pane's
 *  four-column sub-grid, its skills across the other three. The skills run
 *  in one column on phones, where two would leave "Ensamblador" no room
 *  beside its tile, and in two from sm up, where three would break the
 *  longer names over three lines. */
export default function Skills({ t }: { t: Dictionary }) {
  const s = t.skills;
  const names: Partial<Record<string, string>> = s.names;
  const notes: Partial<Record<string, string>> = s.notes;
  return (
    <Section id="skills" title={s.title}>
      <div className="glass px-5 sm:px-8">
        {skills.map(({ group, items }) => (
          <div
            key={group}
            className="grid gap-x-6 gap-y-4 border-t border-line py-6 first:border-t-0 sm:py-8 md:grid-cols-4"
          >
            <h3 className="label md:pt-3">{s.groups[group]}</h3>
            <ul className="grid gap-4 sm:grid-cols-2 md:col-span-3">
              {items.map((item) => (
                <li key={item.id} className="skill flex items-center gap-3">
                  <span
                    aria-hidden
                    className="icon-tile"
                    style={{ "--c": item.color, "--i": order.indexOf(item.id) } as CSSProperties}
                  >
                    <SkillIcon id={item.id} ink={"ink" in item ? item.ink : undefined} />
                  </span>
                  <span className="min-w-0 leading-snug wrap-break-word">
                    <span className="block font-medium">{"name" in item ? item.name : names[item.id]}</span>
                    {notes[item.id] && <span className="block text-sm text-muted">{notes[item.id]}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
