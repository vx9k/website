// Shared site content. Everything here is taken from the public repos on
// github.com/vx9k, so the page never claims work that doesn't exist.

export const links = {
  github: "https://github.com/vx9k",
  suite: "https://github.com/vx9k/4suite",
  website: "https://github.com/vx9k/website",
};

export const sections = [
  { id: "top", label: "Home" },
  { id: "principles", label: "Principles" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export const principles = [
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
];

export type Status = "shipping" | "in progress" | "planned";

export type Node = {
  name: string;
  status: Status;
  body: string;
  note?: string;
  children?: Node[];
};

// 4init starts 4rc by default (4init/README.md); logger and user are part
// of the suite's stated scope but have no code yet.
export const suiteTree: Node[] = [
  {
    name: "4init",
    status: "shipping",
    body: "Minimal PID 1. Blocks signals and reads them through a signalfd, forks 4rc into its own session, then reaps children on every SIGCHLD. The rc path lives in config.h. If it crashes, the kernel panics, same as any init would.",
    note: "Inspired by rofl0r's minimal init.",
    children: [
      {
        name: "4rc",
        status: "in progress",
        body: "The service manager 4init starts. Early days: its own README says it “larps as being functional”.",
      },
    ],
  },
  { name: "logger", status: "planned", body: "Part of the suite's scope. Not started." },
  { name: "user", status: "planned", body: "Part of the suite's scope. Not started." },
];

export const stack = [
  { group: "Languages", items: ["C", "TypeScript"] },
  { group: "Web", items: ["Next.js", "React", "Tailwind CSS"] },
  { group: "Tooling", items: ["clang-format", "Ninja", "pnpm", "Git", "GitHub Actions"] },
];
