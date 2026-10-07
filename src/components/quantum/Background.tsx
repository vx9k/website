"use client";

import { useEffect, useRef } from "react";
import { tree } from "@/quantum/branches";
import { loadFoam, type Foam } from "@/quantum/foam/foam";
import { glslFragment, glslVertex, pairs, vectors, wgsl } from "@/quantum/foam/shaders";
import { seeded } from "@/quantum/seed";

// The background behind the page: the interference of three wave sources,
// and the quantum foam. One canvas, fixed to the viewport, drawn with
// WebGPU where the browser has it and WebGL where it doesn't; both run
// the same shader (src/quantum/foam/shaders.ts). The foam's pairs come
// from a WebAssembly module seeded by crypto.getRandomValues. This chunk
// only loads when one of the two effects is on, and only in today's world.

type Draw = (data: Float32Array<ArrayBuffer>, width: number, height: number) => void;
type Renderer = { kind: "webgpu" | "webgl"; draw: Draw; stop(): void };

async function webgpu(canvas: HTMLCanvasElement): Promise<Renderer | null> {
  const adapter = await navigator.gpu?.requestAdapter({ powerPreference: "low-power" });
  const device = await adapter?.requestDevice();
  // TypeScript's DOM types know WebGPU's objects but not this overload.
  const ctx = device && (canvas.getContext("webgpu") as GPUCanvasContext | null);
  if (!device || !ctx) return null;
  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({ device, format, alphaMode: "premultiplied" });
  const module = device.createShaderModule({ code: wgsl });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module, entryPoint: "vs" },
    fragment: { module, entryPoint: "fs", targets: [{ format }] },
    primitive: { topology: "triangle-list" },
  });
  // GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, which the types
  // don't declare as values.
  const buffer = device.createBuffer({ size: vectors * 16, usage: 0x40 | 0x8 });
  const group = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer } }] });
  return {
    kind: "webgpu",
    draw(data) {
      device.queue.writeBuffer(buffer, 0, data);
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          { view: ctx.getCurrentTexture().createView(), loadOp: "clear", clearValue: [0, 0, 0, 0], storeOp: "store" },
        ],
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, group);
      pass.draw(3);
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    stop: () => device.destroy(),
  };
}

function webgl(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) return null;
  const compile = (type: number, code: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, glslVertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, glslFragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const u = gl.getUniformLocation(program, "u");
  return {
    kind: "webgl",
    draw(data, width, height) {
      gl.viewport(0, 0, width, height);
      gl.uniform4fv(u, data);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    stop: () => gl.getExtension("WEBGL_lose_context")?.loseContext(),
  };
}

export default function Background({ waves, foam, still }: { waves: boolean; foam: boolean; still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const el: HTMLCanvasElement = node;
    let alive = true;
    let stop = () => {};

    (async () => {
      // ?renderer=webgl skips WebGPU, to compare the two.
      const forced = new URLSearchParams(location.search).get("renderer") === "webgl";
      const renderer = (forced ? null : await webgpu(el).catch(() => null)) ?? webgl(el);
      const pool: Foam | null = foam ? await loadFoam() : null;
      if (!alive || !renderer) return renderer?.stop();
      el.dataset.renderer = renderer.kind;

      const data = new Float32Array(vectors * 4);
      // A little randomness per visit as well: the waves' phases.
      const phases = crypto.getRandomValues(new Uint32Array(3));
      const phase = (i: number) => (phases[i] / 2 ** 32) * Math.PI * 2;

      // Where the current branch puts the two fixed sources, and every
      // wavenumber, eased into whenever the branch changes.
      const layout = (id: string | null) => {
        const random = seeded(`waves:${id ?? ""}`);
        return {
          src: [0.15 + random() * 0.7, 0.55 + random() * 0.4, 0.15 + random() * 0.7, 0.2 + random() * 0.6],
          k: [38 + random() * 18, 30 + random() * 20, 34 + random() * 22],
        };
      };
      let target = layout(tree.get().current);
      const shown = { src: [...target.src], k: [...target.k] };
      const stopTree = tree.subscribe(() => (target = layout(tree.get().current)));

      // The moving source: the pointer, or failing that the scroll.
      const lead = { x: 0.5, y: 0.8 };
      let pointer: { x: number; y: number } | null = null;
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch" || still) return;
        pointer = { x: event.clientX / innerWidth, y: 1 - event.clientY / innerHeight };
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // Adaptive resolution: a fraction of the screen's pixels, lowered
      // when frames run long and raised when there's room.
      let scale = Math.min(window.devicePixelRatio || 1, 1) * 0.5;
      const resize = () => {
        el.width = Math.max(1, Math.round(innerWidth * scale));
        el.height = Math.max(1, Math.round(innerHeight * scale));
      };
      resize();
      window.addEventListener("resize", resize);

      function draw(now: number) {
        const want = pointer ?? { x: 0.5, y: 0.85 - Math.min(1, scrollY / innerHeight) * 0.6 };
        const ease = still ? 1 : 0.08;
        lead.x += (want.x - lead.x) * ease;
        lead.y += (want.y - lead.y) * ease;
        for (let i = 0; i < 4; i++) shown.src[i] += (target.src[i] - shown.src[i]) * (still ? 1 : 0.04);
        for (let i = 0; i < 3; i++) shown.k[i] += (target.k[i] - shown.k[i]) * (still ? 1 : 0.04);
        const t = still ? 0 : now / 1000;
        data.set([el.width, el.height, t, waves ? 0.03 : 0], 0);
        data.set([foam && pool ? 0.09 : 0, 0, 0, 0], 4);
        data.set([lead.x, lead.y, shown.src[0], shown.src[1]], 8);
        data.set([shown.src[2], shown.src[3], phase(1), phase(2)], 12);
        data.set([...shown.k, phase(0)], 16);
        if (pool) data.set(pool.step(still ? 1 : now / 1000, pairs), 20);
        renderer!.draw(data, el.width, el.height);
      }

      let frame = 0;
      let last = 0;
      let slow = 0;
      let fast = 0;
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

      // Only while the tab is visible; with less motion asked for, one
      // still frame.
      const start = () => {
        cancelAnimationFrame(frame);
        last = 0;
        if (still) draw(0);
        else if (!document.hidden) frame = requestAnimationFrame(loop);
      };
      const onVisible = () => (document.hidden ? cancelAnimationFrame(frame) : start());
      document.addEventListener("visibilitychange", onVisible);
      start();

      stop = () => {
        cancelAnimationFrame(frame);
        stopTree();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisible);
        renderer!.stop();
      };
    })();

    return () => {
      alive = false;
      stop();
    };
  }, [waves, foam, still]);

  // Keyed by what's on, so a change gets a fresh canvas: a canvas keeps
  // the first kind of context it was asked for.
  return <canvas key={`${waves}${foam}${still}`} ref={canvas} aria-hidden className="quantum-background" />;
}
