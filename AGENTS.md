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
  document.ts         fonts and viewport, shared with the 404
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data (links, section ids, the skills and their colours)
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         shadcn/ui's tokens in carbon, the mesh, two utilities and the skill icons
  marks.ts            brand marks (the skills, GitHub), as SVG paths from Simple Icons (CC0)
  manifest.ts, icon.svg, apple-icon.png  the signal square on carbon; the PNG is a
                      180px render of the same square on whole pixels (62–118)
src/components/
  ui/                 shadcn/ui: button, card, badge, separator
  site/
    Intro.tsx         the status badge, the introduction and the GitHub button
    Section.tsx       the numbered frame every section below the intro uses
    Skills.tsx        a card per skill group, an icon tile per skill
    SkillIcon.tsx     the icons: brand marks, and the glyphs drawn for the rest
    Principles.tsx    the quote, then a card per principle
    Contact.tsx       a card: open to work, and the GitHub button again
    GitHubLink.tsx    the GitHub button both of them use
    LanguageLinks.tsx EN / ES / PT; remembers the choice for "/" and the 404
src/lib/utils.ts      shadcn/ui's cn()
```

The page is deliberately flat: server components that render static markup, and one client component for the language links. There's no theme script, no toggle and no app state. Keep it that way.

## Languages

- Every visible string lives in `src/app/i18n/`. `en.ts` defines the shape; `es.ts` and `pt.ts` are typed against it, so a missing key fails the build. Change all three together, and keep them saying the same thing.
- The root `/` is the only dynamic route. `src/worker.ts` (wired up by `main` and `assets.run_worker_first: ["/"]` in `wrangler.jsonc`) sends a 302 to a saved choice (the `vx-lang` cookie), then the best match in `Accept-Language`, then English. Every other path is served from static files without touching the Worker. The 404 page picks its language client-side, using the URL prefix first.
- Client components import `i18n/locales`, never `i18n`, so the dictionaries stay out of the browser bundle. Pass strings down as props.
- Spanish uses tú and Latin American vocabulary; Portuguese uses você. Neither assigns vx a grammatical gender ("me dedico a la ingeniería de software", not "soy ingeniero"). Quotes from English READMEs stay in English.
- Check new copy in all three languages at phone width: Spanish and Portuguese run about 20% longer than English.

## Content rules

- **Only true claims.** The skills are vx's own list; everything else in `content.ts` and the dictionaries comes from vx's GitHub profile and the public repos on github.com/vx9k. Don't add skills vx hasn't named, and don't invent projects, stats, clients, dates or testimonials. The page doesn't list projects: GitHub does.
- Copy goes in the dictionaries in `src/app/i18n/`, never inline in a component. Language-neutral data (links, product names, colours) goes in `content.ts`.
- **Say "software engineer" once at most** in visible copy (and its translations). It's in the introduction's headline, so nothing else repeats it.
- Write plainly: sentence case, active voice, no exclamation marks, and none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on).

## Design direction

Carbon and shadcn/ui: one dark theme, neutral greys on near-black, content in shadcn/ui's cards and buttons in one centred column, over a faint mesh. The page earns its character from type, spacing and the mesh, not effects. The skill icons are the only colour beyond one signal orange, and the only motion.

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

Contrast decides what each token may do. Foreground is about 18:1 on carbon and muted-foreground about 7.5:1. Measured over the rendered mesh and cards at every width and scroll position, muted text stays above 5.8:1. If you touch the mesh, the light or the greys, measure it again the same way. `--signal` is for marks and never for text: the square before "vx", the status square in the badge and in Contact, the rule beside the quote, the drawn skill glyphs, the mark on the 404 and the text selection. Don't add colours to the tokens; use shadcn/ui's semantic names (`bg-card`, `text-muted-foreground`), never raw palette classes.

**Brand colours.** The skills are the one place with more colour: each brand mark keeps its brand's colour, on a tile tinted with it (`--c` at 10% over the card, its edge at 28%). Where the original colour vanishes on carbon, `content.ts` gives a lighter shade. The glyphs drawn for skills without a brand use signal. Nothing else takes a brand colour.

**The mesh.** A grid of 1px lines every 3rem, painted on the `html` element's own background, with a veil of carbon over it that leaves it at full strength only around the top of the page and at about a third of that further down, and a faint white light over the hero. It should catch the eye at the top and then get out of the way. It isn't a fixed layer, and nothing else should be: Safari 26 on iOS clips `position: fixed` layers to the area between its status bar and toolbar, but paints the root background edge to edge. For the same reason, don't hide things by parking them just off screen (the skip link uses `not-focus:sr-only`). Keep `<body>` without a background, or it covers the mesh.

**Corners.** `--radius` is 0.375rem, so buttons and tiles are 4px, cards 10px. The badge is `rounded-md`, edited from shadcn/ui's pill: no `rounded-full` anywhere.

**Type.** Geist for everything, Geist Mono for the section numbers (the `label` utility), the language codes and the 404 badge. The headline is `text-4xl` to `text-6xl`, `font-semibold`, `tracking-tight`; section titles `text-2xl`/`text-3xl`. Sentence case throughout.

**Layout.**
- `shell` is the one centred column (64rem) that the header, every section and the footer share. Don't put page chrome outside it.
- The header is sticky, full width with a bottom border, frosted (`bg-background/80` and a blur), and solid with `prefers-reduced-transparency`. It's the only blur on the page.
- Below the intro every section is a `<Section>`: a mono number, the title, then the content. Numbers come from the order of `sections` in `content.ts`.
- Skills: a card per group, stacked. From md up the group's name sits left of its skills, and every card uses the same column grid (1, 2 from 380px, 3 from sm, 5 from lg), so the icons line up from card to card.
- Principles: the quote, then three cards. Contact: one card.

**Components.**
- shadcn/ui's `Button` (`asChild` around an `<a>` for links), `Card` with its full composition, `Badge` and `Separator`. Use their variants before custom classes, and `className` for layout only.
- Card titles are `div`s; give them `role="heading"` and an `aria-level` so the outline stays h1 → h2 → h3.
- The language switch is a small segmented control: ghost `xs` buttons in a bordered group, the current one `secondary` and underlined in contrast themes. Its class strings are built on the server and passed in, so `cn()` and tailwind-merge stay out of the browser bundle.
- Skill icons: a 36px tile (`icon-tile`), the icon 20px inside it, `aria-hidden` with the name as text beside it. Brand marks come from `marks.ts`; skills without a brand get a glyph drawn in `SkillIcon.tsx` on the same 24px grid, with one small part that moves.
- Skill motion is CSS only, on `transform` and `opacity`: a glint that runs across the tiles once every 12s and leaves them still in between, a small lift when a row is hovered (not a bounce: the skills aren't links), and the glyphs' own loops. `prefers-reduced-motion` stops all of it.

**Don't:**
- A light theme, a second accent, colour on large surfaces, or signal used for text.
- Pills, heavy or coloured shadows, or blur anywhere but the header.
- Imagery or illustration; icons beyond lucide's in buttons, the skill icons and the GitHub mark.
- Terminal or hacker clichés: fake shells, `$` prompts, boot logs, blinking cursors, ASCII brackets, crosshairs, HUD or telemetry cosplay. The mesh is a background, not a HUD: no labels, coordinates or scan lines on it.
- Copy that performs: taglines, slogans, claims about impact. State what the thing is and what it does.

Design-oriented agent skills live in `.claude/skills/`, shadcn's among them. Use them for visual work, but this section wins where they disagree.

## Themes and accessibility

Target WCAG 2.2 AA. There's one theme; `viewport.themeColor` in `document.ts` matches the browser chrome to carbon.

For every visual change:
- Keep semantic landmarks, `aria-labelledby` on sections, the skip link, visible focus (shadcn/ui's ring on its controls, a 2px `--ring` outline on everything else) and `aria-hidden` on purely decorative marks.
- Targets are at least 24px (WCAG 2.2 AA); the buttons are 32–40px and the language segments 28px.
- Keep motion to the skill icons and smooth scrolling to anchors, and make sure `prefers-reduced-motion` turns all of it off.
- In forced colours (Windows contrast themes) the mesh is hidden, text and borders follow the system, `--signal` becomes `CanvasText`, the skill icons draw in the text colour and the ink behind the JavaScript and TypeScript letters turns to `Canvas`. Check any new element there too.
- With `prefers-reduced-transparency`, check that the header is opaque.

## Performance

The page is static and small; keep it that way. The runtime dependencies are Next, React and shadcn/ui's (Radix, class-variance-authority, clsx, tailwind-merge, lucide), and almost all of it renders on the server: the only client code is the language links, the separator and the 404's language picker. Two variable fonts, self-hosted by `next/font`, and no image files on the page: the icons are inline SVG. The mesh is four CSS gradients on the page background, the skill animations run on `transform` and `opacity`, and only the header pays for a backdrop blur. Keep any new idea to that standard: no canvas, no animation libraries, nothing running in JavaScript on a timer.

## Security headers

Every static response, the 404 included, carries:

- **Content-Security-Policy.** `default-src 'none'`, then only what the page uses, all from `'self'`: scripts, styles, images, fonts, the manifest and `connect-src`. `base-uri`, `form-action` and `frame-ancestors` are `'none'`, requests are upgraded to HTTPS, and Trusted Types are required with no policy allowed.
  - Scripts: `'self'` plus a hash of each inline script. Next.js writes its bootstrap and each page's data inline, and the 404 carries its language picker, so `scripts/csp.mjs` hashes every inline `<script>` in `out/` after `next build` and puts the hashes in place of `INLINE_SCRIPT_HASHES` in `out/_headers`. The hashes change with every build, so never write them by hand, and never add `'unsafe-inline'` to `script-src`. The script fails the build if the token is missing or a line passes Cloudflare's 2,000-character limit.
  - Styles: `'self' 'unsafe-inline'`, because the stylesheet is inlined and each skill tile's colour is a `style` attribute.
  - Trusted Types: nothing on the page writes script into the DOM (`dangerouslySetInnerHTML` is only rendered on the server), so any sink that tries is blocked. Don't add code that sets `innerHTML`, `script.src` or similar in the browser.
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
