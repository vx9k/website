"use client";

import { useEffect, useRef, useState } from "react";

// The same slow forest-fog shader, written once per shading language.
// Tried in order: WebGPU -> WebGL2 -> CSS/DOM fallback. A software WebGL
// renderer (SwiftShader, llvmpipe, ...) counts as "no GPU" and falls back
// to the DOM, since rendering a full-screen shader on the CPU would cost
// far more than the CSS gradient it replaces.

const GLSL_VERTEX = `#version 300 es
void main() {
  vec2 pos[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const GLSL_FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * 3.0 + vec2(0.0, uTime * 0.02);
  float n = fbm(p + fbm(p + uTime * 0.01));

  vec3 deepShade = vec3(0.02, 0.035, 0.026);
  vec3 pine = vec3(0.05, 0.11, 0.075);
  vec3 col = mix(deepShade, pine, n);

  float beam = smoothstep(0.4, 0.9, sin((uv.x - uv.y) * 3.0 + uTime * 0.05) * 0.5 + 0.5);
  col = mix(col, vec3(0.85, 0.7, 0.42), beam * 0.045);

  fragColor = vec4(col, 1.0);
}`;

const WGSL_SHADER = `
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
  _pad: f32,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

fn hash(p0: vec2<f32>) -> f32 {
  var p = fract(p0 * vec2<f32>(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}
fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash(i);
  let b = hash(i + vec2<f32>(1.0, 0.0));
  let c = hash(i + vec2<f32>(0.0, 1.0));
  let d = hash(i + vec2<f32>(1.0, 1.0));
  let s = f * f * (3.0 - 2.0 * f);
  return mix(a, b, s.x) + (c - a) * s.y * (1.0 - s.x) + (d - b) * s.x * s.y;
}
fn fbm(p0: vec2<f32>) -> f32 {
  var p = p0;
  var v = 0.0;
  var amp = 0.5;
  for (var i = 0; i < 5; i = i + 1) {
    v = v + amp * noise(p);
    p = p * 2.0;
    amp = amp * 0.5;
  }
  return v;
}

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(3.0, -1.0),
    vec2<f32>(-1.0, 3.0)
  );
  return vec4<f32>(pos[idx], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) coord: vec4<f32>) -> @location(0) vec4<f32> {
  // WebGPU's framebuffer origin is top-left; flip to match the GLSL path.
  let uv = vec2<f32>(coord.x / u.resolution.x, 1.0 - coord.y / u.resolution.y);
  let p = uv * 3.0 + vec2<f32>(0.0, u.time * 0.02);
  let n = fbm(p + fbm(p + u.time * 0.01));

  let deepShade = vec3<f32>(0.02, 0.035, 0.026);
  let pine = vec3<f32>(0.05, 0.11, 0.075);
  var col = mix(deepShade, pine, vec3<f32>(n));

  let beam = smoothstep(0.4, 0.9, sin((uv.x - uv.y) * 3.0 + u.time * 0.05) * 0.5 + 0.5);
  col = mix(col, vec3<f32>(0.85, 0.7, 0.42), vec3<f32>(beam * 0.045));

  return vec4<f32>(col, 1.0);
}`;

// GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, spelled out because the
// WebGPU types aren't in TypeScript's default DOM lib.
const UNIFORM_COPY_DST = 0x40 | 0x8;

// Minimal structural types for the bits of WebGPU used here.
/* eslint-disable @typescript-eslint/no-explicit-any */
type GPU = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

type Stop = () => void;

function isSoftwareRenderer(gl: WebGL2RenderingContext) {
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  // Some browsers hide the renderer string; without it we assume hardware.
  if (!ext) return false;
  const renderer = String(
    gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
  ).toLowerCase();
  return /swiftshader|llvmpipe|softpipe|software|basic render/.test(renderer);
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function sizeCanvas(canvas: HTMLCanvasElement, dpr: number) {
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  const changed = canvas.width !== w || canvas.height !== h;
  if (changed) {
    canvas.width = w;
    canvas.height = h;
  }
  return changed;
}

function startWebGL2(canvas: HTMLCanvasElement, dpr: number): Stop | null {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl || isSoftwareRenderer(gl)) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, GLSL_VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, GLSL_FRAGMENT);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  gl.useProgram(program);

  let raf = 0;
  const frame = (t: number) => {
    if (sizeCanvas(canvas, dpr)) gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(raf);
}

async function startWebGPU(
  canvas: HTMLCanvasElement,
  dpr: number,
): Promise<Stop | null> {
  const gpu: GPU = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) return null;

  try {
    const adapter = await gpu.requestAdapter({ powerPreference: "low-power" });
    // A fallback adapter is WebGPU's software path; treat it like no GPU.
    if (!adapter || adapter.isFallbackAdapter || adapter.info?.isFallbackAdapter) {
      return null;
    }
    const device = await adapter.requestDevice();
    const context: GPU = canvas.getContext("webgpu");
    if (!context) return null;

    const format = gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const module = device.createShaderModule({ code: WGSL_SHADER });
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module, entryPoint: "vs_main" },
      fragment: { module, entryPoint: "fs_main", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });

    const uniforms = device.createBuffer({ size: 16, usage: UNIFORM_COPY_DST });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniforms } }],
    });
    const data = new Float32Array(4);

    let raf = 0;
    const frame = (t: number) => {
      sizeCanvas(canvas, dpr);
      data[0] = canvas.width;
      data[1] = canvas.height;
      data[2] = t * 0.001;
      device.queue.writeBuffer(uniforms, 0, data);

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
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
      device.queue.submit([encoder.finish()]);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      device.destroy?.();
    };
  } catch {
    return null;
  }
}

function prefersReducedMotion() {
  return (
    document.documentElement.getAttribute("data-motion") === "reduced" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CanopyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gpu, setGpu] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stop: Stop | null = null;
    let cancelled = false;
    let starting = false;
    // Cap resolution harder on small screens: the fog is soft enough that
    // full device resolution buys nothing but GPU and battery cost.
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 640 ? 1 : 1.5,
    );

    const halt = () => {
      stop?.();
      stop = null;
    };

    const start = async () => {
      if (stop || starting || prefersReducedMotion() || document.hidden) return;
      starting = true;
      const s = (await startWebGPU(canvas, dpr)) ?? startWebGL2(canvas, dpr);
      starting = false;
      if (cancelled) {
        s?.();
        return;
      }
      stop = s;
      setGpu(Boolean(s));
    };

    // Pause while the tab is hidden, resume when it comes back.
    const onVisibility = () => (document.hidden ? halt() : start());

    // React to the in-app motion toggle and the OS setting at runtime.
    const onMotionChange = () => {
      if (prefersReducedMotion()) {
        halt();
        setGpu(false);
      } else {
        start();
      }
    };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new MutationObserver(onMotionChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener("change", onMotionChange);
    start();

    return () => {
      cancelled = true;
      halt();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="canopy-fallback absolute inset-0" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          gpu ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
