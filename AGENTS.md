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

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`; restart it after a rebuild) and looking at it in a browser at desktop and phone widths, by day and by night, and with reduced motion on. Click and tap every pixel button you touched.

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no Next.js server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. The one exception is `src/worker.ts`, a plain Worker that handles `/`.
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
  [lang]/page.tsx     the page: case top edge, bezel and screen, controls
  document.ts         fonts, viewport and the pre-paint theme script
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, suite, specs, stack)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         the palette, the console, pixel primitives, the wind
  pixels.ts           build-time pixel helpers: seeded PRNG, sprites, paths, blobs
  components/
    Scene.tsx         the landscape: hills, pines, the big tree, windsock, sky
    PixelButton.tsx   the one client button: theme, gust or shake
    Screen.tsx        the screen set into the bezel, with its edge line
    Intro.tsx         the dialogue box, lede, facts and section menu
    Section.tsx       the frame every section below the intro uses
    Work.tsx, Principles.tsx, Stack.tsx, Contact.tsx
    Controls.tsx      the lower half: D-pad (drawing), A (gust), B (palette)
    Mark.tsx          the pixel "vx" badge (icon.svg draws the same grid)
    LanguageLinks.tsx EN / ES / PT; remembers the choice for "/" and the 404
```

The page is deliberately flat: server components that render static markup, one short client button, and one boot script. There is no game, no settings menu and no app state. Keep it that way; a new idea should fit in CSS and a data attribute before it earns a component with state.

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

