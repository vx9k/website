import { useSyncExternalStore } from "react";

// A value that client components can read with useStore and plain modules
// can read and change directly. The quantum layer keeps its state in a few
// of these instead of a React context, so nothing has to wrap the
// server-rendered page.
export type Store<T> = {
  get(): T;
  set(next: T): void;
  subscribe(listener: () => void): () => void;
  /** The value on the server and in the first render, before any browser
   *  state is read, so hydration matches the HTML. */
  initial: T;
};

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    initial,
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}
