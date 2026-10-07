// The background's one picture, written twice: in WGSL for WebGPU and in
// GLSL for WebGL. Both read the same block of vec4s (see `uniforms` in
// Background.tsx):
//   u[0] = size.x, size.y, time, wave strength
//   u[1] = foam strength, 0, 0, 0
//   u[2] = source 0 xy, source 1 xy
//   u[3] = source 2 xy, phase 1, phase 2
//   u[4] = k0, k1, k2, phase 0
//   u[5 + i] = pair i: x, y, age in [0, 1), angle
// Waves: three sources summing sin(k·r − ωt); the square of the sum is
// bright where they agree and dark where they cancel. Foam: each pair is
// two points that split apart from one place and close up again, and as
// they meet they annihilate in a small ring.

export const pairs = 32;
export const vectors = 5 + pairs;

export const wgsl = /* wgsl */ `
struct U { v: array<vec4f, ${vectors}> };
@group(0) @binding(0) var<uniform> u: U;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[i], 0.0, 1.0);
}

@fragment fn fs(@builtin(position) at: vec4f) -> @location(0) vec4f {
  let size = u.v[0].xy;
  let uv = vec2f(at.x / size.x, 1.0 - at.y / size.y);
  let aspect = size.x / size.y;
  let p = vec2f(uv.x * aspect, uv.y);
  let t = u.v[0].z;
  let src = array<vec2f, 3>(u.v[2].xy, u.v[2].zw, u.v[3].xy);
  let phase = array<f32, 3>(u.v[4].w, u.v[3].z, u.v[3].w);
  var s = 0.0;
  for (var i = 0; i < 3; i++) {
    let r = distance(p, vec2f(src[i].x * aspect, src[i].y));
    s += sin(u.v[4][i] * r - t * 1.1 + phase[i]) / (1.0 + r * 1.6);
  }
  let waves = clamp(s * s / 3.0, 0.0, 1.0) * u.v[0].w * mix(0.35, 1.0, uv.y);
  var foam = 0.0;
  for (var i = 0; i < ${pairs}; i++) {
    let q = u.v[5 + i];
    let c = vec2f(q.x * aspect, q.y);
    let life = sin(3.14159265 * q.z);
    let dir = vec2f(cos(q.w), sin(q.w)) * life * 0.014;
    let a = p - c - dir;
    let b = p - c + dir;
    foam += (exp(-dot(a, a) / 0.0000064) + exp(-dot(b, b) / 0.0000064)) * life;
    if (q.z > 0.85) {
      let k = (q.z - 0.85) / 0.15;
      let ring = (distance(p, c) - k * 0.02) / 0.0018;
      foam += exp(-ring * ring) * (1.0 - k) * 0.6;
    }
  }
  let alpha = waves + min(foam, 1.0) * u.v[1].x;
  return vec4f(vec3f(alpha), alpha);
}`;

export const glslVertex = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

export const glslFragment = `
precision mediump float;
uniform vec4 u[${vectors}];
void main() {
  vec2 size = u[0].xy;
  vec2 uv = gl_FragCoord.xy / size;
  float aspect = size.x / size.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u[0].z;
  float s = 0.0;
  s += sin(u[4].x * distance(p, vec2(u[2].x * aspect, u[2].y)) - t * 1.1 + u[4].w) / (1.0 + distance(p, vec2(u[2].x * aspect, u[2].y)) * 1.6);
  s += sin(u[4].y * distance(p, vec2(u[2].z * aspect, u[2].w)) - t * 1.1 + u[3].z) / (1.0 + distance(p, vec2(u[2].z * aspect, u[2].w)) * 1.6);
  s += sin(u[4].z * distance(p, vec2(u[3].x * aspect, u[3].y)) - t * 1.1 + u[3].w) / (1.0 + distance(p, vec2(u[3].x * aspect, u[3].y)) * 1.6);
  float waves = clamp(s * s / 3.0, 0.0, 1.0) * u[0].w * mix(0.35, 1.0, uv.y);
  float foam = 0.0;
  for (int i = 0; i < ${pairs}; i++) {
    vec4 q = u[5 + i];
    vec2 c = vec2(q.x * aspect, q.y);
    float life = sin(3.14159265 * q.z);
    vec2 dir = vec2(cos(q.w), sin(q.w)) * life * 0.014;
    vec2 a = p - c - dir;
    vec2 b = p - c + dir;
    foam += (exp(-dot(a, a) / 0.0000064) + exp(-dot(b, b) / 0.0000064)) * life;
    if (q.z > 0.85) {
      float k = (q.z - 0.85) / 0.15;
      float ring = (distance(p, c) - k * 0.02) / 0.0018;
      foam += exp(-ring * ring) * (1.0 - k) * 0.6;
    }
  }
  float alpha = waves + min(foam, 1.0) * u[1].x;
  gl_FragColor = vec4(vec3(alpha), alpha);
}`;
