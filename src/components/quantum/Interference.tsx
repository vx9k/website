"use client";

import { useEffect, useRef } from "react";
import { tree } from "@/quantum/branches";
import { seeded } from "@/quantum/seed";

// Interference: three wave sources, each summing sin(k·r − ωt), drawn as
// faint bright fringes where they add up and dark where they cancel. One
// source follows the pointer (or, on touch, the scroll); the other two sit
// where the current branch puts them, so every branch has its own pattern.
// Raw WebGL, one full-screen triangle, a fragment shader and a handful of
// uniforms; this chunk only loads when the effect is on.

const vertex = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const fragment = `
precision mediump float;
uniform vec2 size;
uniform float time;
uniform vec2 src[3];
uniform float k[3];
uniform float amp;
void main() {
  vec2 uv = gl_FragCoord.xy / size;
  vec2 p = vec2(uv.x * size.x / size.y, uv.y);
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 c = vec2(src[i].x * size.x / size.y, src[i].y);
    float r = distance(p, c);
    s += sin(k[i] * r - time * 1.1 + float(i) * 2.1) / (1.0 + r * 1.6);
  }
  // Intensity is the square of the summed amplitude: bright fringes where
  // the waves agree, dark where they cancel.
  float v = clamp(s * s / 3.0, 0.0, 1.0);
  // Strongest over the top of the screen, like the mesh.
  float a = v * amp * mix(0.35, 1.0, uv.y);
  gl_FragColor = vec4(vec3(a), a);
}`;

type Props = { still: boolean };

export default function Interference({ still }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const gl = el?.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" });
    if (!el || !gl) return;

    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle that covers the screen.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uSize = u("size"), uTime = u("time"), uSrc = u("src"), uK = u("k"), uAmp = u("amp");
    gl.uniform1f(uAmp, 0.03);

    // The branch's own layout of the two fixed sources and every wavenumber.
    const layout = (id: string | null) => {
      const random = seeded(`waves:${id ?? ""}`);
      return {
        src: [0.15 + random() * 0.7, 0.55 + random() * 0.4, 0.15 + random() * 0.7, 0.2 + random() * 0.6],
        k: [38 + random() * 18, 30 + random() * 20, 34 + random() * 22],
      };
    };
    let target = layout(tree.get().current);
    const shown = { ...target, src: [...target.src] };
    const stopTree = tree.subscribe(() => {
      target = layout(tree.get().current);
      gl.uniform1fv(uK, target.k);
    });
    gl.uniform1fv(uK, target.k);

    // The moving source: the pointer, or failing that the scroll.
    const lead = { x: 0.5, y: 0.8 };
    let pointer: { x: number; y: number } | null = null;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || still) return;
      pointer = { x: event.clientX / innerWidth, y: 1 - event.clientY / innerHeight };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Adaptive resolution: a fraction of the screen's pixels, lowered when
    // frames run long and raised again when there's room.
    let scale = Math.min(window.devicePixelRatio || 1, 1) * 0.5;
    const resize = () => {
      el.width = Math.max(1, Math.round(innerWidth * scale));
      el.height = Math.max(1, Math.round(innerHeight * scale));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uSize, el.width, el.height);
    };
    resize();
    window.addEventListener("resize", resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let frame = 0;
    let last = 0;
    let slow = 0;
    let fast = 0;
    function draw(now: number) {
      const want = pointer ?? { x: 0.5, y: 0.85 - Math.min(1, scrollY / innerHeight) * 0.6 };
      const ease = still ? 1 : 0.08;
      lead.x += (want.x - lead.x) * ease;
      lead.y += (want.y - lead.y) * ease;
      for (let i = 0; i < 4; i++) shown.src[i] += (target.src[i] - shown.src[i]) * (still ? 1 : 0.04);
      gl!.uniform2fv(uSrc, [lead.x, lead.y, ...shown.src]);
      gl!.uniform1f(uTime, still ? 0 : now / 1000);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function loop(now: number) {
      const dt = last ? now - last : 16;
      last = now;
      if (dt > 24) slow++;
      else if (dt < 14) fast++;
      if (slow > 20 && scale > 0.2) {
        scale *= 0.75;
        resize();
        slow = fast = 0;
      } else if (fast > 120 && scale < 0.75) {
        scale = Math.min(0.75, scale * 1.15);
        resize();
        slow = fast = 0;
      }
      draw(now);
      frame = requestAnimationFrame(loop);
    }

    // Runs only while the tab is visible; with less motion asked for, it
    // draws one still frame and leaves it.
    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (still) draw(0);
      else if (!document.hidden) frame = requestAnimationFrame(loop);
    };
    const onVisible = () => (document.hidden ? cancelAnimationFrame(frame) : start());
    document.addEventListener("visibilitychange", onVisible);
    start();

    return () => {
      cancelAnimationFrame(frame);
      stopTree();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisible);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [still]);

  return <canvas ref={canvas} aria-hidden className="interference" />;
}
