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

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`) and looking at it in a browser at desktop and phone widths, by day and by night, and with reduced motion on. Click and tap every interactive sprite you touched, and if you changed anything on the screen, press Play and walk over it: the game reads the layout.

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
  globals.css         the palette, themes, console shell, pixel primitives, the scene, motion
  pixel.ts            build-time pixel helpers: seeded PRNG, sprites, ridges, path merging
  components/
    SectionHeading.tsx  <Section>: the shared frame every section below the hero uses
    PixelScene.tsx      the hero's pixel-art mountains, generated at build time from a seed
    SceneControls.tsx   the buttons over the scene: sun/moon swaps the palette, the cabin's light
    Stairs.tsx          brick stairs between sections, ledges for the game
    Campfire.tsx        the campfire at the foot of the screen; tap it to stoke it
    ConsoleControls.tsx the console's lower half: D-pad, A/B, Start (play), Select (palette)
    PixelMark.tsx       the pixel "vx" mark on its badge (icon.svg draws the same grid)
    FlagsPanel.tsx      the "Display" menu (daylight, motion, text size)
    SectionNav.tsx      side menu with a pixel pointer and active-section tracking
    LanguageSwitch.tsx  EN / ES / PT links; saves the choice in localStorage["vx-lang"]
    game/
      engine.ts         the physics: gravity, one-way ledges, bouncing bodies, particles
      Game.tsx          the playable page: character, ball, gems, HUD, touch pad, camera
      Sprite.tsx        the character's frames, the gem and the ball, as pixel rows
      control.ts        start/stop events, so Play buttons don't import the engine
      PlayButton.tsx, PlayCharacter.tsx   the ways to start playing
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

A retro handheld console, minimal inside. The page *is* the console: the header is the top edge of the case, the content sits on a screen set into a dark bezel, and the footer is the lower half with a D-pad, A/B, Start and Select. On the screen, the layout stays as plain as [suckless.org](https://suckless.org): a side menu with a pointer beside a single column that reads like a document. The character comes from pixels everywhere, four colours, dialogue boxes, and a page you can play.

**Palette.** Four colours, [Mist GB](https://lospec.com/palette-list/mist-gb) by Kerrie Lake, and nothing else: no tints, no fifth colour, no gradients except the ones that draw pixel patterns.

| Token | Day (default) | Night (palette swap) |
| --- | --- | --- |
| `--bg` (the screen) | mint `#c4f0c2` | brown `#2d1b00` |
| `--ink` (text) | brown | mint |
| `--soft` (secondary text, labels) | deep `#1e606e` | teal `#5ab9a8` |
| `--line` (rules, frames) | deep | teal |
| `--accent` (fills) / `--on-accent` | teal / brown | deep / mint |
| `--plastic` (the case) / `--on-plastic` | teal / brown | deep / mint |
| `--bezel` / `--on-bezel` | brown / mint | brown / mint |

Contrast decides what each pairing may do. Brown on mint (13.1:1), brown on teal (7.1:1) and deep on mint (5.6:1) carry text; the tokens above are arranged so every `--ink`, `--soft` and `--on-*` pairing is one of them. Deep on teal (3.0:1) is for edges and large text only. Brown on deep (2.3:1) and teal on mint (1.9:1) are decoration only: never text, never the only edge of a control.

**Type.** Pixelify Sans for headings (600) and body (400), using the scale in `@theme`. Silkscreen, uppercase, for small labels via `eyebrow` and `chip`. No negative tracking, and ligatures stay off.

**The console** (in `globals.css`).
- `console`: the one centred column that the case's top edge, the bezel and the controls share, so they line up at every width. Don't put page chrome outside it.
- `notch`: corners cut in two pixel steps, for the bezel and the screen.
- `lcd`: the screen, with a one-pixel edge line drawn on top of its content.
- Things on the case use `--plastic`/`--on-plastic` and `.btn-case`; things on the screen use the screen tokens.

**Pixel primitives.** `--px` is one art pixel of the interface, 3px; frames, rules, underlines and offsets are multiples of it.
- `dialog`: the RPG dialogue box (stepped ink frame, gap, inner line). For grouped content: cards, the lede, the HUD.
- `px-frame`: a stepped outline one pixel wide with empty corner pixels, for small boxes (chips, badges, menus). Set `--frame` to recolour it.
- `.btn`, `.btn-solid`, `.btn-case`: chunky buttons on a lip; pressing drops the button onto it. Sentence case, with an arrow or a pixel icon.
- `rule-t` / `rule-b`: dashed pixel rules for list and spec rows. Sections are separated by space and stairs.
- `link` and menu items invert into an ink block on hover. Pixel cursors are set on `html` and on interactive elements.
- The dot-matrix grid over the scene (hairline gaps between art pixels, from 64rem up) is the one texture on the page.

