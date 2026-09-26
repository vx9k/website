import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GitHubLink from "./GitHubLink";
import Section from "./Section";

export default function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <Section id="contact" title={c.title}>
      <Card>
        <CardHeader>
          <CardTitle role="heading" aria-level={3} className="flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-[1px] bg-signal" />
            {c.heading}
          </CardTitle>
          <CardDescription>{c.body}</CardDescription>
        </CardHeader>
        <CardFooter>
          <GitHubLink variant="outline" />
        </CardFooter>
      </Card>
    </Section>
  );
}
