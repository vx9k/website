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
    "vx is a software engineer in Uruguay and a co-founder of Poopware Laboratories. Work: a terminal emulator in Rust, a voxel sandbox in C and Vulkan, a code editor in Zig, a Linux distribution and its boot stack.",
  github: "https://github.com/vx9k",
  source: "https://github.com/vx9k/website",
};

export const intro = {
  // vx's GitHub profile is marked available for hire.
  status: "Open to work",
  // From vx's GitHub profile (Software Engineer, Uruguay; co-founder of
  // Poopware Laboratories), and its own words for the lede.
  line: "I’m vx, a software engineer in Uruguay.",
  lede: "I write systems software from the bottom up: C on Linux down to PID 1, Rust and Zig for the tools I live in, Vulkan when it has to draw, and TypeScript when it has to be on the web.",
  // The lab vx co-founded, from the profile.
  lab: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "Co-founder" },
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

// Ordered by how much each says about vx's work, not by date. Each one's
// live numbers (stars, vx's commits, last push, latest release) come from
// src/data/github.json, matched by its repository's URL.
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
    id: "caca",
    name: "caca",
    kind: "Code editor",
    summary:
      "A modal terminal code editor in Zig, with Kakoune-style keys, multiple selections, regex search, undo and several buffers.",
    notes: [
      "Ships with bounds and overflow checks on; its SIMD text scanning still runs at about 14 to 24 GiB/\u2060s.",
      "Draws its first frame in about 1 ms, against 1.8 ms for Kakoune and 13 ms for Neovim in its own comparison.",
      "Treats file contents as untrusted: escape sequences and control bytes are shown, never written to the terminal raw, and saves are atomic.",
    ],
    stack: ["Zig", "mimalloc"],
    status: "Early development: no syntax highlighting or configuration yet",
    license: "AGPL-3.0",
    repo: "https://github.com/poopware-laboratories/caca",
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
      "Its init and service supervisor is poopsuite, and its package manager has its own repository at the lab.",
      "Each performance target in its design, such as a login prompt in QEMU within 20 seconds of boot, gets measured in CI before it’s claimed.",
    ],
    stack: ["Linux", "musl", "archiso", "Shell"],
    status: "Pre-alpha: the design and contributor docs so far, with nothing to install yet",
    license: "BSD-3-Clause",
    repo: "https://github.com/poopware-laboratories/pooplinux",
    group: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "main contributor" },
  },
  {
    id: "poopsuite",
    name: "poopsuite",
    kind: "Boot stack",
    summary:
      "A self-contained boot stack for Linux in C: 4init, an init that runs as PID 1 and only manages processes, and 4rc, a service manager.",
    notes: [
      "4init is 81 lines of C, linked statically against musl.",
      "Poop Linux uses it as its init. It began as 4suite.",
    ],
    stack: ["C", "musl", "Ninja"],
    status: "Experimental",
    license: "MIT",
    repo: "https://github.com/poopware-laboratories/poopsuite",
    group: { name: "Poopware Laboratories", href: "https://github.com/poopware-laboratories", role: "author" },
  },
  {
    id: "website",
    name: "kthread.dev",
    kind: "This site",
    summary: "This site: a static Next.js export served by Cloudflare, with a strict content security policy and no cookies.",
    notes: [
      "Designed after Soviet posters and mainframe consoles of the 1960s to 80s, drawn in SVG and CSS, with no images but the screenshots.",
      "A workflow refreshes its GitHub numbers every day, and the push redeploys it.",
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
  { id: "repos", title: "Repositories" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
] as const;