**Pixel art.** Inline SVG built with `Pixels` in `pixel.ts`, or rows of characters (see `game/Sprite.tsx`): one viewBox unit per art pixel, `shapeRendering="crispEdges"`, and a whole number of screen pixels per art pixel wherever the size is fixed. Colour it with tokens, never literal colours (the badge behind the mark is the one exception, since it is always bezel-coloured). Sprite motion moves in whole pixels with `steps()`; frame swaps and fades are hard cuts or dithers, never smooth.

**Interactive sprites.** Anything that responds to a click also responds to a tap and to the keyboard, because it's a real `<button>`: at least 44px square, an `aria-label` from the dictionaries, a `title` for mouse users, and the ink focus square. Over the scene, buttons are placed in grid units (`--gx`, `--gy`, `--gw`, `--gh`) and `.scene-button` turns them into CSS with container query units, matching the SVG's `slice` scaling. Today: the sun or moon (swaps the palette), the cabin (its light), the campfire (stoke it), the waiting character (play), and Start and Select on the console.

**The game** (`components/game/`). Press Play, tap the character in the scene or press Start, and a character drops onto the page.
- `engine.ts` is a small hand-written engine: gravity, one-way ledges (solid from above, passable from below), bouncing bodies and particles. No physics library.
- The page is the level. Ledges are read from the layout: every line of `main h1, h2, h3`, `.btn`, `.chip`, `.dialog`, `.rule-t` (top), `.rule-b` (bottom), anything with `data-solid`, and the ground under the mountains. They're re-read twice a second, so layout changes are picked up. Add `data-solid` to make something new walkable, and keep vertical gaps climbable with a double jump (about 150px).
- `Stairs` between sections lead down the page, alternating direction.
- Arrow keys or WASD move, Up/Space jumps (twice for a double jump), Down drops through a ledge, X/E/Enter pokes anything with `data-poke` or a `.scene-button` nearby, Esc stops. **Keys belong to the game only while it runs**; otherwise the page scrolls as normal.
- On touch screens a pad (D-pad, A, B) is pinned to the bottom while playing. The camera follows the character; landing bumps the ledge's element; gems are placed over ledges down the screen; there's a ball to kick.
- It must never be required: all content is readable without playing, the HUD's Stop button and Esc always end it, and focus moves to the game's status region on start so Space can't press a button behind it.

**Do:**
- Use the `<Section>` frame for every section below the hero: a Silkscreen label led by one ink pixel, a title with an optional aside, then the content. Everything is left-aligned.
- Use `dialog` boxes for grouped content, `chip` for statuses and short facts (the glyph carries meaning: filled, half and empty squares), and spec tables (`dl` rows with dashed rules) for facts.
- Keep the art sparse and purposeful: one scene, a few sprites, each with a reason to exist.

**Don't:**
- Rounded corners, pills, blur, soft shadows, or opacity used as a colour.
- Colours outside the four, or text on a pairing the contrast table rules out.
- Console trademarks or logos (no real brand names, logos or labels); the console is our own, the "VX·9K".
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking text cursors, `>_` logos, CLI-flag labels, kernel-panic jokes. Retro here means handheld games, not terminals.
- Smooth, eased motion on sprites, or animation that moves layout.
- Taking over keys, scroll or focus outside the game.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. An inline script (`bootScript` in `document.ts`) runs before paint and sets attributes on `<html>` from saved flags (`localStorage["vx-flags"]`) and system preferences. CSS reads only those attributes:

| Attribute | Trigger | Effect |
| --- | --- | --- |
| `data-theme="night"` | the sun/moon, Select, the Display menu, `prefers-color-scheme: dark` | the palette swap: brown screen, mint ink, the moon |
| `data-motion="reduced"` | Display menu, `prefers-reduced-motion` | no animation; sprites hold their first frame |
| `data-text="large"` | Display menu | root font size 125% |
| `data-playing` | set by the game while it runs | the `playing:` variant; smooth scrolling off |

A saved `day` choice wins over the system; with none saved, the page is day unless the system asks for dark. There is no high-contrast, e-ink or print mode; forced colours (Windows contrast themes) get a small rule that hides the art and gives frames a real border.

For every visual change:
- Colours come from the tokens, and both palettes must work. A new token needs a day value in `:root` and, if it differs, a night value in `[data-theme="night"]`. The `night:` Tailwind variant is there for one-offs.
- Check it by day and by night. To preview without clicking, set `localStorage["vx-flags"]` to `{"day":false}` or `{"motion":true}` and reload.
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` squares, 44px minimum touch targets and `aria-hidden` on purely decorative art.
- Motion uses `transform`/`opacity` (and, for dithers, discrete `mask-image` steps) and must be covered by the reduced-motion rules. The game still runs with motion reduced, but without particles, bumps or camera easing.

## Performance

The page is static and small; keep it that way. No new runtime dependencies without a strong reason: the physics engine is a few hundred lines of our own. The pixel art is generated at build time and ships as SVG paths; its motion is CSS that the reduced-motion rules switch off. The game's loop only runs while playing, moves elements with `transform` only, and reads the layout twice a second rather than every frame. Keep any new effect to that standard: no canvas, no animation libraries, nothing running while nobody is playing.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for state, effects or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
