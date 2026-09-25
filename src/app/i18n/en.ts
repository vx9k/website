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
    principles: "Principles",
    work: "Work",
    stack: "Stack",
    contact: "Contact",
  },
  display: {
    button: "Display",
    label: "Display settings",
    systemOn: "on: your system asks for it",
    note: "Saved on this device. Your system settings for contrast, motion and e-ink screens are followed automatically.",
    contrast: { label: "High contrast", hint: "Solid colours, stronger edges" },
    motion: { label: "Reduce motion", hint: "Turns off animation" },
    eink: { label: "Paper (e-ink)", hint: "Black on white, for e-ink screens" },
    large: { label: "Larger text", hint: "Type 25% larger" },
  },
  offline: {
    down: "You're offline. Pages you've already opened still work.",
    back: "Back online.",
  },
  hero: {
    lead: "I write software meant to",
    // The first phrase is the one that stays when motion is off.
    phrases: [
      "outlast the machine it runs on.",
      "fit in one reader's head.",
      "do one job, predictably.",
    ],
    lede: "I write minimal init systems in C. The code is small enough to read in one sitting and sticks to POSIX interfaces where it can.",
    cta: "See the work",
    facts: [
      { k: "Role", v: "Systems engineer" },
      { k: "Focus", v: "Init systems, POSIX C" },
      { k: "Current", v: "4suite / 4rc" },
      { k: "Source", v: "github.com/vx9k" },
    ],
  },
  principles: {
    kicker: "Principles",
    title: "How I build",
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
  work: {
    kicker: "Work",
    title: "Selected work",
    aside: "Small programs that each do one job, laid out the way they run.",
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
      graphics: "Graphics",
      hosting: "Hosting",
    },
    suite: {
      eyebrow: "Boot stack",
      body: "A self-contained boot stack in C: init, rc, logger and user, each with its own scope and its own README.",
      target: "Linux, BSD planned",
      components: "Components",
      componentsLabel: "4suite components",
      nodes: {
        "4init": {
          body: "Minimal PID 1. Blocks signals and reads them through a signalfd, forks 4rc into its own session, then reaps children on every SIGCHLD. The rc path lives in config.h. If it crashes, the kernel panics, same as any init would.",
          note: "Inspired by rofl0r's minimal init.",
        },
        "4rc": {
          body: "The service manager 4init starts. Early days: its own README says it “larps as being functional”.",
        },
        logger: { body: "Part of the suite's scope. Not started." },
        user: { body: "Part of the suite's scope. Not started." },
      },
      platforms:
        "Linux only for now. signalfd is a Linux interface; BSD support is planned.",
    },
    site: {
      eyebrow: "This site",
      body: "A static Next.js export served from Cloudflare Workers. The ember smoke behind the hero is a WebGPU shader that falls back to WebGL2, then to plain CSS. The page tells you when you go offline, has a paper mode for e-ink screens, and reads in English, Spanish and Portuguese.",
    },
  },
  stack: {
    kicker: "Stack",
    title: "Tools I reach for",
    groups: { languages: "Languages", web: "Web", tooling: "Tooling" },
  },
  contact: {
    kicker: "Contact",
    title: "Say hello",
    quote:
      "I'd rather ship something small that I fully understand than something large I'm still discovering the edges of.",
    source: "Source for this site",
  },
  footer: { source: "Source" },
  notFound: {
    title: "Page not found",
    eyebrow: "Not found",
    body: "Nothing lives at this address. The link may be old, or the URL may have a typo.",
    back: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
