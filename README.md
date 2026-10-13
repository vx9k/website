# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k): a one-page portfolio of vx's work.

It's a static site built with Next.js and Tailwind CSS, exported to plain HTML and served as static assets from Cloudflare Workers. A small Worker on `/` hands agents that ask for Markdown (`Accept: text/markdown`) the page as Markdown instead of HTML.

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
│   ├── globals.css       design tokens and styles
│   ├── index.md/         the page as Markdown, for agents
│   ├── robots.txt/       robots.txt, with a Content Signal
│   └── opengraph-image.tsx, sitemap.ts, manifest.ts, icons
└── components/site/      the shared section frame and the product block
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

## Agent tooling

Set up for Claude Code (and anything else that reads `.claude/skills/`):

| Where | What |
| --- | --- |
| `.claude/skills/`, `skills-lock.json` | Agent skills: [Cloudflare's](https://github.com/cloudflare/skills), the [Next.js workflow skills](https://nextjs.org/docs/app/guides/ai-agents), and [taste-skill](https://www.tasteskill.dev/docs)'s design skills. `npx skills experimental_install` restores them; `npx skills update` refreshes them. |
| `.mcp.json` | MCP servers: Cloudflare's, and `next-devtools-mcp` for a running dev server. |
| `.claude/settings.json` | Enables the MCP servers and declares the plugins: [ponytail](https://github.com/DietrichGebert/ponytail), [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) and [claude-mem](https://github.com/thedotmack/claude-mem)'s cloud variant. |

claude-mem's cloud variant needs `CMEM_API_KEY` and `CMEM_USER_ID` from cmem.ai, set as environment secrets; without them it does nothing. On your own machine, `npx claude-mem install` sets up the full version.

## Editing content

Everything the page says lives in `src/app/content.ts`. Keep it factual: everything on the page should be checkable against vx's public repos. Product screenshots go in `public/work/` as `<id>-640` and `<id>-1280`, each in AVIF and WebP. Every change has to work at phone and desktop widths.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

Analytics come from Cloudflare Web Analytics. To turn them on, add kthread.dev under Web Analytics in the Cloudflare dashboard, copy the site's token, and set it as the `CF_WEB_ANALYTICS_TOKEN` build variable in the Worker's Workers Builds settings; the next build adds the beacon. Without it, the page carries none.

## License

[BSD 3-Clause](LICENSE).
