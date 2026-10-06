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
pnpm build       # static export to out/, then the CSP's script hashes: the check that must pass
pnpm wrangler dev  # serve out/ through the Workers runtime, as in production
pnpm lint        # currently broken: typescript-eslint doesn't support TypeScript 7 yet
```

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`; restart it after a rebuild) and looking at it in a browser at desktop and phone widths, in all three languages.

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no Next.js server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. The one exception is `src/worker.ts`, a plain Worker that handles `/`.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme` and `@utility` in `globals.css`). There's no `tailwind.config.*`. `source("..")` on the import limits class scanning to `src/`, so the agent skill docs at the root don't leak utilities into the inlined stylesheet.
- **shadcn/ui**, new-york style on Radix (`components.json`), with lucide icons. Its components live in `src/components/ui/` as source you own; its skill is in `.claude/skills/shadcn` (installed with `pnpm dlx skills add shadcn-ui/ui --skill shadcn`, pinned in `skills-lock.json`). Add components with `pnpm dlx shadcn@latest add <name>`; the CLI needs `ui.shadcn.com`, so a session whose network blocks it has to copy the component from `apps/v4/registry/new-york-v4/ui/` in github.com/shadcn-ui/ui instead, rewriting `from "cn"` to `from "@/lib/utils"`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- Deployed by Cloudflare Workers Builds, connected to this repo: every push to `main` runs `pnpm run build` then `pnpm wrangler deploy`, and every other branch gets a preview URL posted on its PR. Work on a branch, open a PR, and check the preview.
- The Worker is named `website`; the `name` in `wrangler.jsonc` must match it or builds fail. `kthread.dev` is attached as a Custom Domain in `wrangler.jsonc`; `www.kthread.dev` redirects to it through a Cloudflare Redirect Rule on the zone. DNS for the zone also carries iCloud mail records — leave those alone. Build and deploy commands live in the Cloudflare dashboard, not in the repo; they use `pnpm wrangler …` so the pinned wrangler runs, never `pnpm dlx`/`npx` without a local install. pnpm's version comes from `packageManager` in `package.json`.
- Response headers for static files live in `public/_headers` (copied into `out/`): the security headers below and the long cache on hashed assets. They don't reach responses the Worker makes, so `src/worker.ts` sets its own on the redirect at `/`.

## Layout of the code

```
src/worker.ts         runs for "/" only: redirects to /en, /es or /pt
src/app/
  [lang]/layout.tsx   root layout per language: <html lang class="dark">, metadata, hreflang, skip link
  [lang]/page.tsx     the page: header, the sections, footer
  document.ts         fonts and viewport, shared with the 404; the Trusted Types policy and the early era script
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, the skills, their colours and years, the worlds)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         shadcn/ui's tokens in carbon, the mesh, two utilities and the skill icons
  marks.ts            brand marks (the skills, GitHub), as SVG paths from Simple Icons (CC0)
  manifest.ts, icon.svg, apple-icon.png  the signal square on carbon; the PNG is a
                      180px render of the same square on whole pixels (62–118)
src/components/
  ui/                 shadcn/ui: button, card, badge, separator, dialog, switch, label, field
  site/
    Intro.tsx         the status badge, the introduction and the GitHub button
    Section.tsx       the numbered frame every section below the intro uses
    Skills.tsx        a card per skill group, an icon tile per skill
    SkillIcon.tsx     the icons: brand marks, and the glyphs drawn for the rest
    Principles.tsx    the quote, then a card per principle
    Contact.tsx       a card: open to work, and the GitHub button again
    GitHubLink.tsx    the GitHub button both of them use
    LanguageLinks.tsx EN / ES / PT; remembers the choice for "/" and the 404
  quantum/
    QuantumRoot.tsx   the quantum layer's one mount point, after the page; lazy-loads the rest
    PanelButton.tsx   opens the branch map or the timeline (header), or the effects panel (footer)
    BranchMap.tsx     the branch tree in a dialog: a graph beside a keyboard tree
    Timeline.tsx      the skills by year, grouped by world; choosing one travels there
    EraStrip.tsx      the year, the world and "Back to now", under the header in the past
    EffectsPanel.tsx  a switch per effect, and one for all of them
    Ghosts.tsx        faint previews of the places you haven't been
    Interference.tsx  the wave background: raw WebGL, one shader, loaded only when on
    ProbabilityCursor.tsx  the Gaussian cloud round a mouse pointer, and a click's collapse
    Entanglement.tsx  the paired skills, and the arc between them
    Orbital.tsx       a hydrogen orbital sampled from |ψ|², beside the introduction