A retro handheld console, minimal inside. The page *is* the console: the header is the top edge of the case, the content sits on a screen set into a dark bezel, and the footer is the lower half with a D-pad and A/B. On the screen, one left-aligned column that reads like a document, as plain as [suckless.org](https://suckless.org). The character comes from pixels, four colours, a dialogue box and a small landscape with wind in it.

**Palette.** Four colours, [Mist GB](https://lospec.com/palette-list/mist-gb) by Kerrie Lake, and nothing else: no tints, no fifth colour, no gradients except the ones that draw pixel patterns.

| Token | Day (default) | Night (palette swap) |
| --- | --- | --- |
| `--bg` (the screen) | mint `#c4f0c2` | brown `#2d1b00` |
| `--ink` (text) | brown | mint |
| `--soft` (secondary text, labels) | deep `#1e606e` | teal `#5ab9a8` |
| `--line` (rules, frames) | deep | teal |
| `--accent` (fills) | teal | deep |
| `--plastic` (the case) / `--on-plastic` | teal / brown | deep / mint |
| `--bezel` / `--on-bezel` | brown / mint | brown / mint |
| `--sky`, `--far`, `--near`, `--fore`, `--sun` (the scene) | mint, teal, deep, brown, teal | brown, deep, teal, mint, mint |

Contrast decides what each pairing may do. Brown on mint (13.1:1), brown on teal (7.1:1) and deep on mint (5.6:1) carry text; the tokens above are arranged so every `--ink`, `--soft` and `--on-*` pairing is one of them. Deep on teal (3.0:1) is for edges and large text only. Brown on deep (2.3:1) and teal on mint (1.9:1) are decoration only: never text, never the only edge of a control.

**Type.** Pixelify Sans for headings (600) and body (400). Silkscreen, uppercase, for small labels via `eyebrow` and `chip`. No negative tracking, and ligatures stay off.

**The console** (in `globals.css`).
- `console`: the one centred column that the case's top edge, the bezel and the controls share, so they line up at every width. Don't put page chrome outside it.
- `notch`: corners cut in two pixel steps, for the bezel and the screen. `Screen` nests two of them to draw the screen's edge line.
- `art` / `art-inset`: the scene's width is the widest multiple of 160px that fits, so every art pixel is a whole number of screen pixels; `art-inset` pads the text column to the same left edge.

**Pixel primitives.** `--px` is one art pixel of the interface, 3px; frames, rules and offsets are multiples of it.
- `dialog`: the RPG dialogue box (stepped ink frame, gap, inner line). For grouped content: the intro and the project cards.
- `frame`: a stepped outline one pixel wide with empty corner pixels. Set `--frame` to recolour it. `chip` is a small label inside one.
- `btn`: a chunky ink button on a lip; pressing drops it onto the lip. `link`: a pixel underline that inverts into an ink block on hover.
- `rule`: a dashed pixel rule along the top of a row, for spec tables and lists. Sections are separated by space.

**Pixel art.** Inline SVG built at build time with the helpers in `pixels.ts` (sprites as rows of characters, blobs, skylines): one viewBox unit per art pixel, `shapeRendering="crispEdges"`, and a whole number of screen pixels per art pixel wherever the size is fixed. Colour it with tokens (the `fill-*` utilities), never literal colours; the vx badge is the one exception. Motion moves in whole pixels with `steps()`; frame swaps are hard cuts, never smooth.

**The wind** (bottom of `globals.css`). One clock (`--cycle`) drives the whole scene. Anything that sways sits in `<Sway x={…}>` and is delayed by its x at `--speed` per art pixel, so each gust crosses from left to right: the streaks in the sky arrive, the pine tops and the tree's crown lean a pixel, the grass bends, the windsock fills and two leaves blow off. To add something to the wind, wrap it in `Sway` with its x; don't add a second clock.

**Pixel buttons.** A real `<button>` (`PixelButton`) over the sprite, at least 44px square, with an `aria-label` from the dictionaries and a matching `title`. Over the scene they're placed in art-pixel units (`--cx`, `--cy`, `--w`, `--h`) by `.scene-button`, and hovering shows menu-cursor brackets. Each one only sets an attribute on `<html>`, and CSS does the rest:

| Button | Does | Attribute |
| --- | --- | --- |
| Sun or moon, B | swaps the palette (saved as `localStorage["vx-theme"]`) | `data-theme="night"` |
| Windsock, A | a three-second gust: everything flutters, fast streaks, sock full | `data-gust` |
| The big tree | the crown rattles and five leaves fall and stay on the ground | `data-shaken` |

**Do:**
- Use `<Section>` for every section below the intro: a title led by one ink pixel, an optional aside, then the content. Everything is left-aligned.
- Use `dialog` boxes for grouped content, `chip` for statuses (the glyph carries meaning: filled, half and empty squares), and spec tables (`dl` rows with `rule`) for facts.
- Keep the art sparse and purposeful: one scene, a few sprites, each with a reason to exist.

**Don't:**
- Rounded corners, pills, blur, soft shadows, or opacity used as a colour.
- Colours outside the four, or text on a pairing the contrast table rules out.
- Console trademarks or logos (no real brand names, logos or labels); the console is our own, the "VX·9K".
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking text cursors, `>_` logos, CLI-flag labels, kernel-panic jokes. Retro here means handheld games, not terminals.
- Smooth, eased motion on sprites, or animation that moves layout.
- Game mechanics, app state or settings panels. The page is a document with a few toys on it.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. An inline script (`bootScript` in `document.ts`) runs before paint and sets `data-theme` on `<html>`: a saved choice wins, and without one the page follows `prefers-color-scheme`. The CSS reads only that attribute for the palette. Reduced motion is read straight from `prefers-reduced-motion` in CSS: nothing animates, and the buttons still show their result as a still (a sent gust holds the trees leaning and the sock full; shaken leaves are already on the ground). Forced colours (Windows contrast themes) hide the art and give boxes a real border.

For every visual change:
- Colours come from the tokens, and both palettes must work. A new token needs a day value in `:root` and, if it differs, a night value in `[data-theme="night"]`. The `night:` Tailwind variant is there for one-offs.
- Check it by day and by night. To preview night without clicking, set `localStorage["vx-theme"]` to `"night"` and reload.
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` squares, 44px minimum touch targets and `aria-hidden` on purely decorative art.
- Motion uses `transform` and `visibility` and must be covered by the reduced-motion rules.

## Performance

The page is static and small; keep it that way. No runtime dependencies beyond Next and React. The pixel art is generated at build time and ships as SVG paths; its motion is CSS; the only script is the boot script and the button handlers. Keep any new effect to that standard: no canvas, no animation libraries, nothing running in JavaScript on a timer.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for event handlers or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
