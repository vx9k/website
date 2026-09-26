// Fills in the Content-Security-Policy in out/_headers with a hash of
// every inline script in the static export. Next.js writes its bootstrap
// and each page's data into inline <script> tags (and the 404 carries its
// own language picker), and a static site has no server to hand out
// nonces, so the policy allows exactly these scripts by hash. The hashes
// change with every build, which is why this runs after `next build`
// instead of the hashes living in public/_headers.

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

const hashes = new Set();
let pages = 0;
for (const file of htmlFiles(out)) {
  pages++;
  const html = readFileSync(file, "utf8");
  // Tags in any case, and end tags with anything before the ">"
  // ("</script >", "</SCRIPT foo>"), as browsers read them: a script this
  // missed would get no hash, and the policy would block it.
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi)) {
    // Scripts with a src load from this origin and are covered by 'self'.
    if (/\bsrc\s*=/i.test(attrs)) continue;
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
