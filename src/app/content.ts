// Facts that read the same in every language. All of it comes from the
// public repos on github.com/vx9k; translated copy lives in i18n/.

export const links = {
  github: "https://github.com/vx9k",
  suite: "https://github.com/vx9k/4suite",
  website: "https://github.com/vx9k/website",
};

// Ids double as URL fragments, so they stay in English everywhere. The
// order here is the order on the page, and sets each section's number.
export const sections = ["work", "principles", "stack", "contact"] as const;

export type Status = "shipping" | "in progress" | "planned";

// In the order they run: 4init starts 4rc (4init/README.md). logger and
// user are in the suite's stated scope but have no code yet.
export const suite = [
  { name: "4init", status: "shipping" },
  { name: "4rc", status: "in progress" },
  { name: "logger", status: "planned" },
  { name: "user", status: "planned" },
] as const satisfies { name: string; status: Status }[];

export const specs = {
  suite: { language: "C", build: "Ninja", license: "MIT" },
  site: {
    language: "TypeScript",
    framework: "Next.js",
    styling: "Tailwind CSS",
    hosting: "Cloudflare Workers",
  },
};

export const stack = [
  { group: "languages", items: ["C", "TypeScript"] },
  { group: "web", items: ["Next.js", "React", "Tailwind CSS"] },
  { group: "tooling", items: ["clang-format", "Ninja", "pnpm", "Git", "GitHub Actions"] },
] as const;
