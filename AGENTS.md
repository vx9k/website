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
  globals.css         shadcn/ui's tokens in black, the utilities, the page's motion, the skill icons
                      and the layout the eras are drawn over
  marks.ts            brand marks (the skills, GitHub), as SVG paths from Simple Icons (CC0)
  manifest.ts, icon.svg, apple-icon.png  the signal square on near-black; the PNG is a
                      180px render of the same square on whole pixels (62–118)
src/components/
  ui/                 shadcn/ui: button, card, badge, separator, dialog, switch, label, field
  site/
    Intro.tsx         the centred hero: status, headline (one span per word), lede, two buttons
    Section.tsx       the band every section below the intro uses: title pinned left, content right
    Skills.tsx        a card per skill group, a cell per skill with its tile and year
    SkillIcon.tsx     the icons: brand marks, and the glyphs drawn for the rest
    Principles.tsx    the quote, then a numbered row per principle
    Contact.tsx       the one light panel: open to work, and the GitHub button again
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
    Background.tsx    the waves and the foam: one canvas, WebGPU or else WebGL, loaded only when on
    ProbabilityCursor.tsx  the Gaussian cloud round a mouse pointer, and a click's collapse
    Entanglement.tsx  the paired skills, and the arc between them
    Orbital.tsx       a hydrogen orbital sampled from |ψ|², behind the headline
src/quantum/
  store.ts            a tiny store for useSyncExternalStore
  flags.ts            which effects are on (localStorage), and whether motion is reduced
  branches.ts         the branch tree (sessionStorage)
  navigate.ts         ties the tree to the links, history and view transitions
  time.ts             the year the page is shown in: loads and applies the worlds
  superposition.ts    the header links' copies: pointer distance, and two taps on touch
  foam/               the background's shader (WGSL and GLSL), and the foam's WebAssembly:
                      foam.wat (source), foam.ts (loads public/quantum/foam.wasm, seeds it)
  seed.ts             seeded randomness, so each branch (and each visit) lays things out its own way
  ui.ts               which dialog is open, and the button that opened it
