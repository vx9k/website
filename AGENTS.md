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

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`) and looking at it in a browser at desktop and phone widths, in every display mode (see below).

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no Next.js server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. The one exception is `src/worker.ts`, a plain Worker that handles `/`. `experimental.useOffline` powers the offline banner.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme`, `@utility`, `@custom-variant` in `globals.css`). There's no `tailwind.config.*`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- Deployed by Cloudflare Workers Builds, connected to this repo: every push to `main` runs `pnpm run build` then `pnpm wrangler deploy`, and every other branch gets a preview URL posted on its PR. Work on a branch, open a PR, and check the preview.
- The Worker is named `website`; the `name` in `wrangler.jsonc` must match it or builds fail. `kthread.dev` is attached as a Custom Domain in `wrangler.jsonc`; `www.kthread.dev` redirects to it through a Cloudflare Redirect Rule on the zone. DNS for the zone also carries iCloud mail records — leave those alone. Build and deploy commands live in the Cloudflare dashboard, not in the repo; they use `pnpm wrangler …` so the pinned wrangler runs, never `pnpm dlx`/`npx` without a local install. pnpm's version comes from `packageManager` in `package.json`.
- Response headers for static files live in `public/_headers` (copied into `out/`).

## Layout of the code

```
src/worker.ts         runs for "/" only: redirects to /en, /es or /pt
src/app/
  [lang]/layout.tsx   root layout per language: <html lang>, metadata, hreflang
  [lang]/page.tsx     the page: Header, Hero, Principles, Work, Stack, Contact, Footer
  document.ts         fonts, viewport and the pre-paint display-mode script
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, suite tree, tool names)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         design tokens, display modes, utilities, motion
  components/
    SectionHeading.tsx  <Section>: the shared frame every section below the hero uses
    PixelScene.tsx      the hero's pixel-art mountains, generated at build time from a seed
    PixelMark.tsx       the pixel "vx" mark in the header (icon.svg draws the same grid)
    Campfire.tsx        the footer's two-frame pixel campfire
  pixel.ts            build-time pixel helpers: seeded PRNG, sprites, ridges, path merging
    FlagsPanel.tsx      the "Display" menu (contrast, motion, e-ink, text size)
    SectionNav.tsx      header nav with active-section tracking
    LanguageSwitch.tsx  EN / ES / PT links; saves the choice in localStorage["vx-lang"]
```

## Languages

- Every visible string lives in `src/app/i18n/`. `en.ts` defines the shape; `es.ts` and `pt.ts` are typed against it, so a missing key fails the build. Change all three together, and keep them saying the same thing.
- The root `/` is the only dynamic route. `src/worker.ts` (wired up by `main` and `assets.run_worker_first: ["/"]` in `wrangler.jsonc`) sends a 302 to a saved choice (the `vx-lang` cookie), then the best match in `Accept-Language`, then English. Every other path is served from static files without touching the Worker. The 404 page picks its language client-side, using the URL prefix first.
- Client components import `i18n/locales`, never `i18n`, so the dictionaries stay out of the browser bundle. Pass strings down as props.
- Spanish uses tú and Latin American vocabulary; Portuguese uses você. Neither assigns vx a grammatical gender ("Ingeniería de sistemas", not "Ingeniero"). Quotes from English READMEs stay in English.
- Check new copy in all three languages at phone width: Spanish and Portuguese run about 20% longer than English.

## Content rules

- **Only true claims.** Everything in `content.ts` and the dictionaries comes from the public repos on github.com/vx9k. Don't invent projects, stats, clients, dates or testimonials. If something is planned, label it planned.
- Copy goes in the dictionaries in `src/app/i18n/`, never inline in a component. Language-neutral data (links, names, statuses) goes in `content.ts`.
- **Say "systems engineer" once at most** in visible copy (and its translations). It's currently the Role row in the hero.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

