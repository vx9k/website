// Fills in the Content-Security-Policy in out/_headers with a hash of
// every inline script in the static export. Next.js writes its bootstrap
// and each page's data into inline <script> tags (and the 404 carries its
// own language picker), and a static site has no server to hand out
// nonces, so the policy allows exactly these scripts by hash. The hashes
// change with every build, which is why this runs after `next build`
// instead of the hashes living in public/_headers.
//
// Next.js streams the page's data as a run of small inline scripts, and
// how many depends on how the build machine's streams happen to flush:
// the same commit has given 5 on Workers Builds and over 30 locally,
// which is past what fits in one _headers line. So each run of adjacent
// plain inline scripts is first joined into one script, in the same
// order, which runs the same statements and needs one hash.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = "out";
const token = "INLINE_SCRIPT_HASHES";

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

// Tags in any case, and end tags with anything before the ">"
// ("</script >", "</SCRIPT foo>"), as browsers read them: a script this
// missed would get no hash, and the policy would block it.
const script = /<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi;
// A run of two or more attribute-free inline scripts with nothing between
// them (a body never contains "</script", so a run can't swallow a tag
// between two scripts). The bodies are statements, so ";" joins them.
const run = /(?:<script>(?:(?!<\/script)[\s\S])*<\/script>){2,}/g;

const hashes = new Set();
let pages = 0;
for (const file of htmlFiles(out)) {
  pages++;
  let html = readFileSync(file, "utf8");
  const joined = html.replace(run, (scripts) => `<script>${[...scripts.matchAll(script)].map((m) => m[2]).join(";")}</script>`);
  if (joined !== html) writeFileSync(file, (html = joined));
  for (const [, attrs, body] of html.matchAll(script)) {
    // Scripts with a src load from this origin and are covered by 'self';
    // JSON-LD is data, never run, so the policy doesn't apply to it.
    if (/\bsrc\s*=/i.test(attrs) || /\btype\s*=\s*"application\/ld\+json"/i.test(attrs)) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
}

const path = join(out, "_headers");
const headers = readFileSync(path, "utf8");
// Fail the build rather than ship a policy that blocks the page's own
// scripts: the token must be there exactly once, and there must be scripts.
if (headers.split(token).length !== 2) throw new Error(`${path}: expected ${token} exactly once`);
if (hashes.size === 0) throw new Error(`no inline scripts found in ${out}/`);

const filled = headers.replace(token, [...hashes].sort().join(" "));
// Cloudflare ignores any _headers line over 2,000 characters.
const long = filled.split("\n").find((line) => line.length > 2000);
if (long) throw new Error(`${path}: a line is ${long.length} characters, over Cloudflare's 2,000`);

writeFileSync(path, filled);
console.log(`CSP: ${hashes.size} inline script hashes from ${pages} pages`);
