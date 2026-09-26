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
    work: "Work",
    principles: "Principles",
    stack: "Stack",
    contact: "Contact",
  },
  hero: {
    line: "Init systems and boot tooling in C.",
    lede: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting.",
    facts: [
      { k: "Role", v: "Systems engineer" },
      { k: "Focus", v: "Init systems, POSIX C" },
      { k: "Current", v: "4suite / 4rc" },
      { k: "Source", v: "github.com/vx9k" },
    ],
  },
  work: {
    title: "Work",
    status: {
      shipping: "shipping",
      "in progress": "in progress",
      planned: "planned",
    },
    spec: {
      language: "Language",
      target: "Target",
      build: "Build",
      license: "License",
      framework: "Framework",
      styling: "Styling",
      hosting: "Hosting",
    },
    suite: {
      body: "A self-contained boot stack in C, made of four small programs: init, rc, logger and user.",
      target: "Linux, BSD planned",
      components: "Components",
      // Only the components with code get a description; the rest are
      // described by their status.
      nodes: {
        "4init": "Minimal PID 1. Blocks signals and reads them through a signalfd, forks 4rc into its own session, then reaps children on every SIGCHLD. Inspired by rofl0r’s minimal init.",
        "4rc": "The service manager 4init starts by default. Early work.",
      },
    },
    site: {
      body: "A static Next.js export served from Cloudflare Workers, in English, Spanish and Portuguese. The root picks a language at the edge, and the page follows your system’s light or dark setting.",
    },
  },
  principles: {
    title: "Principles",
    items: [
      {
        title: "Standards over shortcuts",
        body: "POSIX interfaces over vendor extensions. Anything platform-specific needs a stated reason.",
      },
      {
        title: "One job, done predictably",
        body: "An init that only manages processes, and a service manager that only manages services. The rest of the stack is planned as separate programs.",
      },
      {
        title: "Small enough to understand fully",
        body: "If I can’t explain why a line is there, it doesn’t stay.",
      },
    ],
  },
  stack: {
    title: "Stack",
    groups: { languages: "Languages", web: "Web", tooling: "Tooling" },
  },
  contact: {
    title: "Contact",
    line: "All the work above is public on GitHub.",
  },
  footer: {
    source: "Source for this site",
    top: "Back to top",
  },
  notFound: {
    title: "Page not found",
    body: "Nothing lives at this address. The link may be old, or the URL may have a typo.",
    back: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
