<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vx — portfolio

The personal site of vx ([github.com/vx9k](https://github.com/vx9k)), live at [kthread.dev](https://kthread.dev). It's a single page with a 404. The site is a portfolio, so the bar is high: every change should look deliberate and read well, and every claim on the page must be true.

## Commands

```sh
pnpm install     # pnpm only; the lockfile is committed
pnpm dev         # local dev server (also rewrites the block above; leave it)
pnpm build       # static export to out/: the check that must pass
pnpm wrangler dev  # serve out/ through the Workers runtime, as in production
pnpm lint        # currently broken: typescript-eslint doesn't support TypeScript 7 yet
```

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`) and looking at it in a browser at desktop and phone widths, in every display mode (see below).

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. `experimental.useOffline` powers the offline banner.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme`, `@utility`, `@custom-variant` in `globals.css`). There's no `tailwind.config.*`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- Deploys on every push to `main` via `.github/workflows/deploy.yml`, which builds and runs `wrangler deploy`. Work on a branch and open a PR.
- Response headers for static files live in `public/_headers` (copied into `out/`).

## Layout of the code

```
src/app/
  layout.tsx          fonts, metadata, pre-paint display-mode script, grid overlay
  page.tsx            the page: Header, Hero, Principles, Work, Stack, Contact, Footer
  content.ts          all factual content (projects, principles, stack, links)
  globals.css         design tokens, display modes, utilities, motion
  not-found.tsx       exported as 404.html
  components/
    SectionHeading.tsx  <Section>: the shared frame every section below the hero uses
    CanopyField.tsx     background: CSS gradient, upgraded to a GPU shader when allowed
    canopy-gpu.ts       WebGPU renderer with a WebGL2 fallback, lazy-loaded
    FlagsPanel.tsx      the "Display" menu (contrast, motion, e-ink, text size)
    SectionNav.tsx      header nav with active-section tracking
```

## Content rules

- **Only true claims.** Everything in `content.ts` comes from the public repos on github.com/vx9k. Don't invent projects, stats, clients, dates or testimonials. If something is planned, label it planned.
- Put copy in `content.ts` when it's data (projects, stack, principles). One-off prose can live in its component.
- **Say "systems engineer" once at most** in visible copy. It's currently the Role row in the hero.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

The reference points are helsing.ai, Palantir and Black Forest Labs: dark, square, gridded and quiet, with glass surfaces over a forest-green GPU background.

**Do:**
- Square corners everywhere. No `rounded-*` at all.
- Use Geist for text: large sizes, weight 500, tight negative tracking (about −0.045em on titles, −0.055em on the hero). Use Geist Mono, uppercase and tracked out, for small labels only, via the `eyebrow` utility.
- Structure with hairlines. Sections use `<Section>`, which gives the full-bleed rule, crosshairs and a 1/4 : 3/4 index/content split that lines up with the background grid. Keep new layouts on that grid.
- Use spec-sheet tables (`dl` rows with hairlines) for facts, and square flags for status, where the glyph carries meaning as well as colour.
- Use **one accent: moss.** `--sun` is reserved for warnings (the offline banner).
- Use the `glass` + `ticks` utilities for the few raised panels, and `glass-dense` for menus over content. Each backdrop blur costs GPU time, so keep them rare.
- Use `.btn` / `.btn-solid` for buttons: square, mono and uppercase, with an arrow that moves on hover.

**Don't:**
- Pills, rounded chips, tag clouds, or pill badges.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, `>_` logos, CLI-flag labels, kernel-panic jokes.
- Soft serifs, gradient text, purple/blue "AI" gradients, or a second accent colour.
- Three equal feature cards in a row.

Design-oriented agent skills live in `.claude/skills/` (for example `redesign-existing-projects` and `industrial-brutalist-ui`). Use them for visual work, but this section wins where they disagree.

## Display modes and accessibility

Target WCAG 2.2 AA. An inline script in `layout.tsx` runs before paint and sets attributes on `<html>` from saved flags (`localStorage["vx-flags"]`) and system preferences. CSS reads only those attributes:

| Attribute | Trigger | Effect |
| --- | --- | --- |
| `data-contrast="high"` | toggle, `prefers-contrast: more` | pure black/white, opaque surfaces, 2px borders |
| `data-motion="reduced"` | toggle, `prefers-reduced-motion` | no animation, no GPU background |
| `data-display="eink"` | toggle, `update: slow`, `monochrome` | black on white, **no grey at all**, nothing moves |
| `data-text="large"` | toggle | root font size 125% |

Use the Tailwind variants `eink:` and `hc:` for mode-specific styles. For every visual change:
- Colours come from the CSS tokens in `globals.css` (`--ink`, `--muted`, `--line`, `--moss`, …), and each mode redefines them. New tokens need a value in every mode block, including print and the no-JS `prefers-contrast` fallback.
- Decoration (grid lines, crosshairs, ticks, grain, glows, tinted fills) must disappear or turn solid in e-ink and high contrast.
- Check it with each mode on. To preview a mode without clicking, set `localStorage["vx-flags"]` to `{"eink":true}` or `{"contrast":true}` and reload.
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` rings, 44px minimum touch targets and `aria-hidden` on purely decorative glyphs.
- Motion uses `transform`/`opacity` only and must be covered by the reduced-motion rules.

## Performance

The page is static and small; keep it that way. No new runtime dependencies without a strong reason. The GPU background only starts when idle, never in reduced-motion, high-contrast, e-ink or Save-Data modes, pauses when the tab is hidden, and falls back to CSS. Keep any new effects to that standard.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for state, effects or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
