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

// Each place on the page takes one of hydrogen's four visible emission
// lines, the Balmer series, in order of wavelength down the page (in nm,
// rounded): the page shifts from violet to red as it scrolls. The
// colours are tokens in globals.css (--line-410 and so on).
export const lines = { top: 410, skills: 434, principles: 486, contact: 656 } as const;

// Each skill's icon comes from marks.ts (a brand mark) or SkillIcon.tsx (a
// drawn glyph), keyed by id. Brand marks use the brand's own colour, with a
// lighter shade where the original would vanish on ink; the drawn
// glyphs use signal. Skills without a name here take a
// translated one from the dictionaries, and some add a translated note.
// The year is when the skill first appeared, which sets its stop on the
// timeline; the dictionaries name the event each year stands for.
type Skill = { id: string; name?: string; color: string; ink?: string; year: number };

export const skills = [
  {
    group: "languages",
    items: [
      { id: "c", name: "C", color: "#a8b9cc", year: 1972 },
      { id: "asm", color: "var(--signal)", year: 1978 },
      { id: "python", name: "Python", color: "#5a9fd4", year: 1991 },
      // The JavaScript and TypeScript marks are squares with the letters
      // cut out; ink fills the letters the way the real logos do.
      { id: "javascript", name: "JavaScript", color: "#f7df1e", ink: "#141413", year: 1995 },
      { id: "typescript", name: "TypeScript", color: "#3178c6", ink: "#ffffff", year: 2012 },
    ],
  },
  {
    group: "web",
    items: [
      { id: "html", name: "HTML", color: "#e34f26", year: 1991 },
      { id: "css", name: "CSS", color: "#a47fd8", year: 1996 },
      { id: "nextjs", name: "Next.js", color: "var(--foreground)", year: 2016 },
      { id: "nodejs", name: "Node.js", color: "#5fa04e", year: 2009 },
    ],
  },
  {
    group: "networking",
    items: [
      { id: "l23", name: "L2 · L3", color: "var(--signal)", year: 1984 },
      { id: "l4", name: "L4", color: "var(--signal)", year: 1984 },
      { id: "l67", name: "L6 · L7", color: "var(--signal)", year: 1984 },
      { id: "nftables", name: "nftables", color: "var(--signal)", year: 2014 },
      { id: "nginx", name: "nginx", color: "#2fb45f", year: 2004 },
    ],
  },
  {
    group: "ai",
    items: [
      { id: "llm", color: "var(--signal)", year: 2017 },
      { id: "ai", color: "var(--signal)", year: 2022 },
    ],
  },
] as const satisfies { group: string; items: Skill[] }[];

// Time travel (src/quantum/time.ts): the page as it might have looked in
// the year each skill first appeared. Each world starts in its year and
// lasts until the next one starts; the last is today's design, which
// needs no stylesheet. The others are in public/eras/.
export const worlds = [
  { id: "teletype", from: 1972 },
  { id: "terminal", from: 1978 },
  { id: "desktop", from: 1984 },
  { id: "web1", from: 1991 },
  { id: "web2", from: 2004 },
  { id: "flat", from: 2012 },
  { id: "now", from: 2022 },
] as const;

export type World = (typeof worlds)[number]["id"];

// vx's own start, in vx's words: using tech since 2011. A mark on the
// timeline, not a stop.
export const started = 2011;

// Entangled skills (Entanglement.tsx): touch one and its partner answers.
// The owner chose the pairs.
export const pairs = [
  ["c", "asm"],
  ["javascript", "typescript"],
  ["html", "css"],
  ["nextjs", "nodejs"],
  ["nftables", "l4"],
  ["nginx", "l67"],
  ["llm", "ai"],
] as const;