src/lib/utils.ts      shadcn/ui's cn()
public/eras/          one stylesheet per past world, and its fonts (licences beside them)
public/quantum/       foam.wasm, built from src/quantum/foam/foam.wat with wabt's wat2wasm
```

The page is deliberately flat: server components that render static markup. On top of it sits the quantum layer (below), which renders nothing on the server and loads what it draws on demand. There's no theme script and no app state beyond the layer's small stores. Keep it that way.

## The quantum layer

Moving around the page branches it, many-worlds style: every place you go is a node in a tree that splits wherever you took a different path, and a few effects make the page feel like it's in superposition. It's decoration over a page that works without it: the server's HTML is the same, every link is still a real link, and each effect can be switched off.

- **Branches.** `branches.ts` keeps the tree in sessionStorage (`vx-branches`). A node is a language and a place (`top` or a section id) plus the choice that led there: arrival, a link, a language change, a map jump or a direct visit. Taking the same choice from the same node again goes back into that branch rather than growing a new one. The tree keeps 48 nodes, pruning the oldest leaves off the current line.
- **Navigation.** `navigate.ts` handles clicks on this page's own section links: it takes a branch, pushes a history entry tagged with the branch's id (`vxBranch`), scrolls, and moves keyboard focus into the section. Back and forward follow the tag. Next.js patches `history` and reloads the page on a popstate whose state lacks its `__NA` marker, so every entry keeps Next's fields; write history only the way `navigate.ts` does. The language links still load the other document, and a sessionStorage key (`vx-branch-pending`) carries the branch across.
- **The map.** The header's Branches button opens the tree in a dialog: an SVG graph, `aria-hidden`, beside a WAI-ARIA tree (arrows, Home, End, Enter). Choosing a branch collapses the others into it, then goes there.
- **Flags.** `flags.ts` lists the effects. All are on by default and saved in localStorage (`vx-quantum`); `?quantum=off` and `?quantum=on` set them all. Each is mirrored on `<html>` as `data-q-<effect>` for CSS. The footer's Effects button opens a switch per effect. A new effect adds its name to `effects`, its copy to `quantum.effects.items` in all three dictionaries, and checks its flag before it draws anything.
- **Ghost previews.** The places you haven't been, faint behind the one you're in: the other sections' titles, and on the introduction the headline in the other languages lying over the real one. Each flickers every few seconds and goes for good once you've been there. They're CSS generated content with empty alt text, so they're not page text, and they're seeded by the branch, so each branch lays them out its own way.
- **Randomness.** Two kinds. Layouts are seeded (`seed.ts`) by the branch mixed with a salt drawn once per visit from `crypto.getRandomValues` (sessionStorage, `vx-salt`): a branch keeps its layout for the whole visit, and the next visit lays the same branch out afresh. That covers the ghosts, the orbital, the wave sources and the superposition angles. Then a few things are drawn fresh every time: the waves' phases, the foam (below), and the order the headline's words arrive in (`--wa` and `--wb`, set by the early script in `<head>`).
- **Superposition nav.** Every link in the header sits in three faint places at once: text shadows in its own colour, offset at an angle seeded by its URL (`--a`). They draw together as the pointer comes near: `superposition.ts` sets `--q` on each link, from 1 at 180px or more to 0 on top of it, at most once a frame and only while the pointer moves. Keyboard focus collapses a link at once, and so does being the current language. On a touch screen there's no pointer to come near, so the first tap on a header link collapses it and the second, within four seconds, follows it; the panel buttons and keyboard activation always go straight through. The copies are measured against their own link: at least 4.5:1 at every width and in every era, which is why the worlds with a coloured header bar turn them down (`--copies`).
- **Interference and foam.** One canvas fixed behind the page (`Background.tsx`) draws two effects, each with its own switch. The interference: three wave sources, each summing sin(k·r − ωt), bright where they add and dark where they cancel; one follows the pointer (on touch, the scroll), the current branch's id places the other two and sets every wavenumber, and each visit draws its phases at random. The foam: 32 pairs of virtual particles that appear at random, split apart and close up again, and annihilate in a small ring. Their randomness is a WebAssembly module (`foam.wat`, xoshiro128**) seeded from `crypto.getRandomValues` on every visit; that's cryptographically unpredictable, not quantum, and the copy doesn't claim otherwise. It renders with WebGPU where the browser has it and WebGL otherwise, from the same shader written twice (`foam/shaders.ts`); `?renderer=webgl` forces WebGL, to compare. It loads only when one of the two is on and only in today's world, draws at a fraction of the screen's pixels (lowered when frames run long, raised when there's room), runs only while the tab is visible, and draws one still frame under reduced motion. With both on, and the orbital and ghosts over them, muted text still measures above 5.9:1. Headless Chromium here can't present a WebGPU canvas (it shows white or nothing), so check WebGPU in a real browser; the shader's output was read back from an offscreen texture instead.
- **Probability cursor.** With a mouse (`hover: hover` and `pointer: fine`), a small canvas follows the pointer with a Gaussian cloud of dots where it might be; the real cursor stays. A click is a measurement: the cloud collapses to one sampled point, which flashes in signal, then spreads again. It draws only while the pointer moves or a flash fades, and never under reduced motion or on touch.
- **Entangled skills.** The owner's pairs, in `content.ts`: C and x86 Assembly, JavaScript and TypeScript, HTML and CSS, Next.js and Node.js, nftables and L4, nginx and L6 · L7, how LLMs work and working with AI. Pointing at one (tapping, on touch) marks both: they spin opposite ways and a faint arc joins them under their tiles. Under reduced motion they're marked and joined without spinning.
- **Orbital.** From md up, large and faint behind the headline, a cloud of 1,600 points sampled by rejection from a hydrogen orbital's |ψ|² (2p, 3d z² or 3d xz, picked by the branch), turning slowly about its axis with the nucleus as a signal mark. It turns only while it's on screen and motion is allowed.
- **Tunneling.** Going to a section, or to another language, is a view transition: a barrier sweeps down the screen, the new view resolves above it, and the old one leaks through, faintly, until it ends. The same-document transition starts in `navigate.ts`; the cross-document one is `@view-transition` in CSS, skipped on `pageswap` when the flag is off. Without the API, or with the flag off, the page scrolls the way it always has.
- **Time travel.** Every skill has the year it first appeared (`content.ts`), and the header's Timeline button lists them, grouped by the world the page turns into there. Travelling to one is a branch like any other (the choice is "time travel"), so back and forward travel too. The page stays where it is, the barrier sweeps up into the past and down into the future, and it restyles to look as it might have then; see "Eras" under the design direction. `time.ts` follows the current branch's year: it sets `data-era` (the world) and `data-year` (the stop) on `<html>`, loads the world's stylesheet from `public/eras/` the first time, marks each skill `data-future` (not there yet) or `data-new` (that year's), and matches the browser's toolbar to the page. An early script in `<head>` (`eraScript` in `document.ts`) does the same before the body paints, so a reload, a language switch or back from another page never flashes today's design first. Today's world needs no stylesheet, and travelling to its stop (2022) comes back to it.

Rules for the layer:
- It never changes the content or what the server renders. `QuantumRoot` mounts after the page and renders nothing until it has run in the browser.
- What it draws is `aria-hidden` or generated content with empty alt text. The dialogs are shadcn/ui's, and focus goes back to the button that opened them.
- Every effect sits behind its flag and keeps still under `prefers-reduced-motion`: superposition doesn't start at all (and with it the two taps), the transitions become 160ms fades, the dialogs fade without zooming, the ghosts stop flickering and the map's lines and pulse stop. In forced colours the ghosts are hidden and the map draws in `CanvasText`.
- Load anything bigger than a store on demand: `QuantumRoot` imports the dialogs and the ghosts with `import()`, so the first load carries only it and `src/quantum/`.
- The ghosts, the background and the orbital sit under real text, so they're measured with it: muted text stays above 5.8:1 with them at rest and above 4.5:1 at the brief peak of the ghosts' flicker.
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

Brutalist, on black: big type, hard edges and hairlines, a structure you can see. One dark theme, the greys taken as steps of the foreground's opacity, content in shadcn/ui's cards and buttons, laid out on a column whose edges are drawn down the page and bands that cross it. The page earns its character from type, scale and the grid, not decoration. The skill icons are the only colour beyond one signal orange, and the only light surface is the Contact panel.

All of this is today's design, the page as it loads. The past eras of time travel are costumes over the same page and have their own rules ("Eras", below).

**Palette.** Only black: `color-scheme: dark`, and `<html>` carries the `dark` class so shadcn/ui's `dark:` variants always apply. There's no light theme and no toggle. The tokens are shadcn/ui's names on `:root` in `globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#000` | the page |
| `--foreground` | `#f5f5f5` | text, and the Contact panel |
| `--card` | `#0f0f0f` | cards, and the base of the skill tiles |
| `--muted-foreground` | `#a2a2a2` (the foreground at 62%) | secondary text, labels |
| `--primary` | `#f5f5f5` | the solid button |
| `--secondary`, `--muted`, `--accent` | `#1f1f1f` | the current language, hovers |
| `--border`, `--input` | the foreground at 14%, 20% | card edges, cell rules |
| `--ring` | `#d4d4d4` | focus rings; light enough that the half-strength ring still clears 3:1 |
| `--signal` | `#f04800` | marks only |
| `--rule` | the foreground at 14% | the column's edges and the bands' rules |

