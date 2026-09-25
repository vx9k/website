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

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`) and looking at it in a browser at desktop and phone widths, by night and by day, and with reduced motion on. Click and tap every interactive sprite you touched.

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
  document.ts         fonts, viewport, theme colours and the pre-paint theme and flags script
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, suite tree, tool names)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         the palette, themes, pixel primitives, the scene's styles, motion
  pixel.ts            build-time pixel helpers: seeded PRNG, sprites, ridges, path merging
  components/
    SectionHeading.tsx  <Section>: the shared frame every section below the hero uses
    PixelScene.tsx      the hero's pixel-art mountains, generated at build time from a seed
    SceneControls.tsx   the buttons over the scene: sun/moon swaps day and night, the cabin's light
    Campfire.tsx        the footer's campfire; tap it to stoke it
    PixelMark.tsx       the pixel "vx" mark in the header (icon.svg draws the same grid)
    FlagsPanel.tsx      the "Display" menu (daylight, motion, text size)
    SectionNav.tsx      side menu with active-section tracking
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

Pixel art, retro, and minimal. The layout follows [suckless.org](https://suckless.org): a plain masthead, a side menu beside a single column of content that reads like a document, and nothing in the layout that's only there for show. The character comes from everything being drawn in pixels, in four colours: a pixel-art mountain range under the hero, pixel type, stepped frames, chunky buttons that press down, and small sprites you can play with.

**Palette.** Four colours, [Dustbyte](https://lospec.com/palette-list/dustbyte) by polyphrog, and nothing else: no tints, no opacity for colour, no gradients, no fifth colour.

| Token | Colour | Night | Day |
| --- | --- | --- | --- |
| `--plum` | `#372a39` | `--bg` | `--ink` |
| `--cream` | `#f5e9bf` | `--ink` | `--bg` |
| `--sage` | `#788374` | `--line` | `--line` |
| `--rust` | `#aa644d` | `--accent` | `--accent` |

Contrast decides what each colour may do. Only plum and cream pass AA for text against each other (11.1:1), so **all text is `--ink` on `--bg`**, at every size. Sage (3.4:1 on plum, 3.3:1 on cream) draws lines, frames and control edges, and may colour purely decorative glyphs. Rust (3.7:1 on cream, 3.0:1 on plum) is fills, marks, the button lip and the hero's highlight block; text on rust is cream and display-sized only. Hierarchy comes from size, weight and typeface, never from a paler text colour.

**Type.** Pixelify Sans for everything, headings at 600 and body at 400, using the scale in `@theme` (`text-display`, `text-title`, `text-subhead`, `text-lede`). Silkscreen, uppercase, only for small labels via `eyebrow` and `chip`. No negative tracking on pixel faces, and ligatures stay off.

**Pixel primitives** (in `globals.css`). `--px` is one art pixel of the interface, 3px; frames, rules, underlines and offsets are multiples of it.
- `px-frame`: a stepped outline one art pixel wide, with the corner pixels left empty. It's how boxes are drawn: cards, chips, menus, the banner. It sits outside the element, so give framed things room (`m-[var(--px)]`). Set `--frame` to recolour it.
- `.btn` and `.btn-solid`: a stepped frame on a rust or sage lip; pressing (click or tap) drops the button onto its lip. Sentence case, with an arrow.
- `rule-t` / `rule-b`: dashed pixel rules, two art pixels on and two off. They separate list rows and spec rows; sections are separated by space.
- `link`: a rust underline one art pixel thick. Hover on any text link or menu item inverts it into an ink block.
- `px-switch`: the square-knobbed switch in the Display menu.
- Pixel cursors (arrow and hand) are set on `html` and on interactive elements.

**Pixel art.** Inline SVG built with `Pixels` in `pixel.ts`: one viewBox unit per art pixel, `shapeRendering="crispEdges"`, and a whole number of screen pixels per art pixel wherever the size is fixed (the header mark and the campfire are 3px per pixel). Colour it with the palette tokens or `--px-*`, never literal colours. Sprite motion moves in whole pixels with `steps()`, and frame swaps are hard cuts.

**Interactive sprites.** Anything in the art that responds to a click also responds to a tap and to the keyboard, because it's a real `<button>`: at least 44px square, with an `aria-label` from the dictionaries, a `title` for mouse users, and the ink focus square. Over the scene, buttons are positioned in grid units (`--gx`, `--gy`, `--gw`, `--gh`) and `.scene-button` turns those into CSS with container query units, matching the SVG's `slice` scaling. What exists today:
- the sun or moon: sinks behind the ridge and brings up the other, swapping day and night (saved like the Display menu's switch)
- the cabin: switches its window light, and the chimney smoke with it
- the campfire: stoking it speeds the flicker and throws sparks

Interactions are small, reversible and optional: nothing on the page depends on finding them, and the hint under the scene says they exist. Every one needs a visible result with motion off.

**Do:**
- Use the `<Section>` frame for every section below the hero: a Silkscreen label led by one rust pixel, a title with an optional aside under it, then the content. Everything is left-aligned at every width.
- Use `px-frame` boxes for grouped content, `chip` for statuses and short facts (the glyph carries meaning, not just colour: filled, half and empty squares), and spec tables (`dl` rows with dashed rules) for facts.
- Keep the art sparse: one scene, a few sprites, each with a reason to be there.

**Don't:**
- Rounded corners of any kind, pills, blur, soft shadows, gradients (other than the ones that draw pixel rules), or opacity used as a colour.
- Colours outside the four, or grey text.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking text cursors, `>_` logos, CLI-flag labels, kernel-panic jokes. Retro here means pixel art and games, not terminals.
- Smooth, eased motion on sprites, or animation that moves layout.
- Three equal feature cards in a row.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. An inline script (`bootScript` in `document.ts`) runs before paint and sets attributes on `<html>` from saved flags (`localStorage["vx-flags"]`) and system preferences. CSS reads only those attributes:

| Attribute | Trigger | Effect |
| --- | --- | --- |
| `data-theme="day"` | the sun/moon, the Display menu, `prefers-color-scheme: light` | cream paper, plum ink, the sun instead of the moon |
| `data-motion="reduced"` | Display menu, `prefers-reduced-motion` | no animation; sprites hold their first frame |
| `data-text="large"` | Display menu | root font size 125% |

A saved `day` choice wins over the system; with none saved, the theme follows the system. There is no high-contrast, e-ink or print mode. The one concession to forced colours (Windows contrast themes) is a small rule in `globals.css` that hides the scene and gives frames a real border.

For every visual change:
- Colours come from the tokens, and both themes must work. A new token needs a night value in `:root` and, if it differs, a day value in `[data-theme="day"]`. The `day:` Tailwind variant is there for one-offs.
- Check it by night and by day. To preview without clicking, set `localStorage["vx-flags"]` to `{"day":true}` or `{"motion":true}` and reload.
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` squares, 44px minimum touch targets and `aria-hidden` on purely decorative art.
- Motion uses `transform`/`opacity` only and must be covered by the reduced-motion rules.

## Performance

The page is static and small; keep it that way. No new runtime dependencies without a strong reason. The pixel art is generated at build time and ships as a few SVG paths; its motion is a handful of CSS animations that the reduced-motion rules switch off. The only script it needs is the small client component for the buttons over the scene and the campfire. Keep any new effects to that standard: no canvas, no runtime rendering, no animation libraries.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for state, effects or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
