// Deterministic randomness: the same branch always gets the same layout
// of ghosts, wave sources and copies, and a different branch a different
// one. Each visit (each tab) mixes in its own salt from the browser's
// cryptographic generator, so the same branch is laid out one way for the
// whole visit and another way on the next.

let salt: string | undefined;

function visit() {
  if (salt !== undefined) return salt;
  try {
    salt = sessionStorage.getItem("vx-salt") ?? "";
    if (!salt) {
      salt = Array.from(crypto.getRandomValues(new Uint32Array(2)), (n) => n.toString(36)).join("");
      sessionStorage.setItem("vx-salt", salt);
    }
  } catch {
    salt = Math.random().toString(36).slice(2);
  }
  return salt;
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** A generator of numbers in [0, 1) seeded by the text (mulberry32). */
export function seeded(text: string) {
  let state = hash(`${visit()}:${text}`);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