src/quantum/
  store.ts            a tiny store for useSyncExternalStore
  flags.ts            which effects are on (localStorage), and whether motion is reduced
  branches.ts         the branch tree (sessionStorage)
  navigate.ts         ties the tree to the links, history and view transitions
  time.ts             the year the page is shown in: loads and applies the worlds
  superposition.ts    the header links' copies: pointer distance, and two taps on touch
  seed.ts             seeded randomness, so each branch lays things out its own way
  ui.ts               which dialog is open, and the button that opened it
src/lib/utils.ts      shadcn/ui's cn()
public/eras/          one stylesheet per past world, and its fonts (OFL, licences beside them)
```

The page is deliberately flat: server components that render static markup. On top of it sits the quantum layer (below), which renders nothing on the server and loads what it draws on demand. There's no theme script and no app state beyond the layer's small stores. Keep it that way.

## The quantum layer

Moving around the page branches it, many-worlds style: every place you go is a node in a tree that splits wherever you took a different path, and a few effects make the page feel like it's in superposition. It's decoration over a page that works without it: the server's HTML is the same, every link is still a real link, and each effect can be switched off.

- **Branches.** `branches.ts` keeps the tree in sessionStorage (`vx-branches`). A node is a language and a place (`top` or a section id) plus the choice that led there: arrival, a link, a language change, a map jump or a direct visit. Taking the same choice from the same node again goes back into that branch rather than growing a new one. The tree keeps 48 nodes, pruning the oldest leaves off the current line.
- **Navigation.** `navigate.ts` handles clicks on this page's own section links: it takes a branch, pushes a history entry tagged with the branch's id (`vxBranch`), scrolls, and moves keyboard focus into the section. Back and forward follow the tag. Next.js patches `history` and reloads the page on a popstate whose state lacks its `__NA` marker, so every entry keeps Next's fields; write history only the way `navigate.ts` does. The language links still load the other document, and a sessionStorage key (`vx-branch-pending`) carries the branch across.
- **The map.** The header's Branches button opens the tree in a dialog: an SVG graph, `aria-hidden`, beside a WAI-ARIA tree (arrows, Home, End, Enter). Choosing a branch collapses the others into it, then goes there.
- **Flags.** `flags.ts` lists the effects. All are on by default and saved in localStorage (`vx-quantum`); `?quantum=off` and `?quantum=on` set them all. Each is mirrored on `<html>` as `data-q-<effect>` for CSS. The footer's Effects button opens a switch per effect. A new effect adds its name to `effects`, its copy to `quantum.effects.items` in all three dictionaries, and checks its flag before it draws anything.
- **Ghost previews.** The places you haven't been, faint behind the one you're in: the other sections' titles, and on the introduction the headline in the other languages lying over the real one. Each flickers every few seconds and goes for good once you've been there. They're CSS generated content with empty alt text, so they're not page text, and they're seeded by the branch, so each branch lays them out its own way.
- **Superposition nav.** Every link in the header sits in three faint places at once: text shadows in its own colour, offset at an angle seeded by its URL (`--a`). They draw together as the pointer comes near: `superposition.ts` sets `--q` on each link, from 1 at 180px or more to 0 on top of it, at most once a frame and only while the pointer moves. Keyboard focus collapses a link at once, and so does being the current language. On a touch screen there's no pointer to come near, so the first tap on a header link collapses it and the second, within four seconds, follows it; the panel buttons and keyboard activation always go straight through. The copies are measured against their own link: at least 4.5:1 at every width and in every era, which is why the worlds with a coloured header bar turn them down (`--copies`).
- **Interference background.** A canvas fixed behind the page draws three wave sources, each summing sin(k·r − ωt), bright where they add and dark where they cancel. One source follows the pointer (on touch, the scroll); the current branch's id seeds where the other two sit and every wavenumber, so each branch has its own pattern, and a branch change eases into the new one. Raw WebGL with one full-screen triangle; the chunk loads only when the effect is on and only in today's world. It draws at a fraction of the screen's pixels, lowering that when frames run long and raising it when there's room, runs only while the tab is visible, and draws a single still frame under reduced motion. Its strength is capped in the shader: with it on, muted text still measures above 5.6:1.
- **Probability cursor.** With a mouse (`hover: hover` and `pointer: fine`), a small canvas follows the pointer with a Gaussian cloud of dots where it might be; the real cursor stays. A click is a measurement: the cloud collapses to one sampled point, which flashes in signal, then spreads again. It draws only while the pointer moves or a flash fades, and never under reduced motion or on touch.
- **Entangled skills.** The owner's pairs, in `content.ts`: C and x86 Assembly, JavaScript and TypeScript, HTML and CSS, Next.js and Node.js, nftables and L4, nginx and L6 · L7, how LLMs work and working with AI. Pointing at one (tapping, on touch) marks both: they spin opposite ways and a faint arc joins them under their tiles. Under reduced motion they're marked and joined without spinning.
- **Orbital.** From lg up, beside the introduction and behind its text, a cloud of 1,600 points sampled by rejection from a hydrogen orbital's |ψ|² (2p, 3d z² or 3d xz, picked by the branch), turning slowly about its axis with the nucleus as a signal mark. It turns only while it's on screen and motion is allowed.
- **Tunneling.** Going to a section, or to another language, is a view transition: a barrier sweeps down the screen, the new view resolves above it, and the old one leaks through, faintly, until it ends. The same-document transition starts in `navigate.ts`; the cross-document one is `@view-transition` in CSS, skipped on `pageswap` when the flag is off. Without the API, or with the flag off, the page scrolls the way it always has.
- **Time travel.** Every skill has the year it first appeared (`content.ts`), and the header's Timeline button lists them, grouped by the world the page turns into there. Travelling to one is a branch like any other (the choice is "time travel"), so back and forward travel too. The page stays where it is, the barrier sweeps up into the past and down into the future, and it restyles to look as it might have then; see "Eras" under the design direction. `time.ts` follows the current branch's year: it sets `data-era` (the world) and `data-year` (the stop) on `<html>`, loads the world's stylesheet from `public/eras/` the first time, marks each skill `data-future` (not there yet) or `data-new` (that year's), and matches the browser's toolbar to the page. An early script in `<head>` (`eraScript` in `document.ts`) does the same before the body paints, so a reload, a language switch or back from another page never flashes today's design first. Today's world needs no stylesheet, and travelling to its stop (2022) comes back to it.

Rules for the layer:
- It never changes the content or what the server renders. `QuantumRoot` mounts after the page and renders nothing until it has run in the browser.
- What it draws is `aria-hidden` or generated content with empty alt text. The dialogs are shadcn/ui's, and focus goes back to the button that opened them.
- Every effect sits behind its flag and keeps still under `prefers-reduced-motion`: superposition doesn't start at all (and with it the two taps), the transitions become 160ms fades, the dialogs fade without zooming, the ghosts stop flickering and the map's lines and pulse stop. In forced colours the ghosts are hidden and the map draws in `CanvasText`.
- Load anything bigger than a store on demand: `QuantumRoot` imports the dialogs and the ghosts with `import()`, so the first load carries only it and `src/quantum/`.
- The ghosts sit under real text, so they're measured like the mesh: muted text stays above 5.8:1 with them at rest and above 4.5:1 at the brief peak of their flicker.
- In the past, "Back to now" stays under the header, so nobody is more than one click from today, and a polite live region says the year and the world whenever they change.

## Languages

- Every visible string lives in `src/app/i18n/`. `en.ts` defines the shape; `es.ts` and `pt.ts` are typed against it, so a missing key fails the build. Change all three together, and keep them saying the same thing.
- The root `/` is the only dynamic route. `src/worker.ts` (wired up by `main` and `assets.run_worker_first: ["/"]` in `wrangler.jsonc`) sends a 302 to a saved choice (the `vx-lang` cookie), then the best match in `Accept-Language`, then English. Every other path is served from static files without touching the Worker. The 404 page picks its language client-side, using the URL prefix first.
- Client components import `i18n/locales`, never `i18n` (a type-only import is fine), so the dictionaries stay out of the browser bundle. Pass strings down as props.
- Spanish uses tú and Latin American vocabulary; Portuguese uses você. Neither assigns vx a grammatical gender ("me dedico a la ingeniería de software", not "soy ingeniero"). Quotes from English READMEs stay in English.
- Check new copy in all three languages at phone width: Spanish and Portuguese run about 20% longer than English.

## Content rules

- **Only true claims.** The skills are vx's own list; everything else in `content.ts` and the dictionaries comes from vx's GitHub profile and the public repos on github.com/vx9k. Don't add skills vx hasn't named, and don't invent projects, stats, clients, dates or testimonials. The page doesn't list projects: GitHub does.
- **The timeline's years are facts too.** Each skill's year is when it first appeared, and `quantum.time.events` names the event it stands for (C at Bell Labs in 1972, the OSI model in 1984 for the network layers, the Transformer paper in 2017, ChatGPT's release in 2022, and so on). Change a year only with its event, in all three languages. vx's own mark, 2011, is in vx's words ("using tech since"); the page doesn't give vx's age or birth year.
- Copy goes in the dictionaries in `src/app/i18n/`, never inline in a component. Language-neutral data (links, product names, colours) goes in `content.ts`.
- **Say "software engineer" once at most** in visible copy (and its translations). It's in the introduction's headline, so nothing else repeats it.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

Carbon and shadcn/ui: one dark theme, neutral greys on near-black, content in shadcn/ui's cards and buttons in one centred column, over a faint mesh. The page earns its character from type, spacing and the mesh, not effects. The skill icons are the only colour beyond one signal orange. The only motion is theirs and the quantum layer's.

All of this is today's design, the page as it loads. The past eras of time travel are costumes over the same page and have their own rules ("Eras", below).

**Palette.** Only carbon: `color-scheme: dark`, and `<html>` carries the `dark` class so shadcn/ui's `dark:` variants always apply. There's no light theme and no toggle. The tokens are shadcn/ui's names on `:root` in `globals.css`, in neutral oklch greys:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | oklch 0.155 (≈ `#0c0c0c`) | the page |
| `--foreground` | oklch 0.985 | text |
| `--card` | oklch 0.185 | cards, and the base of the skill tiles |
| `--muted-foreground` | oklch 0.708 | secondary text, labels |
| `--primary` | oklch 0.922 | the solid button |
| `--secondary`, `--muted`, `--accent` | oklch 0.269 | the current language, hovers |
| `--border`, `--input` | white at 10%, 15% | card edges, rules |
| `--ring` | oklch 0.8 | focus rings; lighter than shadcn/ui's default so the half-strength ring still clears 3:1 |
| `--signal` | `#f04800` | marks only |
| `--mesh` | white at 7% | the mesh lines |