Contrast decides what each token may do. Foreground is about 19:1 on black and muted-foreground about 8.2:1 (7.5:1 on a card). Measured over the rendered background, orbital and ghosts at every width and scroll position, muted text stays above 5.8:1. If you touch the greys or anything drawn behind text, measure it again the same way. `--signal` is for marks and never for text: the square before "vx", the status square in the badge and in Contact, the rule beside the quote, the drawn skill glyphs, the mark on the 404, the edge of the tunneling barrier, the current branch in the map and the text selection. Don't add colours to the tokens; use shadcn/ui's semantic names (`bg-card`, `text-muted-foreground`), never raw palette classes. The one exception is the Contact panel's inversion (`.panel-light` in `globals.css`), which only applies in today's world.

**Brand colours.** The skills are the one place with more colour: each brand mark keeps its brand's colour, on a tile tinted with it (`--c` at 10% over the card, its edge at 28%). Where the original colour vanishes on black, `content.ts` gives a lighter shade. The glyphs drawn for skills without a brand use signal. Nothing else takes a brand colour.

**The grid.** The page's own background is plain black. Its structure is drawn in hairlines: `shell` draws the column's two edges, which run from the header to the footer, and `band` puts a rule across the full width above each section and the footer. Nothing is a fixed layer but shadcn/ui's dialogs and the quantum layer's canvases, which can afford to go missing under Safari's bars: Safari 26 on iOS clips `position: fixed` layers to the area between its status bar and toolbar. For the same reason, don't hide things by parking them just off screen (the skip link uses `not-focus:sr-only`).

**Corners.** `--radius` is 3px, and the radius scale is spelled out (`sm` 2px, `md` and `lg` 3px, `xl` 4px) because shadcn/ui's subtracts from it. No `rounded-full` anywhere.

