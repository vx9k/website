// Facts that read the same in every language; translated copy lives in
// i18n/. The skills are vx's own list. Everything else comes from vx's
// GitHub profile and the public repos on github.com/vx9k.

export const links = {
  github: "https://github.com/vx9k",
  website: "https://github.com/vx9k/website",
};

// Ids double as URL fragments, so they stay in English everywhere. The
// order here is the order on the page, and sets each section's number.
export const sections = ["skills", "principles", "contact"] as const;

// Each skill's icon comes from marks.ts (a brand mark) or SkillIcon.tsx (a
// drawn glyph), keyed by id. Brand marks use the brand's own colour, with a
// lighter shade where the original would vanish on carbon; the drawn
// glyphs use signal. Skills without a name here take a
// translated one from the dictionaries, and some add a translated note.
type Skill = { id: string; name?: string; color: string; ink?: string };

export const skills = [
  {
    group: "languages",
    items: [
      { id: "c", name: "C", color: "#a8b9cc" },
      { id: "asm", color: "var(--signal)" },
      { id: "python", name: "Python", color: "#5a9fd4" },
      // The JavaScript and TypeScript marks are squares with the letters
      // cut out; ink fills the letters the way the real logos do.
      { id: "javascript", name: "JavaScript", color: "#f7df1e", ink: "#141413" },
      { id: "typescript", name: "TypeScript", color: "#3178c6", ink: "#ffffff" },
    ],
  },
  {
    group: "web",
    items: [
      { id: "html", name: "HTML", color: "#e34f26" },
      { id: "css", name: "CSS", color: "#a47fd8" },
      { id: "nextjs", name: "Next.js", color: "var(--foreground)" },
      { id: "nodejs", name: "Node.js", color: "#5fa04e" },
    ],
  },
  {
    group: "networking",
    items: [
      { id: "l23", name: "L2 · L3", color: "var(--signal)" },
      { id: "l4", name: "L4", color: "var(--signal)" },
      { id: "l67", name: "L6 · L7", color: "var(--signal)" },
      { id: "nftables", name: "nftables", color: "var(--signal)" },
      { id: "nginx", name: "nginx", color: "#2fb45f" },
    ],
  },
  {
    group: "ai",
    items: [
      { id: "llm", color: "var(--signal)" },
      { id: "ai", color: "var(--signal)" },
    ],
  },
] as const satisfies { group: string; items: Skill[] }[];
