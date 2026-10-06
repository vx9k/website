import type { Dictionary } from "@/app/i18n";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GitHubLink from "./GitHubLink";
import Section from "./Section";

/** On a block of H-alpha, the last line on the page: open to work, set
 *  large and wide, and the way to the code again. */
export default function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <Section id="contact" title={c.title} tone="block">
      <Card className="contact-card gap-10 rounded-none border-0 bg-transparent py-0 shadow-none md:flex-row md:items-end md:justify-between">
        <CardHeader className="flex-1 gap-5 px-0">
          <CardTitle
            role="heading"
            aria-level={3}
            className="contact-heading text-[clamp(2rem,1rem+4vw,4.5rem)] leading-none font-bold tracking-tight text-balance [font-stretch:125%]"
          >
            <span aria-hidden className="mr-[0.3em] inline-block size-[0.3em] rounded-[1px] bg-signal align-middle" />
            {c.heading}
          </CardTitle>
          <CardDescription className="text-lg">{c.body}</CardDescription>
        </CardHeader>
        <CardFooter className="px-0">
          <GitHubLink />
        </CardFooter>
      </Card>
    </Section>
  );
}
