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
- **Tailwind CSS v4.** Configured in CSS (`@theme` and `@utility` in `globals.css`). There's no `tailwind.config.*`. `source("..")` on the import limits class scanning to `src/`, so the agent skill docs at the root don't leak utilities into the inlined stylesheet.
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
  content.ts          language-neutral data (links, section ids, the skills and their colours)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         the palette, the glow, type scale, seven utilities and the skill icons
  marks.ts            brand marks for the skills, as SVG paths from Simple Icons (CC0)
  manifest.ts, icon.svg, apple-icon.png  the signal square on carbon; the PNG is a
                      180px render of the same square on whole pixels (62–118)
  components/
    Intro.tsx         the introduction, the quote and the facts
    Section.tsx       the numbered frame every section below the intro uses
    Skills.tsx        the skills pane: a row per group, an icon tile per skill
    SkillIcon.tsx     the icons: brand marks, and the glyphs drawn for the rest
    Principles.tsx, Contact.tsx
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

- **Only true claims.** The skills are vx's own list; everything else in `content.ts` and the dictionaries comes from vx's GitHub profile and the public repos on github.com/vx9k. Don't add skills vx hasn't named, and don't invent projects, stats, clients, dates or testimonials. The page doesn't list projects: GitHub does.
- Copy goes in the dictionaries in `src/app/i18n/`, never inline in a component. Language-neutral data (links, product names, colours) goes in `content.ts`.
- **Say "software engineer" once at most** in visible copy (and its translations). It's currently the Role row in the intro, so the introduction above it says who vx is and what vx writes instead.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

A technical document on glass: plain facts on a strict grid, large type, hairline rules and a lot of space, with the content on translucent panes lit by a soft glow. There's no imagery, and the only motion is in the skill icons. The page earns its character from typography, light and restraint, not effects.

**Palette.** Paper by day, carbon by night, one signal colour. Tokens live on `:root` in `globals.css`; `light-dark()` picks the value from the system's setting.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | paper `#f3f2ee` | carbon `#0c0c0b` | the page |
| `--fg` | `#141413` | `#ecebe6` | text, the button, the current language |
| `--muted` | `#52514b` | `#a09f99` | secondary text, labels |
| `--line` | ink at 12% | white at 9% | hairline rules only |
| `--signal` | `#f04800` | `#f04800` | marks only |
| `--on-signal` | `#141413` | `#141413` | text on signal |
| `--glass-top`, `--glass-bottom`, `--glass-edge`, `--glass-ring`, `--glass-shine`, `--glass-shade` | white fill and rim, faint ink ring | faint white fill and rim, dark ring | the `glass` utility only |
| `--glow`, `--glow-2` | signal and amber, faint | signal and amber, fainter | the ambient light only |

Contrast decides what each token may do. `--fg` (16:1) and `--muted` (7.1:1 light, 7.4:1 dark on the bare page) carry text. Muted is set darker than it needs to be on paper because the glow and the glass eat into it: measured over the rendered glow at every width and scroll position, including the strips just above and below the floating header, it stays above 4.5:1. If you touch the glow, the glass or muted, measure it again the same way. `--signal` is 3.3:1 on paper, so it's for marks and never for text on `--bg`: the square before "vx", the bar beside the quote and the square before the status in the intro, the mark on the 404, the drawn skill glyphs, the focus ring, the text selection and the button's hover. Carbon on signal is 4.9:1, which is why the hover and the selection use `--on-signal`. `--line` is for rules, never the only edge of a control. Translucency lives only in the glass and glow tokens and the skill tiles; don't add tints, opacity modifiers or new gradients elsewhere (the glint on the skill tiles is the one other gradient).

**Brand colours.** The skills are the one place with more colour: each brand mark keeps its brand's colour, on a tile tinted with it (`--c` at 12%, its edge at 30%). Where the original colour vanishes on paper or on carbon, `content.ts` gives a `light-dark()` pair instead. The glyphs drawn for skills without a brand use signal. Nothing else on the page takes a brand colour, and the names beside the icons stay `--fg`.

**Light and glass.**
- The glow is three radial gradients on the `html` element's own background: signal at the top right, amber by the skills, signal again at the end, all on the right where the panes are. Text that sits on the bare page (the headline, the lede, the quote, section titles) is on the left, clear of the strongest light. Keep the glows faint: muted text must hold 4.5:1 on whatever they put behind it, at every width.
- It isn't a fixed layer on purpose. Safari 26 on iOS draws the page under its translucent status bar and toolbar but clips `position: fixed` layers to the area between them, even with negative offsets or `viewport-fit=cover`, which left hard bands at both ends of the screen. The root background is painted across the whole canvas, bars included; its image starts 20rem above the page and ends 20rem below it so the light carries into the overscroll. Don't bring back a full-screen fixed layer, and don't hide things by parking them just off screen (the skip link uses `not-focus:sr-only` for this reason): Safari shows what's above the layout viewport.
- `glass` is a pane: a translucent fill that's brighter at the top, a light rim inside a faint outer ring, a 1px highlight along the top and a soft shade under it, with 6px corners. The rim is what makes it read as glass on paper rather than a card. Panes are for things that hold content: the header bar, the hero facts, the skills, the principles and the 404. Contact and the footer sit on the page. Don't nest panes; inside one, structure is hairlines.
- `frost` adds the backdrop blur, and only the header needs it, because it's the one pane text scrolls under. It tints with the page colour at 80% instead of white, so the small labels on it hold 4.5:1 over the glow and over the headline scrolling beneath, even where the blur isn't drawn. The panels sit over nothing but the smooth glow, where a blur would cost a repaint every scroll and change nothing.
- With `prefers-reduced-transparency`, glass turns solid (`--bg`) and loses its blur. In forced colours the glow is hidden and panes keep their edge.

