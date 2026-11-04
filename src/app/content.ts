// Everything the page says, in one place. Every claim is checkable against
// vx's GitHub profile, the public repos on github.com/vx9k and
// github.com/poopware-laboratories, or came from vx; the products'
// descriptions, stacks and statuses are taken from each repository's
// README, manifests and docs.

export const site = {
  url: "https://kthread.dev",
  name: "vx",
  title: "vx, software engineer",
  description:
    "vx is a software engineer in Uruguay who writes C for Linux and TypeScript for the web. Work: a terminal emulator in Rust, a voxel sandbox in C and Vulkan, a Discord presence daemon in Rust, a Linux distribution.",
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
  // What it is in two or three words, for its button on the page.
  kind: string;
  // One sentence on what it is and does.
  summary: string;
  // A few specifics from the README, one sentence each.
  notes: string[];
  stack: string[];
  status: string;
  license: string;
  repo: string;
  live?: { href: string; label: string };
  // Set for work made with a group, with vx's part in it (from the
  // repository's contributors).
  group?: { name: string; href: string; role: string };
  // Screenshots from the repository itself, the first the main one,
  // converted to AVIF and WebP in public/work/ at each of `widths` (640 and
  // the source's own width, up to 1280; never enlarged). width and height
  // are the largest file's.
  images?: { src: string; widths: number[]; width: number; height: number; alt: string }[];
};

// Ordered by how much each says about vx's work, not by date.
export const products: Product[] = [
  {
    id: "poopterm",
    name: "poopterm",
    kind: "Terminal emulator",
    summary:
      "A fast terminal emulator in Rust for Linux, macOS and FreeBSD, with its own Vulkan renderer, escape-sequence parser, font engine and image decoders.",
    notes: [
      "Handles real-world output at 75 to 375 MB/\u2060s end to end on a low-power laptop CPU, 137 MB/\u2060s overall with images included.",
      "On Linux and FreeBSD it draws whole frames on the GPU through its own Vulkan bindings, with its software renderer as the fallback; macOS draws in software for now.",
      "Shows images over Sixel and the kitty graphics protocol, and speaks the kitty keyboard protocol and shell integration for zsh, fish and bash.",
      "On Linux, each tab’s shell runs in its own cgroup with a memory cap, so a runaway program can’t starve the other tabs.",
    ],
    stack: ["Rust", "Vulkan", "winit", "softbuffer", "mimalloc"],
    status: "Released, with packages for Homebrew, Debian, Fedora and Arch; not yet a complete xterm implementation",
    license: "AGPL-3.0-or-later",
    repo: "https://github.com/poopware-laboratories/poopterm",
    group: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "main contributor" },
    images: [
      {
        src: "/work/poopterm",
        widths: [640, 1000],
        width: 1000,
        height: 600,
        alt: "poopterm in its brown Poop theme: a cargo build, its benchmark of log, CJK and emoji output, text in Greek, Cyrillic, Chinese and Korean, emoji, styled text, a link and a row of colour swatches ending in a gradient.",
      },
      {
        src: "/work/poopterm-settings",
        widths: [640, 820],
        width: 820,
        height: 600,
        alt: "poopterm’s Settings window, drawn on the GPU, open at its keyboard shortcuts: new tab, command palette, cycle theme, search, close tab, prompt jumps and zoom, each with its key chord.",
      },
      {
        src: "/work/poopterm-diagnostics",
        widths: [640, 760],
        width: 760,
        height: 640,
        alt: "poopterm’s diagnostics page on a dark theme, listing the grid, window chrome, overlays, images and wallpaper as hardware accelerated through Vulkan, on Intel graphics.",
      },
    ],
  },
  {
    id: "blockclonia",
    name: "blockclonia",
    kind: "Voxel sandbox",
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
    images: [
      {
        src: "/work/blockclonia",
        widths: [640, 1280],
        width: 1280,
        height: 720,
        alt: "blockclonia’s title screen: the name in pixel letters and a menu with Play, Settings, Controls and Quit, over blocky hills, trees and a beach.",
      },
    ],
  },
  {
    id: "claude-presence",
    name: "claude-presence",
    kind: "Discord presence daemon",
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
    images: [
      {
        src: "/work/claude-presence",
        widths: [640, 1280],
        width: 1280,
        height: 490,
        alt: "claude-presence’s terminal dashboard: the daemon running and connected to Discord, the card reading “Working in claude-presence”, and today’s tokens, prompts, active time and streak.",
      },
    ],
  },
  {
    id: "neocaca",
    name: "neocaca",
    kind: "Terminal code editor",
    summary:
      "A modal terminal code editor in Zig, with Kakoune-style keys, multiple selections, regex search and undo.",
    notes: [
      "Ships with bounds and overflow checks on; its SIMD text scanning still runs at about 14 to 24 GiB/\u2060s.",
      "Treats file contents as untrusted: escape sequences and control bytes are shown, never written to the terminal raw.",
      "Saves atomically, so a crash never truncates a file.",
    ],
    stack: ["Zig", "mimalloc"],
    status: "Early days: edits one file at a time, with no syntax highlighting yet",
    license: "AGPL-3.0",
    repo: "https://github.com/poopware-laboratories/neocaca",
    group: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "contributor" },
  },
  {
    id: "pooplinux",
    name: "Poop Linux",
    kind: "Linux distribution",
    summary:
      "A Linux distribution built from source by its own recipes, on Poopware Laboratories’ own kernel fork, musl fork, init and package manager.",
    notes: [
      "Its first edition boots to a text console only, on x86_64 with UEFI.",
      "Its init and service supervisor is 4suite, as poopsuite; its package manager, poop, is designed to check signatures and install in atomic transactions.",
      "Each performance target in its design, such as a login prompt in QEMU within 20 seconds of boot, gets measured in CI before it’s claimed.",
    ],
    stack: ["Linux", "musl", "archiso", "Shell"],
    status: "Pre-alpha: the design and contributor docs so far, with nothing to install yet",
    license: "BSD-3-Clause",
    repo: "https://github.com/poopware-laboratories/pooplinux",
    group: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "main contributor" },
  },
  {
    id: "4suite",
    name: "4suite",
    kind: "Boot stack",
    summary:
      "A self-contained boot stack for Linux in C: 4init, an init that runs as PID 1 and only manages processes, and 4rc, a service manager.",
    notes: [
      "4init is 81 lines of C, linked statically against musl.",
      "Poop Linux uses it as its init, as poopsuite, the same repository at Poopware Laboratories.",
    ],
    stack: ["C", "musl", "Ninja"],
    status: "Experimental",
    license: "MIT",
    repo: "https://github.com/vx9k/4suite",
  },
  {
    id: "website",
    name: "kthread.dev",
    kind: "This site",
    summary: "This site: a static Next.js export served by Cloudflare, with a strict content security policy and no cookies.",
    notes: [
      "The Cerro behind it is pixel art drawn by a script, pixel by pixel, on a sunny day in the light theme and at night in the dark one, and only ever shown at whole-number scales.",
      "Everything moves in CSS, with a switch to turn the motion off.",
    ],
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
