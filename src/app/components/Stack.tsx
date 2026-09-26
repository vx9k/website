import { stack } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";
import Specs from "./Specs";

export default function Stack({ t }: { t: Dictionary }) {
  return (
    <Section id="stack" title={t.stack.title}>
      <Specs rows={stack.map(({ group, items }) => [t.stack.groups[group], items.join(", ")] as const)} />
    </Section>
  );
}
