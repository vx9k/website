# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k).

It's a single static page built with Next.js and Tailwind CSS, exported to plain HTML and served from Cloudflare Workers at [kthread.dev](https://kthread.dev). Everything is pixel art in the four-colour Dustbyte palette: the mountains under the headline are generated at build time as a single SVG, and the sun, the cabin and the campfire respond to a click or a tap. The site keeps working offline, and a Display menu offers daylight, reduced motion and larger text.

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
src/app/
├── page.tsx            the home page, assembled from the sections below
├── layout.tsx          metadata and the script that applies the theme and flags before paint
├── content.ts          all the facts on the page: projects, principles, stack, links
├── globals.css         the palette, themes, pixel primitives and motion
├── not-found.tsx       the 404 page
├── manifest.ts         web app manifest
├── icon.svg            favicon
├── apple-icon.png      home-screen icon
└── components/
    ├── Header.tsx          masthead with the language switch and the Display menu
    ├── Hero.tsx            headline, facts and calls to action
    ├── Principles.tsx      ┐
    ├── Work.tsx            │ page sections, each wrapped in the shared
    ├── Stack.tsx           │ <Section> frame from SectionHeading.tsx
    ├── Contact.tsx         ┘
    ├── Footer.tsx
    ├── SectionHeading.tsx  <Section>: rule, index column and title layout
    ├── SectionNav.tsx      side menu that tracks the section on screen
    ├── FlagsPanel.tsx      the Display menu
    ├── OfflineBanner.tsx   notice shown when the connection drops
    ├── PixelScene.tsx      pixel-art mountains, generated at build time from a seed
    ├── SceneControls.tsx   buttons over the sun/moon (day and night) and the cabin (its light)
    ├── PixelMark.tsx       the pixel "vx" mark
    └── Campfire.tsx        the footer's pixel campfire; tap it to stoke it
```

Other files at the root:

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Guide for anyone (or any coding agent) changing the site: design rules, accessibility checks, content rules. `CLAUDE.md` points to it. |
| `.agents/skills/`, `.claude/skills/` | Design skills for coding agents, pinned in `skills-lock.json`. |
| `wrangler.jsonc` | Cloudflare Workers config: serves `out/` as static assets on kthread.dev, with `404.html` for unknown paths. |
| `public/_headers` | Response headers, such as long-term caching for hashed assets. |
| `next.config.ts` | Static export, React Compiler, offline support. |

## Editing content

Most text lives in `src/app/content.ts`. Change a project, principle or stack entry there and every section that uses it updates. Keep it factual: everything on the page should be checkable against the public repos.

For anything visual, read the design and accessibility sections of [`AGENTS.md`](AGENTS.md) first. Every change has to work by night and by day, and with reduced motion.

## Deploying

Cloudflare Workers Builds is connected to this repo. Every push to `main` builds the site and deploys it with `wrangler deploy`. Pull requests get their own preview URL, posted as a comment on the PR.

## License

[BSD 3-Clause](LICENSE).
