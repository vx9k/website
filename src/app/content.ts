// Everything the page says, in one place. Every claim is checkable against
// vx's GitHub profile and the public repos on github.com/vx9k, or came
// from vx; the products' descriptions, stacks and statuses are taken from
// each repository's README, manifests and docs.

export const site = {
  url: "https://kthread.dev",
  name: "vx",
  title: "vx, software engineer",
  description:
    "vx is a software engineer in Uruguay who writes C for Linux and TypeScript for the web. Work: a voxel sandbox in C and Vulkan, a Discord presence daemon in Rust, a minimal init.",
  github: "https://github.com/vx9k",
  source: "https://github.com/vx9k/website",
};

export const intro = {
  // vx's GitHub profile is marked available for hire.
  status: "Open to work",
  // From vx's GitHub profile (Software Engineer, Uruguay).
  line: "I’m vx, a software engineer based in Uruguay.",
  lede: "I write C for Linux, down to PID 1, and TypeScript for the web. I’m interested in how things work underneath, from network layers to language models.",
};

export type Product = {
  id: string;
  name: string;
  // One sentence on what it is and does.
  summary: string;
  // A few specifics from the README, one sentence each.
  notes: string[];
  stack: string[];
  status: string;
  license: string;
  repo: string;
  live?: { href: string; label: string };
  // Screenshots from the repository itself, converted to AVIF and WebP at
  // 640 and 1280 pixels wide in public/work/ (see README).
  image?: { src: string; width: number; height: number; alt: string };
};

// Ordered by how much each says about vx's work, not by date.
export const products: Product[] = [
  {
    id: "blockclonia",
    name: "blockclonia",
    summary:
      "A Minecraft-style voxel sandbox written from scratch in C11 and Vulkan, with physics in real units and a simulated human body instead of a health bar.",
    notes: [
      "Every block needs a load path to the ground: knock out a support and what it held falls as rigid bodies.",
      "Every texture and sound is generated at start-up.",
      "The renderer needs only Vulkan 1.0 with no optional features, so it runs down to a Raspberry Pi 4.",
    ],
    stack: ["C11", "Vulkan", "GLFW", "mimalloc", "miniaudio", "SQLite", "CMake"],
    status: "Builds on Linux and Raspberry Pi OS; macOS is experimental",
    license: "AGPL-3.0",
    repo: "https://github.com/vx9k/blockclonia",
    image: {
      src: "/work/blockclonia",
      width: 1280,
      height: 720,
      alt: "blockclonia’s title screen: the name in pixel letters and a menu with Play, Settings, Controls and Quit, over blocky hills, trees and a beach.",
    },
  },
  {
    id: "claude-presence",
    name: "claude-presence",
    summary:
      "Discord Rich Presence for Claude Code, in Rust: a small daemon, driven by Claude Code’s hooks, that shows what a session is doing on your Discord profile.",
    notes: [
      "Uses about 3 to 4 MB of memory and has no polling loop; a hook call takes about 2 ms.",
      "Keeps lifetime stats in one SQLite file, imported from your existing transcripts.",
      "Installs itself as a per-user service on Linux, macOS and Windows.",
    ],
    stack: ["Rust", "SQLite"],
    status: "Version 0.2.0, installed with cargo",
    license: "Apache-2.0",
    repo: "https://github.com/vx9k/claude-presence",
    image: {
      src: "/work/claude-presence",
      width: 1280,
      height: 490,
      alt: "claude-presence’s terminal dashboard: the daemon running and connected to Discord, the card reading “Working in claude-presence”, and today’s tokens, prompts, active time and streak.",
    },
  },
  {
    id: "4suite",
    name: "4suite",
    summary:
      "A self-contained boot stack for Linux in C: 4init, an init that runs as PID 1 and only manages processes, and 4rc, a service manager.",
    notes: ["4init is 81 lines of C, linked statically against musl."],
    stack: ["C", "musl", "Ninja"],
    status: "Experimental",
    license: "MIT",
    repo: "https://github.com/vx9k/4suite",
  },
  {
    id: "website",
    name: "kthread.dev",
    summary: "This site: a static Next.js export served by Cloudflare, with a strict content security policy and no cookies.",
    notes: [],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Workers"],
    status: "Live",
    license: "BSD-3-Clause",
    repo: "https://github.com/vx9k/website",
    live: { href: "https://kthread.dev", label: "kthread.dev" },
  },
];

// vx's own list. Don't add skills vx hasn't named.
export const skills = [
  { group: "Languages", items: ["C", "x86 Assembly", "Python", "JavaScript", "TypeScript"] },
  { group: "Web", items: ["HTML", "CSS", "Next.js", "Node.js"] },
  { group: "Networking", items: ["L2 and L3: data link, network", "L4: transport", "L6 and L7: presentation, application", "nftables", "nginx"] },
  { group: "AI", items: ["How LLMs work", "Working with AI"] },
];

export const contact = {
  heading: "I’m open to work.",
  body: "Write to me by email. All of this work is public on GitHub.",
  // vx's own address, published at vx's request.
  email: "dev@kthread.dev",
};

// The page's sections, in order. Ids double as URL fragments.
export const sections = [
  { id: "work", title: "Work" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
] as const;
