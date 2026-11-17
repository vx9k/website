# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k): a one-page portfolio of vx's work, designed as a 1960s Soviet airline poster with a mainframe console's lamps across it.

It's a static site built with Next.js and Tailwind CSS, exported to plain HTML and served as static assets from Cloudflare Workers. Its GitHub numbers (the contribution calendar, each project's commits and stars, the list of repositories) are refreshed every day by a workflow, the same way vx's profile README is. A small Worker on `/` hands agents that ask for Markdown (`Accept: text/markdown`) the page as Markdown instead of HTML.

The brief and the rules for changing the site are in [`AGENTS.md`](AGENTS.md).

## Running it

You need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io). `corepack enable` picks up the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev            # dev server at http://localhost:3000
```

To build the static site the way it's deployed:

```sh
pnpm build          # writes the site to out/ and hashes its inline scripts into the CSP
pnpm wrangler dev   # serves out/ through the Workers runtime at http://localhost:8787
```

## Structure

```
src/
├── worker.ts             runs for "/" only: Markdown or HTML, by the Accept header
├── app/
│   ├── layout.tsx        <html>, fonts, metadata
│   ├── page.tsx          the page
│   ├── not-found.tsx     the 404 page
│   ├── content.ts        everything the page says: intro, products, skills, contact
│   ├── github.ts         helpers for the GitHub data
│   ├── globals.css       design tokens and styles
│   ├── index.md/         the page as Markdown, for agents
│   ├── robots.txt/       robots.txt, with a Content Signal
│   └── opengraph-image.tsx, sitemap.ts, manifest.ts, icons
├── data/github.json      what the daily workflow last read from GitHub
├── assets/fonts/         the face for the share image
└── components/site/      the frame, the paint, the lamps, the dialogs and the motion switch
public/
├── work/                 product screenshots (AVIF and WebP)
├── _headers              security headers and caching
└── _redirects            old /en, /es and /pt links go to /
```

| Path | What it is |
| --- | --- |
| `AGENTS.md` | The guide for anyone, or any coding agent, changing the site: the brief, content rules, accessibility, security. `CLAUDE.md` points to it. |
| `wrangler.jsonc` | Cloudflare Workers config: serves `out/` as static assets on kthread.dev, runs `src/worker.ts` for `/` only, and turns on the Worker's logs. |
| `scripts/csp.mjs` | Runs after `next build`: hashes every inline script in `out/` into the CSP. |
| `scripts/github.mjs` | Reads vx's repositories, commits, stars, languages, releases and contribution calendar from the GitHub API and writes `src/data/github.json`. `.github/workflows/github-data.yml` runs it daily and commits the file when it changes, which redeploys the site. |

## Agent tooling

Set up for Claude Code:

| Where | What |
| --- | --- |
| `AGENTS.md` | The rules for the site; `CLAUDE.md` points to it. |
| `.claude/skills/website/` | The project's own skill: how to add a product, verify a change, update dependencies and ship. |
| `.claude/skills/unslop/` | [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0: a design-review skill that finds AI-looking UI patterns and fixes them pass by pass. |
| `.mcp.json` | MCP servers: Cloudflare's, and `next-devtools-mcp` for a running dev server. `.claude/settings.json` enables them. |

## Editing content

Everything the page says lives in `src/app/content.ts`. Keep it factual: everything on the page should be checkable against vx's public repos. Product screenshots go in `public/work/` as `<id>-640` and `<id>-<source width>`, each in AVIF and WebP. The site is one screen with no scrolling, so every change has to fit at phone and desktop sizes, down to 375 by 667.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

Analytics come from Cloudflare Web Analytics. To turn them on, add kthread.dev under Web Analytics in the Cloudflare dashboard, copy the site's token, and set it as the `CF_WEB_ANALYTICS_TOKEN` build variable in the Worker's Workers Builds settings; the next build adds the beacon. Without it, the page carries none.

## License

[BSD 3-Clause](LICENSE).
