<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vx — portfolio

The personal site of vx ([github.com/vx9k](https://github.com/vx9k)), live at [kthread.dev](https://kthread.dev). It's a single page with a 404, in three languages: English (US) at `/en`, Spanish (Latin America) at `/es` and Portuguese (Brazil) at `/pt`. The site is a portfolio, so the bar is high: every change should look deliberate and read well, and every claim on the page must be true.

## Commands

```sh
pnpm install     # pnpm only; the lockfile is committed
pnpm dev         # local dev server (also rewrites the block above; leave it)
pnpm build       # static export to out/: the check that must pass
pnpm wrangler dev  # serve out/ through the Workers runtime, as in production
pnpm lint        # currently broken: typescript-eslint doesn't support TypeScript 7 yet
```

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`; restart it after a rebuild) and looking at it in a browser at desktop and phone widths, in light and dark mode, in all three languages.

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no Next.js server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. The one exception is `src/worker.ts`, a plain Worker that handles `/`.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme` and `@utility` in `globals.css`). There's no `tailwind.config.*`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- Deployed by Cloudflare Workers Builds, connected to this repo: every push to `main` runs `pnpm run build` then `pnpm wrangler deploy`, and every other branch gets a preview URL posted on its PR. Work on a branch, open a PR, and check the preview.
- The Worker is named `website`; the `name` in `wrangler.jsonc` must match it or builds fail. `kthread.dev` is attached as a Custom Domain in `wrangler.jsonc`; `www.kthread.dev` redirects to it through a Cloudflare Redirect Rule on the zone. DNS for the zone also carries iCloud mail records — leave those alone. Build and deploy commands live in the Cloudflare dashboard, not in the repo; they use `pnpm wrangler …` so the pinned wrangler runs, never `pnpm dlx`/`npx` without a local install. pnpm's version comes from `packageManager` in `package.json`.
- Response headers for static files live in `public/_headers` (copied into `out/`).

## Layout of the code

```
src/worker.ts         runs for "/" only: redirects to /en, /es or /pt
src/app/
  [lang]/layout.tsx   root layout per language: <html lang>, metadata, hreflang, skip link
  [lang]/page.tsx     the page: header, the sections, footer
  document.ts         fonts and viewport, shared with the 404
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, suite, specs, stack)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         the palette, type scale and five utilities
  components/
    Intro.tsx         the statement, the lede and the facts
    Section.tsx       the numbered frame every section below the intro uses
    Specs.tsx         four label-over-value cells on hairlines: the facts and project specs
    Work.tsx, Principles.tsx, Stack.tsx, Contact.tsx
    LanguageLinks.tsx EN / ES / PT; remembers the choice for "/" and the 404
```

The page is deliberately flat: server components that render static markup, and one client component for the language links. There's no theme script, no toggle and no app state. Keep it that way.

## Languages

- Every visible string lives in `src/app/i18n/`. `en.ts` defines the shape; `es.ts` and `pt.ts` are typed against it, so a missing key fails the build. Change all three together, and keep them saying the same thing.
- The root `/` is the only dynamic route. `src/worker.ts` (wired up by `main` and `assets.run_worker_first: ["/"]` in `wrangler.jsonc`) sends a 302 to a saved choice (the `vx-lang` cookie), then the best match in `Accept-Language`, then English. Every other path is served from static files without touching the Worker. The 404 page picks its language client-side, using the URL prefix first.
- Client components import `i18n/locales`, never `i18n`, so the dictionaries stay out of the browser bundle. Pass strings down as props.
- Spanish uses tú and Latin American vocabulary; Portuguese uses você. Neither assigns vx a grammatical gender ("Ingeniería de sistemas", not "Ingeniero"). Quotes from English READMEs stay in English.
- Check new copy in all three languages at phone width: Spanish and Portuguese run about 20% longer than English.

## Content rules

- **Only true claims.** Everything in `content.ts` and the dictionaries comes from the public repos on github.com/vx9k. Don't invent projects, stats, clients, dates or testimonials. If something is planned, label it planned.
- Copy goes in the dictionaries in `src/app/i18n/`, never inline in a component. Language-neutral data (links, names, statuses, spec values) goes in `content.ts`.
- **Say "systems engineer" once at most** in visible copy (and its translations). It's currently the Role row in the intro.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

A technical document. The references are defence and research companies (Helsing, Palantir, Lockheed Martin) and AI labs (Mistral, Black Forest Labs): plain facts on a strict grid, large type, hairline rules and a lot of space. There's no imagery, no decoration and no motion. The page earns its character from typography and restraint, not effects.

**Palette.** Paper by day, carbon by night, one signal colour. Tokens live on `:root` in `globals.css`; `light-dark()` picks the value from the system's setting.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | paper `#f3f2ee` | carbon `#0c0c0b` | the page |
| `--fg` | `#141413` | `#ecebe6` | text, the button |
| `--muted` | `#5f5e59` | `#9a9993` | secondary text, labels |
| `--line` | `#d7d5ce` | `#2c2b28` | hairline rules only |
| `--signal` | `#f04800` | `#f04800` | marks only |
| `--on-signal` | `#141413` | `#141413` | text on signal |

Contrast decides what each token may do. `--fg` (16:1) and `--muted` (5.8:1 light, 6.9:1 dark) carry text. `--signal` is 3.3:1 on paper, so it's for marks and never for text on `--bg`: the square before "vx", the status squares, the underline on the current language, the focus ring, the text selection and the button's hover. Carbon on signal is 4.9:1, which is why the hover and the selection use `--on-signal`. `--line` is for rules, never the only edge of a control. Add no other colours, tints, gradients, shadows or opacity-as-colour.

**Type.** Geist for everything, Geist Mono for small uppercase labels (the `label` utility). Weights are 400 and 500 only. Large type gets negative tracking (`text-display` is -0.04em; titles use `tracking-tight`), body text none. Headings are sentence case.

**Layout.** One vertical decides the page.
- `shell` is the one centred column (80rem, fluid side padding) that the header, every section and the footer share. Don't put page chrome outside it.
- `split` (with `lg:grid`) divides a block in the shell into two tracks from lg up: 1fr 3fr, then 1fr 2fr from xl. The header, the intro, every section and the footer use it, so the section titles and "vx" sit on the left track and everything else starts on the same vertical, the right track's edge. Only the headline spans both. Below lg, blocks stack.
- Below the intro, every section is a `<Section>`: a hairline across the shell, the number and title on the left (sticky on large screens), the content on the right. Numbers come from the order of `sections` in `content.ts`.
- Inside the right track, a four-column sub-grid (`md:grid-cols-4`, `gap-x-6`) lines things up: `<Specs>` puts four facts across it, and rows (components, principles, stack) put their key in the first column and the value across the other three. Rows are separated by hairlines; the first row of a section drops its rule, since the section's own rule is right above it.
- Everything is left-aligned. Sections are separated by space and a single hairline, never boxes or cards.
- Measure: body text stops at 36rem; the headline at 16ch.

**Components.**
- `btn`: the one button. Solid `--fg`, square corners, at least 44px tall, `--signal` on hover, and a transparent border that shows as a real edge in contrast themes. One per page.
- `link`: a 1px underline in `--muted` that darkens to the text colour on hover.
- `label`: Geist Mono, 12px, uppercase, 0.06em tracking, `--muted`.
- Statuses are a signal square plus the word: filled for shipping, half for in progress, empty for planned. The shape carries the meaning, not the colour, and the squares keep their shape in contrast themes (`forced-color-adjust-none`, with `--signal` set to `CanvasText`).

**Don't:**
- Rounded corners, pills, cards, shadows, blur, gradients (except the half-filled status square) or opacity.
- A second accent colour, colour on large surfaces, or signal used for text on the page background.
- Imagery, illustration, icons beyond the ↗ ↑ ← arrows, or decorative motion. Hover changes colour and nothing else.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, ASCII brackets, crosshairs, HUD or telemetry cosplay. "Technical" here means a spec sheet, not a screen.
- Copy that performs: taglines, slogans, claims about impact. State what the thing is and what it does.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. There's no theme toggle: `color-scheme: light dark` and `light-dark()` in `globals.css` follow the system, and `viewport.themeColor` in `document.ts` matches the browser chrome to it. A new colour needs both a light and a dark value in the same `light-dark()`.

For every visual change:
- Check it in light and dark mode (emulate `prefers-color-scheme` in the browser's dev tools).
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` outlines (2px signal, 3.3:1 or better), 44px minimum touch targets (`min-h-11` on text links too) and `aria-hidden` on purely decorative marks.
- Keep the page still. The only motion is smooth scrolling to anchors, and `prefers-reduced-motion` turns it off.
- In forced colours (Windows contrast themes) the system replaces every colour: hairlines and text follow it, `--signal` becomes `CanvasText`, the button keeps an edge through its transparent border, and the status squares opt out of the override so their shape survives. Check any new element there too.

## Performance

The page is static and small; keep it that way. No runtime dependencies beyond Next and React, and the only client code is the language links and the 404's language picker. Two variable fonts, self-hosted by `next/font`, and no images on the page. Keep any new idea to that standard: no canvas, no animation libraries, nothing running in JavaScript on a timer.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for event handlers or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
