# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k).

It's a single static page built with Next.js and Tailwind CSS, exported to plain HTML and served from Cloudflare Workers at [kthread.dev](https://kthread.dev). The design is a plain technical document: paper or carbon depending on your system's setting, one signal orange, Geist type, hairline rules and numbered sections that all hang from one vertical. It reads in English, Spanish and Portuguese.

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
    ├── [lang]/layout.tsx metadata, hreflang and the skip link
    ├── [lang]/page.tsx   the page: header, sections and footer
    ├── global-not-found.tsx  the 404 page, in all three languages
    ├── content.ts        language-neutral facts: links, projects, stack
    ├── i18n/             the copy in English, Spanish and Portuguese
    ├── globals.css       the palette, type scale and a few utilities
    └── components/       the intro, the sections and the language links
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

For anything visual, read the design and accessibility sections of [`AGENTS.md`](AGENTS.md) first. Every change has to work in light and dark mode, in all three languages.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

## License

[BSD 3-Clause](LICENSE).
