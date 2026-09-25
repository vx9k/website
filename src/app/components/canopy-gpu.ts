// GPU renderer for the canopy background. Loaded on demand by
// CanopyField, so none of this reaches visitors who can't or shouldn't
// run it (reduced motion, e-ink, high contrast, Save-Data, no GPU).
//
// One shader, written in WGSL and GLSL: slow domain-warped ember smoke with
// a diagonal shaft of warm light, plus a glow that drifts toward the pointer.

const GLSL_VERTEX = `#version 300 es
void main() {
  vec2 pos[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const GLSL_FRAGMENT = `#version 300 es
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;
  float t = uTime * 0.018;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float n = fbm(p + 1.6 * q + vec2(0.0, t * 2.0));

  vec3 soot = vec3(0.03, 0.012, 0.011);
  vec3 oxblood = vec3(0.15, 0.035, 0.03);
  vec3 ember = vec3(0.42, 0.1, 0.065);
  vec3 col = mix(soot, oxblood, smoothstep(0.2, 0.8, n));
  col = mix(col, ember, smoothstep(0.55, 0.95, n) * 0.55);

  float shaft = smoothstep(0.55, 1.0, sin((uv.x - uv.y * 0.8) * 2.6 + uTime * 0.04) * 0.5 + 0.5);
  col += vec3(1.0, 0.55, 0.4) * shaft * 0.035 * (0.4 + n);

  vec2 d = vec2((uv.x - uPointer.x) * aspect, uv.y - uPointer.y);
  col += vec3(0.95, 0.32, 0.22) * exp(-dot(d, d) * 5.0) * 0.05;

  col *= 1.0 - 0.35 * pow(length(uv - 0.5), 2.0);
  fragColor = vec4(col, 1.0);
}`;

const WGSL = `
struct U {
  res: vec2<f32>,
  time: f32,
  pad: f32,
  pointer: vec2<f32>,
  pad2: vec2<f32>,
};
@group(0) @binding(0) var<uniform> u: U;

fn hash(p0: vec2<f32>) -> f32 {
  var p = fract(p0 * vec2<f32>(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}
fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let s = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2<f32>(1.0, 0.0)), s.x),
             mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), s.x), s.y);
}
fn fbm(p0: vec2<f32>) -> f32 {
  var p = p0;
  var v = 0.0;
  var a = 0.5;
  for (var i = 0; i < 5; i = i + 1) { v = v + a * noise(p); p = p * 2.02; a = a * 0.5; }
  return v;
}

@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(vec2<f32>(-1.0, -1.0), vec2<f32>(3.0, -1.0), vec2<f32>(-1.0, 3.0));
  return vec4<f32>(pos[i], 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) c: vec4<f32>) -> @location(0) vec4<f32> {
  // WebGPU's origin is top-left; flip so both paths look identical.
  let uv = vec2<f32>(c.x / u.res.x, 1.0 - c.y / u.res.y);
  let aspect = u.res.x / u.res.y;
  let p = vec2<f32>(uv.x * aspect, uv.y) * 2.4;
  let t = u.time * 0.018;
  let q = vec2<f32>(fbm(p + t), fbm(p + vec2<f32>(5.2, 1.3) - t));
  let n = fbm(p + 1.6 * q + vec2<f32>(0.0, t * 2.0));

  let soot = vec3<f32>(0.03, 0.012, 0.011);
  let oxblood = vec3<f32>(0.15, 0.035, 0.03);
  let ember = vec3<f32>(0.42, 0.1, 0.065);
  var col = mix(soot, oxblood, vec3<f32>(smoothstep(0.2, 0.8, n)));
  col = mix(col, ember, vec3<f32>(smoothstep(0.55, 0.95, n) * 0.55));

  let shaft = smoothstep(0.55, 1.0, sin((uv.x - uv.y * 0.8) * 2.6 + u.time * 0.04) * 0.5 + 0.5);
  col = col + vec3<f32>(1.0, 0.55, 0.4) * shaft * 0.035 * (0.4 + n);

  let d = vec2<f32>((uv.x - u.pointer.x) * aspect, uv.y - u.pointer.y);
  col = col + vec3<f32>(0.95, 0.32, 0.22) * exp(-dot(d, d) * 5.0) * 0.05;

  col = col * (1.0 - 0.35 * pow(length(uv - vec2<f32>(0.5)), 2.0));
  return vec4<f32>(col, 1.0);
}`;

export type Frame = { width: number; height: number; time: number; px: number; py: number };
export type Renderer = { kind: "webgpu" | "webgl2"; draw: (f: Frame) => void; destroy: () => void };

// WebGPU isn't in TypeScript's DOM lib yet; this is the slice we touch.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

const UNIFORM = 0x40; // GPUBufferUsage.UNIFORM
const COPY_DST = 0x8; // GPUBufferUsage.COPY_DST

export async function createWebGPU(
  canvas: HTMLCanvasElement,
  onLost: () => void,
): Promise<Renderer | null> {
  const gpu: Any = (navigator as Any).gpu;
  if (!gpu) return null;
  try {
    const adapter = await gpu.requestAdapter({ powerPreference: "low-power" });
    // The fallback adapter is WebGPU running on the CPU: not worth it.
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) return null;
    const device = await adapter.requestDevice();
    device.lost?.then(onLost);

    const context: Any = canvas.getContext("webgpu");
    if (!context) return null;
    const format = gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const module = device.createShaderModule({ code: WGSL });
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module, entryPoint: "vs" },
      fragment: { module, entryPoint: "fs", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });
    const buffer = device.createBuffer({ size: 32, usage: UNIFORM | COPY_DST });
    const bind = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    const data = new Float32Array(8);

    return {
      kind: "webgpu",
      draw(f) {
        data[0] = f.width;
        data[1] = f.height;
        data[2] = f.time;
        data[4] = f.px;
        data[5] = f.py;
        device.queue.writeBuffer(buffer, 0, data);
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bind);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
      },
      destroy() {
        buffer.destroy?.();
        device.destroy?.();
      },
    };
  } catch {
    return null;
  }
}

function isSoftware(gl: WebGL2RenderingContext) {
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(
    gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
  ).toLowerCase();
  return /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/.test(renderer);
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function createWebGL2(
  canvas: HTMLCanvasElement,
  onLost: () => void,
): Renderer | null {
  // failIfMajorPerformanceCaveat makes the browser refuse a context it
  // would have to emulate in software; the renderer check catches the rest.
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl || isSoftware(gl)) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, GLSL_VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, GLSL_FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  canvas.addEventListener("webglcontextlost", onLost, { once: true });

  return {
    kind: "webgl2",
    draw(f) {
      gl.viewport(0, 0, f.width, f.height);
      gl.uniform2f(uRes, f.width, f.height);
      gl.uniform1f(uTime, f.time);
      gl.uniform2f(uPointer, f.px, f.py);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