Contrast decides what each token may do. Foreground is about 18:1 on carbon and muted-foreground about 7.5:1. Measured over the rendered mesh and cards at every width and scroll position, muted text stays above 5.8:1. If you touch the mesh, the light or the greys, measure it again the same way. `--signal` is for marks and never for text: the square before "vx", the status square in the badge and in Contact, the rule beside the quote, the drawn skill glyphs, the mark on the 404, the edge of the tunneling barrier, the current branch in the map and the text selection. Don't add colours to the tokens; use shadcn/ui's semantic names (`bg-card`, `text-muted-foreground`), never raw palette classes.

**Brand colours.** The skills are the one place with more colour: each brand mark keeps its brand's colour, on a tile tinted with it (`--c` at 10% over the card, its edge at 28%). Where the original colour vanishes on carbon, `content.ts` gives a lighter shade. The glyphs drawn for skills without a brand use signal. Nothing else takes a brand colour.

**The mesh.** A grid of 1px lines every 3rem, painted on the `html` element's own background, with a veil of carbon over it that leaves it at full strength only around the top of the page and at about a third of that further down, and a faint white light over the hero. It should catch the eye at the top and then get out of the way. It isn't a fixed layer, and nothing else should be but shadcn/ui's dialogs and the interference canvas, which can afford to go missing under Safari's bars: Safari 26 on iOS clips `position: fixed` layers to the area between its status bar and toolbar, but paints the root background edge to edge. For the same reason, don't hide things by parking them just off screen (the skip link uses `not-focus:sr-only`). Keep `<body>` without a background, or it covers the mesh.

