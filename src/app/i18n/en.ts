// English (US). This file is the source of truth: the other dictionaries
// are typed against it, so a missing or extra key fails the build.
const en = {
  meta: {
    title: "vx — systems engineer",
    description:
      "vx writes minimal init systems and boot tooling in C, small enough to read in one sitting.",
  },
  skip: "Skip to content",
  nav: {
    label: "Sections",
    language: "Language",
    skills: "Skills",
    principles: "Principles",
    contact: "Contact",
  },
  hero: {
    line: "Init systems and boot tooling in C.",
    lede: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting.",
    facts: [
      { k: "Role", v: "Systems engineer" },
      { k: "Focus", v: "Init systems, POSIX C" },
      { k: "Source", v: "github.com/vx9k" },
    ],
  },
  skills: {
    title: "Skills",
    groups: { languages: "Languages", web: "Web", networking: "Networking", ai: "AI" },
    // Names for the skills that have none in content.ts.
    names: { asm: "x86 Assembly", llm: "How LLMs work", ai: "Working with AI" },
    // The OSI layers each entry covers.
    notes: { l23: "Data link, network", l4: "Transport", l67: "Presentation, application" },
  },
  principles: {
    title: "Principles",
    items: [
      {
        title: "Standards over shortcuts",
        body: "POSIX interfaces over vendor extensions.",
      },
      {
        title: "One job, done predictably",
        body: "An init that only manages processes. A service manager that only manages services.",
      },
      {
        title: "Small enough to understand fully",
        body: "If I can’t explain why a line is there, it doesn’t stay.",
      },
    ],
  },
  contact: {
    title: "Contact",
    line: "My projects are public on GitHub.",
  },
  footer: {
    source: "Source for this site",
    top: "Back to top",
  },
  notFound: {
    title: "Page not found",
    body: "There’s no page at this address. The link may be old, or the URL may have a typo.",
    back: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
