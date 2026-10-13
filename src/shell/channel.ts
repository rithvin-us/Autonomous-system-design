/** Cross-window sync between the audience view and the presenter window. */
export type DeckMessage =
  | { type: 'goto'; index: number; step: number }
  | { type: 'hello' }
  | { type: 'reset-view' }
  | { type: 'snapshot'; id: string; url: string };

const NAME = 'autonomous-systems-deck';

/** `?solo` in the URL opens an independent copy that neither follows nor drives other windows. */
const solo = new URLSearchParams(window.location.search).has('solo');

const channel: BroadcastChannel | null =
  !solo && typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(NAME) : null;

export function post(msg: DeckMessage) {
  channel?.postMessage(msg);
}

export function listen(fn: (msg: DeckMessage) => void): () => void {
  if (!channel) return () => {};
  const handler = (e: MessageEvent<DeckMessage>) => fn(e.data);
  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
}
