# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k): a portfolio of vx's work, in English, Spanish and Portuguese.

It's a static site built with Next.js, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com), exported to plain HTML and served from Cloudflare Workers.

The site is in the middle of an overhaul toward a minimal portfolio centred on the products vx has built. The brief and the rules for it are in [`AGENTS.md`](AGENTS.md).

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
├── worker.ts             runs for "/" only: sends visitors to /en, /es or /pt
├── app/
│   ├── [lang]/           the page and its layout, one static copy per language
│   ├── global-not-found.tsx  the 404 page, in all three languages
│   ├── content.ts        language-neutral facts: links, sections, skills
│   ├── i18n/             the copy in English, Spanish and Portuguese
│   └── globals.css       design tokens and styles
├── components/
│   ├── ui/               shadcn/ui components
│   ├── site/             the page's sections
│   └── quantum/          an optional layer of visual effects
└── quantum/              the effects layer's state
public/                   static files, response headers, and the effects' assets
```

| Path | What it is |
| --- | --- |
| `AGENTS.md` | The guide for anyone, or any coding agent, changing the site: the brief, content rules, accessibility, security. `CLAUDE.md` points to it. |
| `components.json` | shadcn/ui's config, so `pnpm dlx shadcn@latest add <component>` drops new components into `src/components/ui/`. |
| `wrangler.jsonc` | Cloudflare Workers config: serves `out/` as static assets on kthread.dev. |
| `public/_headers` | Response headers: the security headers (CSP, HSTS and the rest) and caching for hashed assets. |
| `scripts/csp.mjs` | Runs after `next build`: hashes every inline script in `out/` into the CSP. |

## Agent tooling

Run these from the repository root. Each one adds files or settings to the repo, so review what it adds, then commit it:

```sh
# Cloudflare's skills (https://github.com/cloudflare/skills)
npx skills add https://github.com/cloudflare/skills --agent claude-code

# Next.js workflow skills (https://nextjs.org/docs/app/guides/ai-agents)
npx skills add vercel/next.js --agent claude-code --skill next-dev-loop next-bundle-optimizer \
  next-cache-components-adoption next-cache-components-optimizer \
  next-partial-prefetching-adoption next-partial-prefetching-optimizer

# Design skills from taste-skill (https://www.tasteskill.dev/docs)
npx skills add https://github.com/Leonxlnx/taste-skill --agent claude-code \
  --skill design-taste-frontend minimalist-ui redesign-existing-projects
```

MCP servers go in `.mcp.json` at the root:

```json
{
  "mcpServers": {
    "cloudflare": { "type": "http", "url": "https://mcp.cloudflare.com/mcp" },
    "next-devtools": { "command": "npx", "args": ["-y", "next-devtools-mcp@latest"] }
  }
}
```

Plugins with hooks install through Claude Code itself:

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail

/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem          # on your own machine
/plugin install claude-mem-cowork   # for cloud sessions (needs a cmem.ai key)
```

## Editing content

Facts that read the same in every language live in `src/app/content.ts`; the copy lives in `src/app/i18n/`, one file per language. Keep it factual: everything on the page should be checkable against vx's public repos. Every change has to work at phone and desktop widths, in all three languages.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

## License

[BSD 3-Clause](LICENSE).
