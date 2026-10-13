import { useSyncExternalStore } from 'react';
import { listen, post } from './channel';

/**
 * Still images of 3D slides, captured the first time each one is shown live.
 * Thumbnails (overview, presenter window) use them instead of running WebGL.
 */
const store = new Map<string, string>();
const subscribers = new Set<() => void>();

function emit() {
  for (const fn of subscribers) fn();
}

export function saveSnapshot(id: string, url: string, broadcast = true) {
  store.set(id, url);
  emit();
  if (broadcast) post({ type: 'snapshot', id, url });
}

export function hasSnapshot(id: string) {
  return store.has(id);
}

export function allSnapshots() {
  return store;
}

listen((msg) => {
  if (msg.type === 'snapshot') saveSnapshot(msg.id, msg.url, false);
  if (msg.type === 'hello') for (const [id, url] of store) post({ type: 'snapshot', id, url });
});

export function useSnapshot(id: string): string | undefined {
  return useSyncExternalStore(
    (fn) => {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    () => store.get(id),
  );
}
