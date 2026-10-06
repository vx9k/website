# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k).

It's a single static page built with Next.js, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com), exported to plain HTML and served from Cloudflare Workers at [kthread.dev](https://kthread.dev). The design is brutalist, on black: Instrument Sans at display sizes with IBM Plex Mono for labels, a column whose edges are drawn down the page, and sections as bands with the title pinned on the left while the content scrolls past on the right. The headline's words resolve in a different random order on every load, and the sections rise in as you scroll to them. The skills carry small animated icons in their own colours, drawn in CSS and SVG. It reads in English, Spanish and Portuguese.

Over the page sits a quantum layer, all of it optional. Moving around the page branches it like many worlds, and a map in the header lets you jump back to any branch. Faint waves from three sources interfere behind the page, one of them following your pointer, and quantum foam fizzes through them: pairs of particles that appear at random and annihilate, simulated in WebAssembly and drawn with WebGPU where your browser has it. A mouse pointer carries a cloud of where it might be, and a click collapses it. Paired skills answer each other, and a hydrogen orbital turns behind the headline. Each visit draws its own random salt, so the same branch lays out differently next time. The links in the header sit in several faint places at once and collapse into one as your pointer comes near. The parts you haven't visited flicker faintly behind the one you're in, and moving between sections tunnels through a barrier. A timeline in the header lists each skill in the year it first appeared, and travelling to one shows the page as it might have looked then, from a 1972 teletype printout and a 1978 terminal on a CRT through the early web and Web 2.0 to flat design; the content stays the same. Each effect can be switched off from the footer, and they all keep still when your system asks for less motion.

## Running it

You need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io). `corepack enable` picks up the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev          # dev server at http://localhost:3000
```

To build the static site the way it's deployed:

```sh
pnpm build          # writes the site to out/ and hashes its inline scripts into the CSP
pnpm wrangler dev   # serves out/ through the Workers runtime at http://localhost:8787
```

## Structure

```
src/
├── worker.ts                 runs for "/" only: sends visitors to /en, /es or /pt
├── app/
│   ├── [lang]/layout.tsx     metadata, hreflang, the skip link and the Trusted Types policy
│   ├── [lang]/page.tsx       the page: header, sections and footer
│   ├── global-not-found.tsx  the 404 page, in all three languages
│   ├── content.ts            language-neutral facts: links, sections, skills
│   ├── marks.ts              brand marks, from Simple Icons (CC0)
│   ├── i18n/                 the copy in English, Spanish and Portuguese
│   └── globals.css           shadcn/ui's tokens in black, the grid, and the page's motion
├── components/
│   ├── ui/                   shadcn/ui: button, card, badge, separator, dialog, switch, field
│   ├── site/                 the intro, the sections, the skill icons and the language links
│   └── quantum/              the branch map, the timeline, the effects panel and the ghost previews
├── quantum/                  the branch tree, navigation and history, time travel, the effect flags
└── lib/utils.ts              shadcn/ui's cn()
public/eras/                  one stylesheet per past era of time travel, and its fonts
```

Other files at the root:

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Guide for anyone (or any coding agent) changing the site: design rules, accessibility checks, content rules. `CLAUDE.md` points to it. |
| `.agents/skills/`, `.claude/skills/` | Skills for coding agents (design, and shadcn/ui's), pinned in `skills-lock.json`. |
| `components.json` | shadcn/ui's config, so `pnpm dlx shadcn@latest add <component>` drops new components into `src/components/ui/`. |
| `wrangler.jsonc` | Cloudflare Workers config: serves `out/` as static assets on kthread.dev, with `404.html` for unknown paths. |
| `public/_headers` | Response headers: the security headers (CSP, HSTS and the rest) and long-term caching for hashed assets. |
| `scripts/csp.mjs` | Runs after `next build`: hashes every inline script in `out/` into the CSP in `out/_headers`. |
| `next.config.ts` | Static export and the React Compiler. |

## Editing content

Facts that read the same in every language live in `src/app/content.ts`; the copy lives in `src/app/i18n/`, one file per language. Keep it factual: the skills are vx's own list, and everything else on the page should be checkable against the public repos. Projects aren't listed here; they're on [GitHub](https://github.com/vx9k).

For anything visual, read the design and accessibility sections of [`AGENTS.md`](AGENTS.md) first. Every change has to work at phone and desktop widths, in all three languages.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

## License

[BSD 3-Clause](LICENSE).
