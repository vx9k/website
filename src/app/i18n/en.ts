// English (US). This file is the source of truth: the other dictionaries
// are typed against it, so a missing or extra key fails the build.
const en = {
  meta: {
    title: "vx — software engineer",
    description: "vx is based in Uruguay and writes C for Linux and TypeScript for the web.",
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
    // From vx's GitHub profile and public repos: 4init is a minimal PID 1.
    line: "I’m vx, based in Uruguay.",
    lede: "I write C for Linux, down to PID 1, and TypeScript for the web, like this site. I’m interested in how things work underneath, from network layers to language models.",
    quote: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting.",
    facts: [
      { k: "Role", v: "Software engineer" },
      { k: "Source", v: "github.com/vx9k" },
    ],
    // vx's GitHub profile is marked available for hire.
    status: { k: "Status", v: "Open to work" },
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
    line: "I’m open to work. My projects are public on GitHub.",
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