**Type.** Instrument Sans for everything, IBM Plex Mono (400 and 500) for labels: the section numbers (the `label` utility), the status badge, the skills' years, the footer's links, the language codes and the 404 badge. Both are OFL, self-hosted by `next/font`, and exposed as `--font-face-sans` and `--font-face-mono`, which the eras redefine. Display sizes are fluid, not stepped: the headline is `text-display` (2.5rem to 6rem), section titles `text-title` (2rem to 4rem), both `font-medium` with tight tracking. Sentence case throughout, and mono labels in capitals.

**Layout.**
- `shell` is the one column (80rem, its edges drawn) that the header, every section and the footer share. Don't put page chrome outside it.
- The header is sticky, solid black with a bottom rule.
- The introduction fills the first screen, centred: the status badge, the headline, the lede, and two buttons (GitHub, and down to the skills), over the background and the orbital.
- Below it every section is a `<Section>`: a band with a mono number ("01 / 03"), the title, then the content. From lg up it splits, 5 to 7: the number and title stay pinned on the left while the content scrolls past on the right. Numbers come from the order of `sections` in `content.ts`.
- Skills: a card per group, stacked, each with a header row (the name, and the count in mono) over a grid of cells divided by hairlines (1 column, 2 from 380px, 3 from sm). Each cell has the tile, the name, any note, and from md up the year in mono, `aria-hidden` because the timeline lists the same years with their events.
- Principles: the quote, large, then a numbered row per principle between rules. Contact: one light panel.
- Footer: two columns of mono links (the sections; the source, back to top and the Effects button), and "vx" as large as the room beside them allows, `aria-hidden`, its foot cut off by the end of the page.

**Components.**
- shadcn/ui's `Button` (`asChild` around an `<a>` for links), `Card` with its full composition, and `Badge`, and `Dialog`, `Switch`, `Field` and `Separator` for the quantum layer's panels. `DialogContent` takes a `closeLabel` for its translated close button, and the switch is square-cornered, not a pill. Use their variants before custom classes. Keep the skill groups, the principles and Contact as `Card`s even where today's design flattens them: the eras style them through `data-slot`.
- Card titles are `div`s; give them `role="heading"` and an `aria-level` so the outline stays h1 → h2 → h3.
- The language switch is a small segmented control: ghost `xs` buttons in a bordered group, the current one `secondary` and underlined in contrast themes. Its class strings are built on the server and passed in, so `cn()` and tailwind-merge stay out of the browser bundle.
- Skill icons: a 36px tile (`icon-tile`), the icon 20px inside it, `aria-hidden` with the name as text beside it. Brand marks come from `marks.ts`; skills without a brand get a glyph drawn in `SkillIcon.tsx` on the same 24px grid, with one small part that moves.

