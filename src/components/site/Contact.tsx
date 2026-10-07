import { ArrowUpRightIcon } from "lucide-react";
import { links } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { marks } from "@/app/marks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "./Section";

/** Two large tiles side by side: open to work, on grey, and the way to
 *  the code, a black tile that's one big link. In the eras the link is an
 *  ordinary button (the tile is shadcn/ui's Button underneath). */
export default function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <Section id="contact" title={c.title}>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="contact-card tile justify-end rounded-none border-0 bg-card px-6 py-6 shadow-none sm:min-h-[18rem] sm:px-8 sm:py-8">
          <CardHeader className="gap-4 px-0">
            <CardTitle role="heading" aria-level={3} className="flex items-center gap-3 text-[clamp(2rem,1.2rem+2.6vw,3.25rem)] leading-none font-normal tracking-[-0.045em]">
              <span aria-hidden className="status-dot size-2.5 shrink-0 rounded-full bg-signal" />
              {c.heading}
            </CardTitle>
            <CardDescription className="text-lg">{c.body}</CardDescription>
          </CardHeader>
        </Card>
        <Button asChild size="lg" className="cta-tile">
          <a href={links.github}>
            <svg data-icon="inline-start" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d={marks.github} />
            </svg>
            <span className="cta-text">github.com/vx9k</span>
            <ArrowUpRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </Section>
  );
}