The reference is [suckless.org](https://suckless.org), modernised: a plain masthead, a side menu beside a single column of content that reads like a document, modest type and nothing ornamental in the layout itself. The fun lives in pixel art: a mountain range at dusk under the hero (an ember sun, snow, pines, a cabin with a lit window, stars, a passing flock and a rare shooting star), a pixel "vx" mark, a pixel pointer in the side menu and a campfire in the footer. Kept from the previous direction: the red palette, Instrument Sans and Plex Mono, 3px corners and hairlines.

**Tokens** (in `globals.css`, redefined for every display mode):
- Surfaces: `--bg` `#0c0808`, `--surface` `#140e0e` (cards), `--raised`.
- Text: `--ink`, `--muted`, `--faint`. These are solid colours, all AA on `--bg` and `--surface`. Don't use opacity for text.
- **One accent: `--ember`** (`#ef5b45`) for highlights, active states, status and the focus ring. `--blush` is only the primary button fill. `--sun` is reserved for warnings (the offline banner).
- `--radius: 3px` on everything: buttons, chips, cards, menus.

**Do:**
- Type: Instrument Sans at weight 500 for headings, using the scale in `@theme` (`text-display`, `text-title`, `text-subhead`, `text-lede`; tracking and line height are built in). IBM Plex Mono, uppercase and lightly tracked, only for small labels, via `eyebrow` and `chip`.
- Use the `<Section>` frame for every section below the hero: a numbered mono label led by one ember pixel, a title with an optional aside under it, then the content. Everything is left-aligned at every width. Separate sections with space; hairlines go inside lists and cards.
- Use `card` for raised content, `chip` for statuses and short facts (the glyph carries meaning, not just colour), and spec tables (`dl` rows with hairlines) for facts.
- Buttons: `.btn` (dark, hairline) and `.btn-solid` (blush), in sentence case with an arrow.
- Pixel art is inline SVG built from `Pixels` in `pixel.ts`: one viewBox unit per art pixel, `shapeRendering="crispEdges"`, and a rendered size that's a whole multiple of the grid where it's fixed (the header mark is 3px per pixel). Colour it with the `--px-*` tokens or theme tokens, never literal colours. Sprite motion moves in whole pixels with `steps()`.
- Keep pixel art decorative and sparse: one scene, a few small sprites. Text stays in the real fonts; no pixel fonts for copy.

**Don't:**
- Pills, `rounded-full` on anything that isn't a dot, or radii other than `--radius`.
- A second accent colour, gradients on text, or purple/blue "AI" gradients.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, `>_` logos, CLI-flag labels, kernel-panic jokes.
- The earlier Helsing/Palantir motifs: blueprint grid lines, crosshairs, corner ticks, square-cut everything.
- Three equal feature cards in a row.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Display modes and accessibility

Target WCAG 2.2 AA. An inline script in `layout.tsx` runs before paint and sets attributes on `<html>` from saved flags (`localStorage["vx-flags"]`) and system preferences. CSS reads only those attributes:

| Attribute | Trigger | Effect |
| --- | --- | --- |
| `data-contrast="high"` | toggle, `prefers-contrast: more` | pure black/white, opaque surfaces, 2px borders |
| `data-motion="reduced"` | toggle, `prefers-reduced-motion` | no animation; sprites hold their first frame |
| `data-display="eink"` | toggle, `update: slow`, `monochrome` | black on white, **no grey at all**, nothing moves |
| `data-text="large"` | toggle | root font size 125% |

Use the Tailwind variants `eink:` and `hc:` for mode-specific styles. For every visual change:
- Colours come from the CSS tokens in `globals.css` (`--ink`, `--muted`, `--line`, `--ember`, …), and each mode redefines them. New tokens need a value in every mode block, including print and the no-JS `prefers-contrast` fallback.
- Decoration (the pixel scene's sky, sun, stars, far range and snow; glows, tinted fills) must disappear or turn solid in e-ink and high contrast. The scene keeps only its two front ranges there, as a solid silhouette.
- Check it with each mode on. To preview a mode without clicking, set `localStorage["vx-flags"]` to `{"eink":true}` or `{"contrast":true}` and reload.
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` rings, 44px minimum touch targets and `aria-hidden` on purely decorative glyphs.
- Motion uses `transform`/`opacity` only and must be covered by the reduced-motion rules.

## Performance

The page is static and small; keep it that way. No new runtime dependencies without a strong reason. The pixel art is generated at build time and ships as a few SVG paths with no script; its motion is a handful of CSS animations that the reduced-motion rules switch off. Keep any new effects to that standard: no canvas, no runtime rendering.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for state, effects or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