**Corners.** Square with a little rounding, never pills: 6px for panes (`glass`), 4px for controls and tiles (`btn`, the language segments, the skip link, the skill tiles: `rounded-sm`), 1–2px for the small signal marks. No `rounded-full`, and nothing rounder than 6px.

**Type.** Geist for everything, Geist Mono for small uppercase labels (the `label` utility), the language switch and the repo URLs. Weights are 400 and 500 only. Large type gets negative tracking (`text-display` is -0.04em; titles use `tracking-tight`), body text none. Headings are sentence case.

**Layout.** One vertical decides the page.
- `shell` is the one centred column (80rem, fluid side padding) that the header, every section and the footer share. Don't put page chrome outside it. The header bar bleeds past it by its own padding less its border (`-mx-3 px-[calc(0.75rem-1px)]`), so its contents stay on its edges.
- `split` (with `lg:grid`) divides a block in the shell into two tracks from lg up: 1fr 3fr, then 1fr 2fr from xl. The header, the intro, every section and the footer use it, so the section titles and "vx" sit on the left track and everything else starts on the same vertical, the right track's edge. Only the headline spans both. Below lg, blocks stack.
- Below the intro, every section is a `<Section>`: the number and title on the left (sticky on large screens, below the header), the content on the right. Numbers come from the order of `sections` in `content.ts`.
- Inside a pane, a four-column sub-grid (`md:grid-cols-4`, `gap-x-6`) lines things up: rows (the skill groups, the principles) put their key in the first column and the value across the other three, separated by hairlines. The facts are a table of label-over-value cells, stacked on phones and three across from sm: role, source, and the status (open to work, from vx's GitHub profile). A `split` block that also sets a gap needs `lg:gap-x-12` back, or it drifts off the vertical.
- Everything is left-aligned. Measure: body text stops at 36rem; the headline at 16ch.

**Components.**
- `btn`: the one button. Solid `--fg`, 4px corners, at least 44px tall, `--signal` on hover, and a transparent border that shows as a real edge in contrast themes. One per page.
- `link`: a 1px underline in `--muted` that darkens to the text colour on hover.
- `label`: Geist Mono, 12px, uppercase, 0.06em tracking, `--muted`.
- The language switch is a segmented control: three 44px targets, with the current one marked by a small `--fg` block inside its target, and underlined in contrast themes, where the fill disappears.
- Skill icons: a 40px tile (`icon-tile`) tinted with the skill's colour, the icon 22px inside it, `aria-hidden` with the name as text beside it. Brand marks come from `marks.ts`, 24×24 paths from Simple Icons (CC0); the marks belong to their owners and only name the technology. Skills without a brand get a glyph drawn in `SkillIcon.tsx` on the same 24px grid, 1.5px strokes, with one small part that moves.
- Skill motion is CSS only, on `transform` and `opacity`: a glint that runs across the tiles once every 12s and leaves the pane still in between, a small lift when a row is hovered (not a bounce: the skills aren't links), and the glyphs' own loops (layers that pulse, a core that pulses, a packet that falls, a spark that turns). It stays small and slow, and `prefers-reduced-motion` stops all of it.

**Don't:**
- Pills, rounding above 6px, heavy or coloured shadows, glass inside glass, or blur anywhere but the header.
- A second accent colour outside the skill icons, colour on large surfaces beyond the faint glow, or signal used for text on the page.
- Imagery, illustration, icons beyond the skill icons and the ↗ ↑ ← arrows, or motion anywhere but the skill icons. Elsewhere, hover changes colour and nothing else.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, ASCII brackets, crosshairs, HUD or telemetry cosplay. "Technical" here means a spec sheet, not a screen.
- Copy that performs: taglines, slogans, claims about impact. State what the thing is and what it does.

Design-oriented agent skills live in `.claude/skills/`. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. There's no theme toggle: `color-scheme: light dark` and `light-dark()` in `globals.css` follow the system, and `viewport.themeColor` in `document.ts` matches the browser chrome to it. A new colour needs both a light and a dark value in the same `light-dark()`, unless it works on both backgrounds as `--signal` does.

For every visual change:
- Check it in light and dark mode (emulate `prefers-color-scheme` in the browser's dev tools).
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible `:focus-visible` outlines (2px signal, 3.3:1 or better), 44px minimum touch targets (`min-h-11` on text links too) and `aria-hidden` on purely decorative marks.
- Keep motion to the skill icons and smooth scrolling to anchors, and make sure `prefers-reduced-motion` turns all of it off.
- In forced colours (Windows contrast themes) the system replaces every colour: the glow is hidden, hairlines, pane edges and text follow the system, `--signal` becomes `CanvasText`, and the button keeps an edge through its transparent border. The skill icons draw in the text colour, and the ink behind the JavaScript and TypeScript letters turns to `Canvas` so the letters survive. Check any new element there too.
- With `prefers-reduced-transparency`, check that panes are solid and the header is opaque.

## Performance

The page is static and small; keep it that way. No runtime dependencies beyond Next and React, and the only client code is the language links and the 404's language picker. Two variable fonts, self-hosted by `next/font`, and no image files on the page: the icons are inline SVG paths. The glow is three CSS gradients on the page background, the skill animations run on `transform` and `opacity`, and only the header pays for a backdrop blur. Keep any new idea to that standard: no canvas, no animation libraries, nothing running in JavaScript on a timer.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for event handlers or browser APIs.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
