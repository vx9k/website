# website

Source for [kthread.dev](https://kthread.dev), the personal site of [vx](https://github.com/vx9k).

It's a single static page built with Next.js and Tailwind CSS, exported to plain HTML and hosted on GitHub Pages. The background is a WebGPU shader with WebGL2 and CSS fallbacks. The site keeps working offline, and a Display menu offers high contrast, reduced motion, larger text and a paper mode for e-ink screens.

## Running it

You need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io). `corepack enable` picks up the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev          # dev server at http://localhost:3000
```

To build the static site the way it's deployed:

```sh
pnpm build                          # writes the site to out/
python3 -m http.server -d out 8000  # or any static file server
```

## Structure

```
src/app/
├── page.tsx            the home page, assembled from the sections below
├── layout.tsx          fonts, metadata, and the script that applies display modes before paint
├── content.ts          all the facts on the page: projects, principles, stack, links
├── globals.css         design tokens, display modes, utilities and motion
├── not-found.tsx       the 404 page
├── manifest.ts         web app manifest
├── icon.svg            favicon
├── apple-icon.png      home-screen icon
└── components/
    ├── Header.tsx          sticky header with section nav and the Display menu
    ├── Hero.tsx            headline, facts and calls to action
    ├── Principles.tsx      ┐
    ├── Work.tsx            │ page sections, each wrapped in the shared
    ├── Stack.tsx           │ <Section> frame from SectionHeading.tsx
    ├── Contact.tsx         ┘
    ├── Footer.tsx
    ├── SectionHeading.tsx  <Section>: rule, index column and title layout
    ├── SectionNav.tsx      header links that track the section on screen
    ├── FlagsPanel.tsx      the Display menu
    ├── OfflineBanner.tsx   notice shown when the connection drops
    ├── CanopyField.tsx     background: CSS gradient, upgraded to the GPU shader when allowed
    └── canopy-gpu.ts       WebGPU and WebGL2 renderers, loaded lazily
```

Other files at the root:

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Guide for anyone (or any coding agent) changing the site: design rules, accessibility checks, content rules. `CLAUDE.md` points to it. |
| `.agents/skills/`, `.claude/skills/` | Design skills for coding agents, pinned in `skills-lock.json`. |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages. |
| `next.config.ts` | Static export, React Compiler, offline support. |

## Editing content

Most text lives in `src/app/content.ts`. Change a project, principle or stack entry there and every section that uses it updates. Keep it factual: everything on the page should be checkable against the public repos.

For anything visual, read the design and accessibility sections of [`AGENTS.md`](AGENTS.md) first. Every change has to work in each display mode, including e-ink and high contrast.

## Deploying

Every push to `main` builds the site and publishes `out/` to GitHub Pages. There's no manual step.

## License

[BSD 3-Clause](LICENSE).
