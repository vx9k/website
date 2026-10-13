<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vx — portfolio

The personal site of vx ([github.com/vx9k](https://github.com/vx9k)), live at [kthread.dev](https://kthread.dev): a minimal portfolio, in English, on one page. Its job is to show vx's work: who vx is in a sentence, then the products, each presented properly, then a way to get in touch.

## The brief

- **Minimal.** One idea per screen, generous space, four type sizes, one typeface family plus a mono for labels. No decoration that doesn't carry information. If an element can be removed without losing meaning, remove it.
- **Portfolio first.** The page answers three questions in order: who is this, what have they built, how do I reach them. The introduction is short; the work is the bulk of the page.
- **Products, showcased.** Each product gets real space: its name, one sentence on what it does, a few specifics, what it's built with, its status, its license, and a link to its repository (and to a live version or release, if one exists). A screenshot when the repository or vx provides one. Products are ordered by how much they say about vx's work, not by date.
- **Quiet craft.** Monochrome, warm-neutral, one theme that follows the system's light or dark setting. Precise typography, alignment and hairlines do the work. The one piece of motion is screenshots easing in as they scroll into view, in CSS, off under reduced motion.
- **Fast and accessible.** Static, small, readable without JavaScript, WCAG 2.2 AA.

Talk to the owner before changing the visual direction.

## Commands

```sh
pnpm install     # pnpm only; the lockfile is committed
pnpm dev         # local dev server (also rewrites the managed block above; leave it)
pnpm build       # static export to out/, then the CSP's script hashes: the check that must pass
pnpm wrangler dev  # serve out/ through the Workers runtime, as in production
pnpm lint        # currently broken: typescript-eslint doesn't support TypeScript 7 yet
```

There are no tests. Verify a change by building, serving `out/` (`pnpm wrangler dev`; restart it after a rebuild) and looking at it in a browser at desktop and phone widths, in light and dark.

## Stack

- **Next.js 16, App Router, `output: "export"`.** Fully static, so there are no Next.js server features: no request-time route handlers, no server actions, no `next/image` optimisation, no middleware, no `redirects`/`headers` in `next.config`. What a static export does support, the site uses: server components rendered at build time, the Metadata API (title, description, Open Graph, canonical), `opengraph-image.tsx` (the share image, drawn with `next/og` at build time), `sitemap.ts`, `robots.ts`, `manifest.ts`, file-based icons, `not-found.tsx` (exported as `404.html`), `next/font`, inlined CSS and the React Compiler. Read the version-matched docs in `node_modules/next/dist/docs/` before relying on any API.
- **React 19 with the React Compiler.** Don't hand-write `useMemo`/`useCallback` for performance.
- **Tailwind CSS v4.** Configured in CSS (`@theme` and `@utility` in `src/app/globals.css`); there's no `tailwind.config.*`. `source("..")` on the import limits class scanning to `src/`.
- **TypeScript 7**, strict. `@/*` maps to `src/*`.
- **Cloudflare Workers static assets, with no Worker script** (`wrangler.jsonc`). Every request is answered from `out/` without running code, so it's free and unmetered on the free plan. `public/_headers` sets response headers and `public/_redirects` the redirects (the old `/en`, `/es` and `/pt` go to `/`); both are copied into `out/`. Unknown paths get `404.html` with a 404 status.
- **Deploys.** Cloudflare Workers Builds is connected to this repo: every push to `main` runs `pnpm run build` then `pnpm wrangler deploy`, and every other branch gets a preview URL posted on its PR. Work on a branch, open a PR, and check the preview.
- The Worker is named `website`; the `name` in `wrangler.jsonc` must match it. `kthread.dev` is a Custom Domain in `wrangler.jsonc`; `www.kthread.dev` redirects to it through a Redirect Rule on the zone. The zone's DNS also carries iCloud mail records: leave them alone. Build commands live in the Cloudflare dashboard and use `pnpm wrangler …`, never `pnpm dlx`/`npx` without a local install.
- The `compatibility_date` can't be newer than the `workerd` that `wrangler dev` ships, or local serving fails.

## Agent tooling

- **Skills** live in `.claude/skills/`, installed with the [`skills`](https://skills.sh) CLI and pinned in `skills-lock.json` (`npx skills experimental_install` restores them, `npx skills update` refreshes them):
  - Cloudflare's, from [cloudflare/skills](https://github.com/cloudflare/skills): `wrangler`, `workers-best-practices`, `web-perf`, `cf-cli` and the rest. Use them for Workers, deploys and performance.
  - Next.js workflow skills from `vercel/next.js`: `next-dev-loop` (verify each change against a running dev server), `next-bundle-optimizer`, and the Cache Components and Partial Prefetching adoption and optimizer skills.
  - Design skills from [taste-skill](https://www.tasteskill.dev/docs): `design-taste-frontend`, `minimalist-ui` and `redesign-existing-projects`, for the overhaul.
- **MCP servers** are in `.mcp.json`, enabled for the project in `.claude/settings.json`: Cloudflare's (`https://mcp.cloudflare.com/mcp`, which asks you to sign in to Cloudflare the first time) and `next-devtools-mcp`, which connects to a running `pnpm dev`.
- **Plugins** are declared in `.claude/settings.json` with their marketplaces, so Claude Code offers to install them when it opens the project:
  - [ponytail](https://github.com/DietrichGebert/ponytail): keeps solutions small (YAGNI, stdlib first). `/ponytail lite|full|ultra|off` sets its level; its hooks need `node` on the PATH.
  - [claude-mem](https://github.com/thedotmack/claude-mem)'s `claude-mem-cowork`, the variant for cloud sessions (web and the mobile apps): it needs a cmem.ai key in the environment (`CMEM_API_KEY`, and `CMEM_USER_ID`), and does nothing without one. On your own machine, install the full claude-mem with `npx claude-mem install`.
  - [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing): audits and rewrites copy for AI-writing patterns. Run it on new copy before it lands (`/avoid-ai-writing`, or ask for an AI-isms check); the content rules here still win where they differ.
- **Next.js** guidance comes first from the bundled docs (the managed block at the top); the skills only cover multi-step workflows.
- Where a design skill disagrees with this file, this file wins.
- Review a skill before installing it: skills run with the agent's full permissions.

## Layout of the code

```
src/app/
  layout.tsx          <html>, fonts, metadata, viewport, the Trusted Types policy, the skip link
  page.tsx            the page: header, intro, Work, Skills, Contact, footer, and its JSON-LD
  not-found.tsx       exported as 404.html
  content.ts          everything the page says: the intro, the products, skills, contact, links
  globals.css         tokens (light and dark), utilities, the one animation
  opengraph-image.tsx, sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.png
src/components/site/  Section (the shared frame) and Product (one product)
public/work/          product screenshots, AVIF and WebP at 640 and 1280 pixels wide
public/_headers, public/_redirects
scripts/csp.mjs       after next build: hashes the inline scripts into the CSP
```

The page is server components rendering static markup, with no client components. Keep it that way: add `"use client"` only where a browser API or event handler needs it.

## Content rules

- **Only true claims.** Everything on the page must be checkable against vx's GitHub profile and public repos, or come from vx directly. Don't invent projects, products, stats, users, clients, dates or testimonials.
- **Products** are vx's own public work. For each, take the name, description, stack, status and license from its repository (README, manifests, docs, releases) or from vx; link the repository. Don't describe features a product doesn't have, and say "in progress" or "experimental" where the repo does. Screenshots and demos only from vx or the repo itself. Today's are blockclonia, claude-presence, 4suite and this site; `dots` (dotfiles) is left out.
- **Skills** are vx's own list. Don't add skills vx hasn't named, even ones a product's stack shows.
- All copy and data live in `src/app/content.ts`, never inline in a component (structural labels such as "Built with" and "Skip to content" are the exception).
- Say "software engineer" once at most in visible copy.
- Write plainly: sentence case, active voice, no exclamation marks, no em dashes, none of the marketing words ("elevate", "seamless", "unleash", "next-gen" and so on). State what a thing is and what it does; no taglines or claims about impact.

## Accessibility

Target WCAG 2.2 AA, checked at phone and desktop widths, in light and dark:

- Semantic landmarks, one `h1`, a heading outline without gaps (`h1`, an `h2` per section, an `h3` per product), `aria-labelledby` on sections and products, the skip link, visible focus on everything, and `aria-hidden` on purely decorative marks.
- Text at 4.5:1 (3:1 for large text), measured over whatever is actually rendered behind it. The tokens' ratios are noted in `globals.css`.
- Targets at least 24px. Images get real `alt` text describing what they show; decorative ones get `alt=""`.
- `prefers-reduced-motion` turns off all non-essential motion; forced colours (Windows contrast themes) must leave everything readable and every control visible.

## Performance

The site is static and small; keep it that way. Runtime dependencies are Next and React, nothing else. Fonts are self-hosted by `next/font`. Product images go in `public/work/` as AVIF with a WebP fallback, at 640 and 1280 pixels wide, in a `<picture>` with `srcset`, `sizes`, `width` and `height` set and `loading="lazy"`; `next/image` optimisation isn't available in a static export. Name them `<id>-<width>.<ext>`, and convert from the repository's own screenshots. No analytics, trackers or third-party embeds without the owner's say-so (see the CSP below). Prefer CSS to JavaScript for motion; no animation libraries.

## Security headers

Every static response, the 404 included, carries:

- **Content-Security-Policy.** `default-src 'none'`, then only what the page uses, all from `'self'`: scripts, styles, images, fonts, the manifest and `connect-src`. `base-uri`, `form-action` and `frame-ancestors` are `'none'`, requests are upgraded to HTTPS, and Trusted Types are required, with one policy allowed: `default`.
  - Scripts: `'self'` and a hash of each inline script. Next.js writes its bootstrap and each page's data inline, so `scripts/csp.mjs` hashes every inline `<script>` in `out/` after `next build` and puts the hashes in place of `INLINE_SCRIPT_HASHES` in `out/_headers`. The hashes change with every build, so never write them by hand, and never add `'unsafe-inline'` to `script-src`. The script fails the build if the token is missing or a line passes Cloudflare's 2,000-character limit.
  - Styles: `'self' 'unsafe-inline'`, because the stylesheet is inlined (`experimental.inlineCss`) and Next.js writes the fonts' variables into a `<style>` tag.
  - Trusted Types: Next.js loads its lazy chunks by setting `script.src` to a string, which Trusted Types blocks, so the first thing in each page's `<head>` is an inline script (`trustedTypesPolicy` in `layout.tsx`) that creates the `default` policy. It lets through script URLs under this origin's `/_next/static/` and throws for anything else, and it has no HTML or script conversions, so every other sink stays blocked. It returns the URL exactly as given: Turbopack recognises a loaded chunk by its `src` attribute, and a rewritten URL leaves the `import()` waiting forever with no error. Nothing on the page writes HTML or script into the DOM (`dangerouslySetInnerHTML` is only rendered on the server); don't add code that sets `innerHTML`, `script.text` or similar in the browser.
- **Strict-Transport-Security** for two years, subdomains included (the zone's other records are iCloud mail). It isn't marked `preload`: that list is hard to leave, so it's the owner's call.
- **X-Content-Type-Options** `nosniff`, **X-Frame-Options** `DENY`, **Referrer-Policy** `strict-origin-when-cross-origin`, and a **Permissions-Policy** that turns off every powerful feature.
- **Cross-Origin-Opener-Policy** `same-origin` and **Cross-Origin-Embedder-Policy** `require-corp`, so the page is cross-origin isolated, and **Cross-Origin-Resource-Policy** `same-origin`. Also **Origin-Agent-Cluster** and **X-Permitted-Cross-Domain-Policies** `none`.

Anything from another origin (analytics, a font service, an embed, an image) needs that origin in the matching directive, and under `require-corp` it has to send CORP or CORS headers. Cloudflare Web Analytics, for one, would need `static.cloudflareinsights.com` in `script-src` and `cloudflareinsights.com` in `connect-src`. After any change, open `/` and a 404 with the browser console open and check for CSP errors.

## Code style

- Match the surrounding code: small components, Tailwind classes inline, and comments that explain *why* in plain sentences.
- Server components by default. Add `"use client"` only for event handlers or browser APIs.
- `gap-*` not `space-*`, `size-*` for squares, and the semantic tokens (`text-muted`, `bg-surface`, `border` for hairlines) rather than raw palette classes.
- Semantic HTML over `div`s. Remove unused code, styles and strings when deleting a feature.
- Commit messages: a short imperative summary line, then a body that explains the change.
