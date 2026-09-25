# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k).

It's a single static page built with Next.js and Tailwind CSS, exported to plain HTML and served from Cloudflare Workers at [kthread.dev](https://kthread.dev). The page is a retro handheld console in the four-colour Mist GB palette. At the top of its screen is a small pixel-art landscape, generated at build time as SVG: pines on two ranges of hills, a big tree and a windsock, with a wind made of CSS that sends gusts across it from left to right. The sun (or moon) swaps the palette, the windsock sends a gust, and the tree drops its leaves when you shake it. Below that, it's a plain document in English, Spanish and Portuguese.

## Running it

You need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io). `corepack enable` picks up the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev          # dev server at http://localhost:3000
```

To build the static site the way it's deployed:

```sh
pnpm build          # writes the site to out/
pnpm wrangler dev   # serves out/ through the Workers runtime at http://localhost:8787
```

## Structure

```
src/
├── worker.ts             runs for "/" only: sends visitors to /en, /es or /pt
└── app/
    ├── [lang]/layout.tsx metadata, hreflang and the pre-paint theme script
    ├── [lang]/page.tsx   the page: case, bezel, screen and controls
    ├── global-not-found.tsx  the 404 page, in all three languages
    ├── content.ts        language-neutral facts: links, projects, stack
    ├── i18n/             the copy in English, Spanish and Portuguese
    ├── globals.css       the palette, pixel primitives and the wind
    ├── pixels.ts         build-time helpers that turn sprites into SVG paths
    └── components/       the scene, the sections and the console parts
```

Other files at the root:

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Guide for anyone (or any coding agent) changing the site: design rules, accessibility checks, content rules. `CLAUDE.md` points to it. |
| `.agents/skills/`, `.claude/skills/` | Design skills for coding agents, pinned in `skills-lock.json`. |
| `wrangler.jsonc` | Cloudflare Workers config: serves `out/` as static assets on kthread.dev, with `404.html` for unknown paths. |
| `public/_headers` | Response headers, such as long-term caching for hashed assets. |
| `next.config.ts` | Static export and the React Compiler. |

## Editing content

Facts that read the same in every language live in `src/app/content.ts`; the copy lives in `src/app/i18n/`, one file per language. Keep it factual: everything on the page should be checkable against the public repos.

For anything visual, read the design and accessibility sections of [`AGENTS.md`](AGENTS.md) first. Every change has to work by day and by night, and with reduced motion.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

## License

[BSD 3-Clause](LICENSE).
