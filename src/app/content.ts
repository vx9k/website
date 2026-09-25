// Facts that read the same in every language. All of it comes from the
// public repos on github.com/vx9k; translated copy lives in i18n/.

export const links = {
  github: "https://github.com/vx9k",
  suite: "https://github.com/vx9k/4suite",
  website: "https://github.com/vx9k/website",
};

// Ids double as URL fragments, so they stay in English everywhere.
export const sections = ["work", "principles", "stack", "contact"] as const;

export type Status = "shipping" | "in progress" | "planned";

// 4init starts 4rc (4init/README.md), so 4rc sits one step in. logger and
// user are in the suite's stated scope but have no code yet.
export const suite = [
  { name: "4init", status: "shipping", depth: 0 },
  { name: "4rc", status: "in progress", depth: 1 },
  { name: "logger", status: "planned", depth: 0 },
  { name: "user", status: "planned", depth: 0 },
] as const satisfies { name: string; status: Status; depth: number }[];

export const specs = {
  suite: { language: "C", build: "Ninja", license: "MIT" },
  site: {
    language: "TypeScript",
    framework: "Next.js",
    graphics: "SVG",
    hosting: "Cloudflare Workers",
  },
};

export const stack = [
  { group: "languages", items: ["C", "TypeScript"] },
  { group: "web", items: ["Next.js", "React", "Tailwind CSS"] },
  { group: "tooling", items: ["clang-format", "Ninja", "pnpm", "Git", "GitHub Actions"] },
] as const;
