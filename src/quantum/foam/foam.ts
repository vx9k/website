// Loads the foam's WebAssembly module (foam.wat, built to
// public/quantum/foam.wasm) and seeds it from crypto.getRandomValues: the
// browser's cryptographic generator, fed by the operating system's
// entropy, so no two visits fizz alike. The CSP allows WebAssembly with
// 'wasm-unsafe-eval' and nothing else.

export type Foam = {
  /** Moves every pair to `now` (seconds) and returns their vec4s. */
  step(now: number, count: number): Float32Array;
};

type Exports = {
  memory: WebAssembly.Memory;
  seed(a: number, b: number, c: number, d: number): void;
  step(now: number, count: number): void;
};

export async function loadFoam(): Promise<Foam | null> {
  try {
    const response = fetch("/quantum/foam.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(response).catch(async () =>
      WebAssembly.instantiate(await (await fetch("/quantum/foam.wasm")).arrayBuffer()),
    );
    const wasm = instance.exports as unknown as Exports;
    const [a, b, c, d] = crypto.getRandomValues(new Uint32Array(4));
    wasm.seed(a | 0, b | 0, c | 0, d | 0);
    return {
      step(now, count) {
        wasm.step(now, count);
        return new Float32Array(wasm.memory.buffer, 0, count * 4);
      },
    };
  } catch {
    return null;
  }
}