**Motion.** CSS only, on `transform`, `opacity` and `filter`, only in today's world, and all of it off under `prefers-reduced-motion`:
- The headline's words resolve out of a blur one at a time, in a random order: `Intro.tsx` gives each word its index (`--w`), the early script picks `--wa` (1 to 10) and `--wb` (0 to 10) on every load, and the delay is (w·a + b) mod 11, a permutation for up to eleven words. Then the badge, the lede and the buttons rise in.
- Below the introduction, the section titles, the skill groups, the quote, the principles and the Contact panel rise in as they scroll into view, and the footer's "vx" climbs into place. These are scroll-driven (`animation-timeline: view()`), so they follow the scroll position: anything already on screen, after a jump to a section say, is simply there. Browsers without scroll-driven animations show everything still.
- The skills: a glint that runs across the tiles once every 12s and leaves them still in between, a small lift when a cell is hovered (not a bounce: the skills aren't links), the cell lighting, and the glyphs' own loops. Arrows in buttons lean the way they point on hover.

**Don't:**
- A light theme, a second accent, colour on large surfaces (the Contact panel is off-white, not a colour), or signal used for text.
- Pills, shadows, or a backdrop blur. (The ghosts and the tunneling transition blur their own text, which is different.)
- Imagery or illustration; icons beyond lucide's in buttons, the skill icons and the GitHub mark.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, ASCII brackets, crosshairs, HUD or telemetry cosplay. The grid is structure, not a HUD: no coordinates or scan lines on it. (The 1978 era is the one exception, and only for the look: see "Eras".)
- Copy that performs: taglines, slogans, claims about impact. State what the thing is and what it does.

**Eras.** Each world is one stylesheet in `public/eras/`, scoped to `html[data-era="<world>"]`, with notches on `data-year`. It's plain CSS, not built: it's unlayered, so it wins over the Tailwind utilities without `!important`, and it uses native nesting. It restyles mostly through shadcn/ui's tokens and `data-slot`/`data-variant` hooks, never by changing markup. The eras were drawn over an earlier, simpler layout (one 64rem column, everything left-aligned, each title above its content), and `globals.css` puts that layout back under them, wrapped in `:where(html[data-era])` so it weighs nothing and each era's own rules win. Today's motion and the footer's wordmark don't apply there.

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
- WCAG 2.2 AA, measured the way today's page is: text at 4.5:1 over the rendered era at phone and desktop width (the glow and the app bar's shadow included), focus visible on everything (where an era replaces a button's shadow, it gives focus an outline), 24px targets, phone widths in all three languages.
- `prefers-reduced-motion` stops the era's motion, and forced colours get a plain page: each world drops its patterns and keeps solid colours under any gradient.
- A world uses system fonts or a self-hosted open font in `public/eras/fonts/`, its licence beside it, loaded only in that world: OFL for Courier Prime and Pixelify Sans, CC BY-SA 4.0 for VileR's IBM VGA 8×16 (redistributed unmodified, credited in `ATTRIBUTION-ibm-vga-8x16.txt`). No images: patterns are CSS.
- A light era's ghosts are mixed most of the way into the page (`globals.css`), since dark on light stands out more than light on black.

Design-oriented agent skills live in `.claude/skills/`, shadcn's among them. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. There's one theme; `viewport.themeColor` in `document.ts` matches the browser chrome to black.

For every visual change:
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible focus (shadcn/ui's ring on its controls, a 2px `--ring` outline on everything else) and `aria-hidden` on purely decorative marks.
- Targets are at least 24px (WCAG 2.2 AA); the buttons are 32–40px and the language segments 28px. The effect switches are smaller, but their labels toggle them too.
- Keep motion to what "Motion" above lists, the quantum layer and smooth scrolling to anchors, and make sure `prefers-reduced-motion` turns all of it off (the tunneling transition becomes a short fade).
- In forced colours (Windows contrast themes) text and borders follow the system, `--signal` becomes `CanvasText`, the skill icons draw in the text colour and the ink behind the JavaScript and TypeScript letters turns to `Canvas`, the Contact panel follows the system like any card, the ghosts, the orbital and the background canvas are hidden and the branch map draws in `CanvasText`. Check any new element there too.

## Performance

The page is static and small; keep it that way. The runtime dependencies are Next, React and shadcn/ui's (Radix, class-variance-authority, clsx, tailwind-merge, lucide), and almost all of it renders on the server: the only client code is the language links, the separator, the 404's language picker and the quantum layer. Of the layer, the first load carries `QuantumRoot`, its buttons and `src/quantum/`, under 7 KB gzipped, plus the early era script inline; the dialogs, the ghosts and the era strip are separate chunks, fetched when the page is idle or when they're needed. An era's stylesheet (2–3 KB gzipped) and its font (12–19 KB) load only when someone travels there. Two fonts, self-hosted by `next/font` (Instrument Sans variable, IBM Plex Mono in two weights), and no image files on the page: the icons are inline SVG. The grid is borders, the page's motion is CSS on `transform`, `opacity` and `filter` (scroll-driven where it follows the scroll), and nothing pays for a backdrop blur. Keep any new idea to that standard: no animation libraries and nothing running in JavaScript on a timer. The canvases (the background, the probability cursor, the orbital) and the foam's 414-byte WebAssembly module are the owner's call: each is lazy-loaded, behind its switch, and stops when it isn't seen.

## Security headers

Every static response, the 404 included, carries:

- **Content-Security-Policy.** `default-src 'none'`, then only what the page uses, all from `'self'`: scripts, styles, images, fonts, the manifest and `connect-src`. `base-uri`, `form-action` and `frame-ancestors` are `'none'`, requests are upgraded to HTTPS, and Trusted Types are required, with one policy allowed: `default`.
  - Scripts: `'self'`, `'wasm-unsafe-eval'` (which lets the foam compile its WebAssembly module and allows nothing else: no `eval`) and a hash of each inline script. Next.js writes its bootstrap and each page's data inline, and the 404 carries its language picker, so `scripts/csp.mjs` hashes every inline `<script>` in `out/` after `next build` and puts the hashes in place of `INLINE_SCRIPT_HASHES` in `out/_headers`. The hashes change with every build, so never write them by hand, and never add `'unsafe-inline'` to `script-src`. The script fails the build if the token is missing or a line passes Cloudflare's 2,000-character limit.
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
