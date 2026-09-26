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
    lede: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting. The current project is 4suite, a self-contained boot stack for Linux.",
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
      body: "A self-contained boot stack in C: init, rc, logger and user, each with its own scope and its own README.",
      target: "Linux, BSD planned",
      platforms: "Linux only for now. signalfd is a Linux interface; BSD support is planned.",
      components: "Components",
      nodes: {
        "4init": "Minimal PID 1. Blocks signals and reads them through a signalfd, forks 4rc into its own session, then reaps children on every SIGCHLD. Inspired by rofl0r's minimal init.",
        "4rc": "The service manager 4init starts. Early days: its own README says it “larps as being functional”.",
        logger: "Part of the suite's scope. Not started.",
        user: "Part of the suite's scope. Not started.",
      },
    },
    site: {
      body: "A static Next.js export served from Cloudflare Workers, in English, Spanish and Portuguese. The root picks a language at the edge, and the page follows your system's light or dark setting.",
    },
  },
  principles: {
    title: "Principles",
    aside: "Three rules that decide most of my trade-offs before I write a line.",
    items: [
      {
        title: "Standards over shortcuts",
        body: "POSIX interfaces over vendor extensions. If a program runs on only one platform, someone decided that, and the decision needs a reason.",
      },
      {
        title: "One job, done predictably",
        body: "An init that only manages processes. A service manager that only manages services. Scope creep is usually the first sign something's about to become unreliable.",
      },
      {
        title: "Small enough to understand fully",
        body: "Code you can hold in your head beats code you have to trust. If I can't explain why a line is there, it doesn't stay.",
      },
    ],
  },
  stack: {
    title: "Stack",
    groups: { languages: "Languages", web: "Web", tooling: "Tooling" },
  },
  contact: {
    title: "Contact",
    quote:
      "I'd rather ship something small that I fully understand than something large I'm still discovering the edges of.",
    source: "Source for this site",
  },
  footer: {
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
