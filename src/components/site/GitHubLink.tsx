import { ArrowUpRightIcon } from "lucide-react";
import { links } from "@/app/content";
import { marks } from "@/app/marks";
import { Button } from "@/components/ui/button";

/** The link to vx's GitHub profile, as a button: in the intro, and again
 *  at the end of the page under Contact. */
export default function GitHubLink({ variant }: { variant?: "default" | "outline" }) {
  return (
    <Button asChild size="lg" variant={variant}>
      <a href={links.github}>
        <svg data-icon="inline-start" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={marks.github} />
        </svg>
        github.com/vx9k
        <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Button>
  );
}
