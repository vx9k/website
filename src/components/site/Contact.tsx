import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GitHubLink from "./GitHubLink";
import Section from "./Section";

/** One panel, the page's only light surface: open to work, and the way
 *  to the code again. Today's world inverts it in globals.css (`.panel-light`),
 *  so the past eras get an ordinary card. */
export default function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <Section id="contact" title={c.title}>
      <Card className="panel-light gap-8 rounded-md py-8 shadow-none sm:py-12">
        <CardHeader className="gap-4 px-6 sm:px-10">
          <CardTitle role="heading" aria-level={3} className="flex items-center gap-3 text-3xl font-medium tracking-tight sm:text-4xl">
            <span aria-hidden className="size-2.5 shrink-0 rounded-[1px] bg-signal" />
            {c.heading}
          </CardTitle>
          <CardDescription className="text-lg">{c.body}</CardDescription>
        </CardHeader>
        <CardFooter className="px-6 sm:px-10">
          <GitHubLink />
        </CardFooter>
      </Card>
    </Section>
  );
}