**Corners.** `--radius` is 0.375rem, so buttons and tiles are 4px, cards 10px. The badge is `rounded-md`, edited from shadcn/ui's pill: no `rounded-full` anywhere.

**Type.** Geist for everything, Geist Mono for the section numbers (the `label` utility), the language codes and the 404 badge. The headline is `text-4xl` to `text-6xl`, `font-semibold`, `tracking-tight`; section titles `text-2xl`/`text-3xl`. Sentence case throughout.

**Layout.**
- `shell` is the one centred column (64rem) that the header, every section and the footer share. Don't put page chrome outside it.
- The header is sticky, full width with a bottom border, frosted (`bg-background/80` and a blur), and solid with `prefers-reduced-transparency`. It's the only backdrop blur on the page.
- Below the intro every section is a `<Section>`: a mono number, the title, then the content. Numbers come from the order of `sections` in `content.ts`.
- Skills: a card per group, stacked. From md up the group's name sits left of its skills, and every card uses the same column grid (1, 2 from 380px, 3 from sm, 5 from lg), so the icons line up from card to card.
- Principles: the quote, then three cards. Contact: one card.

**Components.**
- shadcn/ui's `Button` (`asChild` around an `<a>` for links), `Card` with its full composition, `Badge` and `Separator`, and `Dialog`, `Switch` and `Field` for the quantum layer's panels. `DialogContent` takes a `closeLabel` for its translated close button, and the switch is square-cornered, not a pill. Use their variants before custom classes, and `className` for layout only.
- Card titles are `div`s; give them `role="heading"` and an `aria-level` so the outline stays h1 → h2 → h3.
- The language switch is a small segmented control: ghost `xs` buttons in a bordered group, the current one `secondary` and underlined in contrast themes. Its class strings are built on the server and passed in, so `cn()` and tailwind-merge stay out of the browser bundle.
- Skill icons: a 36px tile (`icon-tile`), the icon 20px inside it, `aria-hidden` with the name as text beside it. Brand marks come from `marks.ts`; skills without a brand get a glyph drawn in `SkillIcon.tsx` on the same 24px grid, with one small part that moves.
- Skill motion is CSS only, on `transform` and `opacity`: a glint that runs across the tiles once every 12s and leaves them still in between, a small lift when a row is hovered (not a bounce: the skills aren't links), and the glyphs' own loops. `prefers-reduced-motion` stops all of it.

**Don't:**
- A light theme, a second accent, colour on large surfaces, or signal used for text.
- Pills, heavy or coloured shadows, or a backdrop blur anywhere but the header. (The ghosts and the tunneling transition blur their own text, which is different.)
- Imagery or illustration; icons beyond lucide's in buttons, the skill icons and the GitHub mark.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, ASCII brackets, crosshairs, HUD or telemetry cosplay. The mesh is a background, not a HUD: no labels, coordinates or scan lines on it. (The 1978 era is the one exception, and only for the look: see "Eras".)
- Copy that performs: taglines, slogans, claims about impact. State what the thing is and what it does.

**Eras.** Each world is one stylesheet in `public/eras/`, scoped to `html[data-era="<world>"]`, with notches on `data-year`. It's plain CSS, not built: it's unlayered, so it wins over the Tailwind utilities without `!important`, and it uses native nesting. It restyles mostly through shadcn/ui's tokens and `data-slot`/`data-variant` hooks, never by changing markup.

| Years | World | Look |
| --- | --- | --- |
| 1972 | `teletype` | A printout: green-bar paper with tractor-feed holes, Courier Prime, black and red ribbon, dashed boxes |
| 1978 | `terminal` | A video terminal on a CRT: a monitor bezel round the screen, green phosphor on black in the IBM PC's text-mode face (VGA 8×16), glow, smear and a faint ghost image, scan lines, darkened corners, a rolling bar, a gentle flicker and a blinking block cursor |
| 1984 | `desktop` | One-bit: a dithered desktop, every section a window with a pinstriped title bar, Pixelify Sans, selection in reverse |
| 1991, 1995, 1996 | `web1` | The early web: bare structure (lists, blue links, no images), then a grey page with bevelled buttons, then CSS1 colour and Verdana |
| 2004, 2009 | `web2` | Web 2.0: flat blue, then gloss, rounded panels, a pill badge and app-icon tiles |
| 2012, 2014, 2016, 2017 | `flat` | Tiles, then Material paper and an app bar, then a quieter version, then gradients and floating cards |

Inside a past era, the design rules above don't apply: light pages, other fonts, colour, gloss, pills, shadows and patterns are all fine, and so are the terminal of 1978 (scan lines, glow, a blinking cursor; the owner allowed it there). Everything else still holds:
- The content is the page's own. An era changes how it looks, never what it says: no fake prompts, logs or banners, and decorative characters are generated content with empty alt text.
- WCAG 2.2 AA, measured the way the mesh is: text at 4.5:1 over the rendered era at phone and desktop width (the glow and the app bar's shadow included), focus visible on everything (where an era replaces a button's shadow, it gives focus an outline), 24px targets, phone widths in all three languages.
- `prefers-reduced-motion` stops the era's motion, and forced colours get a plain page: each world drops its patterns and keeps solid colours under any gradient.
- A world uses system fonts or a self-hosted open font in `public/eras/fonts/`, its licence beside it, loaded only in that world: OFL for Courier Prime and Pixelify Sans, CC BY-SA 4.0 for VileR's IBM VGA 8×16 (redistributed unmodified, credited in `ATTRIBUTION-ibm-vga-8x16.txt`). No images: patterns are CSS.
- A light era's ghosts are mixed most of the way into the page (`globals.css`), since dark on light stands out more than light on carbon.

Design-oriented agent skills live in `.claude/skills/`, shadcn's among them. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. There's one theme; `viewport.themeColor` in `document.ts` matches the browser chrome to carbon.

For every visual change:
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible focus (shadcn/ui's ring on its controls, a 2px `--ring` outline on everything else) and `aria-hidden` on purely decorative marks.
- Targets are at least 24px (WCAG 2.2 AA); the buttons are 32–40px and the language segments 28px. The effect switches are smaller, but their labels toggle them too.
- Keep motion to the skill icons, the quantum layer and smooth scrolling to anchors, and make sure `prefers-reduced-motion` turns all of it off (the tunneling transition becomes a short fade).
- In forced colours (Windows contrast themes) the mesh is hidden, text and borders follow the system, `--signal` becomes `CanvasText`, the skill icons draw in the text colour and the ink behind the JavaScript and TypeScript letters turns to `Canvas`, the ghosts and the interference canvas are hidden and the branch map draws in `CanvasText`. Check any new element there too.
- With `prefers-reduced-transparency`, check that the header is opaque.

## Performance

The page is static and small; keep it that way. The runtime dependencies are Next, React and shadcn/ui's (Radix, class-variance-authority, clsx, tailwind-merge, lucide), and almost all of it renders on the server: the only client code is the language links, the separator, the 404's language picker and the quantum layer. Of the layer, the first load carries `QuantumRoot`, its buttons and `src/quantum/`, under 7 KB gzipped, plus the early era script inline; the dialogs, the ghosts and the era strip are separate chunks, fetched when the page is idle or when they're needed. An era's stylesheet (2–3 KB gzipped) and its font (12–19 KB) load only when someone travels there. Two variable fonts, self-hosted by `next/font`, and no image files on the page: the icons are inline SVG. The mesh is four CSS gradients on the page background, the skill animations run on `transform` and `opacity`, and only the header pays for a backdrop blur. Keep any new idea to that standard: no animation libraries, nothing running in JavaScript on a timer, and no canvas but the interference background, which is the owner's call: it's lazy-loaded, behind its switch, adaptive in resolution and paused when the tab is hidden.

## Security headers

Every static response, the 404 included, carries:

- **Content-Security-Policy.** `default-src 'none'`, then only what the page uses, all from `'self'`: scripts, styles, images, fonts, the manifest and `connect-src`. `base-uri`, `form-action` and `frame-ancestors` are `'none'`, requests are upgraded to HTTPS, and Trusted Types are required, with one policy allowed: `default`.
  - Scripts: `'self'` plus a hash of each inline script. Next.js writes its bootstrap and each page's data inline, and the 404 carries its language picker, so `scripts/csp.mjs` hashes every inline `<script>` in `out/` after `next build` and puts the hashes in place of `INLINE_SCRIPT_HASHES` in `out/_headers`. The hashes change with every build, so never write them by hand, and never add `'unsafe-inline'` to `script-src`. The script fails the build if the token is missing or a line passes Cloudflare's 2,000-character limit.
  - Styles: `'self' 'unsafe-inline'`, because the stylesheet is inlined and each skill tile's colour is a `style` attribute. The era stylesheets and their fonts come from `'self'` (`public/eras/`).
  - Trusted Types: Next.js loads its lazy chunks by setting `script.src` to a string, which Trusted Types blocks, so the first thing in each page's `<head>` is an inline script (`trustedTypesPolicy` in `document.ts`) that creates the `default` policy. It lets through script URLs under this origin's `/_next/static/` and throws for anything else, and it has no HTML or script conversions, so every other sink stays blocked. It returns the URL exactly as given: Turbopack recognises a loaded chunk by its `src` attribute, and a rewritten URL leaves the `import()` waiting forever with no error. The early era script (`eraScript`) runs right after it; it only reads storage and adds a stylesheet link, which Trusted Types doesn't cover. The 404 loads no chunks and carries neither. Nothing on the page writes HTML or script into the DOM (`dangerouslySetInnerHTML` is only rendered on the server); don't add code that sets `innerHTML`, `script.text` or similar in the browser.
- **Strict-Transport-Security** for two years, subdomains included (the zone's other records are iCloud mail). It isn't marked `preload`: that list is hard to leave, so it's the owner's call.
- **X-Content-Type-Options** `nosniff`, **X-Frame-Options** `DENY`, **Referrer-Policy** `strict-origin-when-cross-origin`, and a **Permissions-Policy** that turns off every powerful feature.
- **Cross-Origin-Opener-Policy** `same-origin` and **Cross-Origin-Embedder-Policy** `require-corp`, so the page is cross-origin isolated, and **Cross-Origin-Resource-Policy** `same-origin`. Also **Origin-Agent-Cluster** and **X-Permitted-Cross-Domain-Policies** `none`.

Anything from another origin (analytics, a font service, an embed, an image) needs that origin in the matching directive, and under `require-corp` it has to send CORP or CORS headers. Cloudflare Web Analytics, for one, would need `static.cloudflareinsights.com` in `script-src` and `cloudflareinsights.com` in `connect-src`. After any change, open `/en` and a 404 with the browser console open and check for CSP errors. The Worker's redirect sets its own, smaller set in `src/worker.ts`; keep the two in step.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for event handlers or browser APIs.
- Follow the shadcn skill's rules: `gap-*` not `space-*`, `size-*` for squares, `cn()` for conditional classes, semantic tokens, `data-icon` on icons in buttons.
- Use semantic HTML over `div`s, and remove unused code and CSS when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
