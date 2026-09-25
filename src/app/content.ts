// Shared site data that doesn't change between languages. Everything here
// is taken from the public repos on github.com/vx9k, so the page never
// claims work that doesn't exist. Translated copy lives in i18n/.

export const links = {
  github: "https://github.com/vx9k",
  suite: "https://github.com/vx9k/4suite",
  website: "https://github.com/vx9k/website",
};

// Section ids double as URL fragments, so they stay in English in every
// language; nav labels come from the dictionary under the same key.
export const sections = ["principles", "work", "stack", "contact"] as const;

export type Status = "shipping" | "in progress" | "planned";

export type Node = {
  name: "4init" | "4rc" | "logger" | "user";
  status: Status;
  children?: Node[];
};

// 4init starts 4rc by default (4init/README.md); logger and user are part
// of the suite's stated scope but have no code yet.
export const suiteTree: Node[] = [
  {
    name: "4init",
    status: "shipping",
    children: [{ name: "4rc", status: "in progress" }],
  },
  { name: "logger", status: "planned" },
  { name: "user", status: "planned" },
];

export const stack = [
  { group: "languages", items: ["C", "TypeScript"] },
  { group: "web", items: ["Next.js", "React", "Tailwind CSS"] },
  { group: "tooling", items: ["clang-format", "Ninja", "pnpm", "Git", "GitHub Actions"] },
] as const;
