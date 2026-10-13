<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vx — portfolio

The personal site of vx ([github.com/vx9k](https://github.com/vx9k)), live at [kthread.dev](https://kthread.dev), in three languages: English (US) at `/en`, Spanish (Latin America) at `/es` and Portuguese (Brazil) at `/pt`.

**The site is being overhauled.** The goal is a minimal portfolio whose main job is to show vx's work: who vx is in a sentence, then the products, each presented properly, then a way to get in touch. Everything below is the brief for that overhaul and the rules that still hold. Where this file describes how the current code works, that's the starting point, not a commitment: anything that doesn't serve the brief can go.

## The brief

- **Minimal.** One idea per screen, generous space, few type sizes, one typeface family plus a mono for labels at most. No decoration that doesn't carry information. If an element can be removed without losing meaning, remove it.
- **Portfolio first.** The page answers three questions in order: who is this, what have they built, how do I reach them. The introduction is short; the work is the bulk of the page.
- **Products, showcased.** Each product gets real space: its name, one sentence on what it does, what it's built with, its status, and a link to its repository (and to a live version or release, if one exists). A screenshot, diagram or short demo when vx provides one. Products are ordered by how much they say about vx's work, not by date.
- **Quiet craft.** Precise typography, alignment and spacing do the work. Motion is small, purposeful and optional.
- **Fast and accessible.** Static, small, readable without JavaScript, WCAG 2.2 AA.

Decide the visual direction with the owner before building it; propose, don't assume. The current page (below) is monochrome with a dark first screen; that's a reasonable base, not a requirement.

## Commands

```sh
pnpm install     # pnpm only; the lockfile is committed
pnpm dev         # local dev server (also rewrites the managed block above; leave it)
pnpm build       # static export to out/, then the CSP's script hashes: the check that must pass
pnpm wrangler dev  # serve out/ through the Workers runtime, as in production
pnpm lint        # currently broken: typescript-eslint doesn't support TypeScript 7 yet
```

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`; restart it after a rebuild) and looking at it in a browser at desktop and phone widths, in all three languages.

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static and served as Cloudflare Workers static assets (`wrangler.jsonc`), so there are no Next.js server features: no route handlers, no server actions, no `next/image` optimisation, no middleware. The one exception is `src/worker.ts`, a plain Worker that handles `/`. Read the version-matched docs in `node_modules/next/dist/docs/` before relying on any API.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme` and `@utility` in `src/app/globals.css`); there's no `tailwind.config.*`. `source("..")` on the import limits class scanning to `src/`.
- **shadcn/ui**, new-york style on Radix (`components.json`), with lucide icons. Components live in `src/components/ui/` as source you own. Add them with `pnpm dlx shadcn@latest add <name>`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- **Deploys.** Cloudflare Workers Builds is connected to this repo: every push to `main` runs `pnpm run build` then `pnpm wrangler deploy`, and every other branch gets a preview URL posted on its PR. Work on a branch, open a PR, and check the preview.
- The Worker is named `website`; the `name` in `wrangler.jsonc` must match it. `kthread.dev` is a Custom Domain in `wrangler.jsonc`; `www.kthread.dev` redirects to it through a Redirect Rule on the zone. The zone's DNS also carries iCloud mail records: leave them alone. Build commands live in the Cloudflare dashboard and use `pnpm wrangler …`, never `pnpm dlx`/`npx` without a local install.
- Response headers for static files live in `public/_headers` (copied into `out/`). They don't reach responses the Worker makes, so `src/worker.ts` sets its own on the redirect at `/`.

## Agent tooling

- **Skills** live in `.claude/skills/`, installed with the [`skills`](https://skills.sh) CLI and pinned in `skills-lock.json` (`npx skills experimental_install` restores them, `npx skills update` refreshes them):
  - Cloudflare's, from [cloudflare/skills](https://github.com/cloudflare/skills): `wrangler`, `workers-best-practices`, `web-perf`, `cf-cli` and the rest. Use them for Workers, deploys and performance.
  - Next.js workflow skills from `vercel/next.js`: `next-dev-loop` (verify each change against a running dev server), `next-bundle-optimizer`, and the Cache Components and Partial Prefetching adoption and optimizer skills.
  - Design skills from [taste-skill](https://www.tasteskill.dev/docs): `design-taste-frontend`, `minimalist-ui` and `redesign-existing-projects`, for the overhaul.
- **MCP servers** are in `.mcp.json`, enabled for the project in `.claude/settings.json`: Cloudflare's (`https://mcp.cloudflare.com/mcp`, which asks you to sign in to Cloudflare the first time) and `next-devtools-mcp`, which connects to a running `pnpm dev`.
- **Plugins** are declared in `.claude/settings.json` with their marketplaces, so Claude Code offers to install them when it opens the project:
  - [ponytail](https://github.com/DietrichGebert/ponytail): keeps solutions small (YAGNI, stdlib first). `/ponytail lite|full|ultra|off` sets its level; its hooks need `node` on the PATH.
  - [claude-mem](https://github.com/thedotmack/claude-mem)'s `claude-mem-cowork`, the variant for cloud sessions (web and the mobile apps): it needs a cmem.ai key in the environment (`CMEM_API_KEY`, and `CMEM_USER_ID`), and does nothing without one. On your own machine, install the full claude-mem with `npx claude-mem install`.
- **Next.js** guidance comes first from the bundled docs (the managed block at the top); the skills only cover multi-step workflows.
- Where a design skill disagrees with this file, this file wins.
- Review a skill before installing it: skills run with the agent's full permissions.

## Layout of the code (today)

```
src/worker.ts         runs for "/" only: redirects to /en, /es or /pt
src/app/
  [lang]/layout.tsx   root layout per language: <html lang>, metadata, hreflang, skip link
  [lang]/page.tsx     the page: header, sections, footer
  document.ts         fonts and viewport, shared with the 404; the Trusted Types policy and the early era script
  global-not-found.tsx  exported as 404.html; carries all three languages
  content.ts          language-neutral data: links, section ids, skills with colours and years, the eras
  i18n/               en.ts (source of truth), es.ts, pt.ts, locales.ts
  globals.css         tokens, utilities, page styles, motion, and the layout the eras are drawn over
  marks.ts            brand marks as SVG paths from Simple Icons (CC0)
src/components/
  ui/                 shadcn/ui components
  site/               the page's sections: Intro, Section, Skills, Principles, Contact, GitHubLink, LanguageLinks
  quantum/            the optional effects layer (below)
src/quantum/          the effects layer's stores: branches, navigation, flags, time travel, seeds
public/eras/          one stylesheet per past era of time travel, and its fonts
```

The page is deliberately flat: server components rendering static markup, with client code only where a browser API or event handler needs it. Keep it that way through the overhaul.

## The effects layer (today)

On top of the page sits an optional layer of quantum-themed effects (`src/components/quantum/`, `src/quantum/`): branching navigation with a map, tunneling view transitions, ghost previews, superposition on the header links, a WebGPU/WebGL background with WebAssembly-seeded foam, a probability cursor, entangled skills, a hydrogen orbital, and time travel through restyled eras (`public/eras/`). Each effect sits behind a flag (`src/quantum/flags.ts`, switchable from the footer), keeps still under `prefers-reduced-motion`, draws only `aria-hidden` or generated content, and never changes what the server renders.

It doesn't fit a minimal portfolio as it stands. Whether to keep, trim or remove it is the owner's call: ask before deleting it, and if it goes, remove its code, styles, strings, CSP allowances (`'wasm-unsafe-eval'`) and `public/` assets together.

## Languages

- Every visible string lives in `src/app/i18n/`. `en.ts` defines the shape; `es.ts` and `pt.ts` are typed against it, so a missing key fails the build. Change all three together and keep them saying the same thing.
- The root `/` is the only dynamic route: `src/worker.ts` sends a 302 to a saved choice (the `vx-lang` cookie), then the best match in `Accept-Language`, then English. The 404 page picks its language client-side.
- Client components import `i18n/locales`, never `i18n` (a type-only import is fine), so the dictionaries stay out of the browser bundle.
- Spanish uses tú and Latin American vocabulary; Portuguese uses você. Neither assigns vx a grammatical gender ("me dedico a la ingeniería de software", not "soy ingeniero"). Quotes from English READMEs stay in English.
- Check copy in all three languages at phone width: Spanish and Portuguese run about 20% longer than English.

## Content rules

- **Only true claims.** Everything on the page must be checkable against vx's GitHub profile and public repos, or come from vx directly. Don't invent projects, products, stats, users, clients, dates or testimonials.
- **Products** are vx's own public work, chosen by vx. For each, take the name, description, stack and status from its repository (README, topics, releases) or from vx; link the repository. Don't describe features a product doesn't have, and say "in progress" or "experimental" where the repo does. Screenshots and demos only from vx or the repo itself.
- **Skills** are vx's own list. Don't add skills vx hasn't named.
- Copy goes in the dictionaries, never inline in a component. Language-neutral data (links, product names, stacks, colours) goes in `content.ts`.
- Say "software engineer" once at most in visible copy.
- Write plainly: sentence case, active voice, no exclamation marks, none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on). State what a thing is and what it does; no taglines or claims about impact.

## Accessibility

Target WCAG 2.2 AA, checked at phone and desktop widths in all three languages:

- Semantic landmarks, one `h1`, a heading outline without gaps, `aria-labelledby` on sections, the skip link, visible focus on everything, and `aria-hidden` on purely decorative marks.
- Text at 4.5:1 (3:1 for large text), measured over whatever is actually rendered behind it.
- Targets at least 24px. Images get real `alt` text describing what they show; decorative ones get `alt=""`.
- `prefers-reduced-motion` turns off all non-essential motion; forced colours (Windows contrast themes) must leave everything readable and every control visible.

## Performance

The site is static and small; keep it that way. Runtime dependencies are Next, React and shadcn/ui's (Radix, class-variance-authority, clsx, tailwind-merge, lucide). Fonts are self-hosted by `next/font`. Product images go in `public/` as modern formats (AVIF or WebP) at the sizes they're shown, with `width` and `height` set and `loading="lazy"` below the first screen; `next/image` optimisation isn't available in a static export. No analytics, trackers or third-party embeds without the owner's say-so (see the CSP below). Prefer CSS to JavaScript for motion; no animation libraries.

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
- shadcn/ui's conventions: `gap-*` not `space-*`, `size-*` for squares, `cn()` for conditional classes, semantic tokens rather than raw palette classes, `data-icon` on icons in buttons.
- Semantic HTML over `div`s. Remove unused code, styles and strings when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
