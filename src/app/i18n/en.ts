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
    // vx's GitHub profile is marked available for hire.
    status: "Open to work",
    // From vx's GitHub profile (Software Engineer, Uruguay) and public
    // repos: 4init is a minimal PID 1.
    line: "I’m vx, a software engineer based in Uruguay.",
    lede: "I write C for Linux, down to PID 1, and TypeScript for the web, like this site. I’m interested in how things work underneath, from network layers to language models.",
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
    quote: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting.",
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
    heading: "I’m open to work.",
    body: "My projects are public on GitHub.",
  },
  footer: {
    source: "Source for this site",
    top: "Back to top",
  },
  // The quantum layer: the branch map in the header and the effects
  // panel in the footer.
  quantum: {
    close: "Close",
    branches: {
      open: "Branches",
      title: "Branches",
      description: "Every place you’ve been on this page, splitting wherever you took a different path. Pick one to go back to it.",
      here: "You are here",
      top: "Introduction",
      choice: {
        start: "Arrival",
        nav: "Link",
        lang: "Language change",
        map: "Map jump",
        link: "Direct visit",
      },
    },
    effects: {
      open: "Effects",
      title: "Effects",
      description: "The visual effects on this page. Your choice is saved in this browser.",
      all: "All effects",
      reduced: "Your system asks for less motion, so the effects stay still.",
      items: {
        ghosts: {
          name: "Ghost previews",
          note: "Faint echoes of the parts of the page you haven’t opened yet.",
        },
        tunneling: {
          name: "Tunneling transitions",
          note: "Moving to another section passes through a barrier.",
        },
      },
    },
  },
  notFound: {
    title: "Page not found",
    body: "There’s no page at this address. The link may be old, or the URL may have a typo.",
    back: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
