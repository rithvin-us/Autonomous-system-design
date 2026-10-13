import { useCallback, useEffect, useRef, useState } from 'react';
import { listen, post } from './channel';

function readHash(count: number): number {
  const n = parseInt(window.location.hash.replace(/^#\/?/, ''), 10);
  return Number.isFinite(n) ? Math.min(count - 1, Math.max(0, n - 1)) : 0;
}

export interface DeckPosition {
  index: number;
  step: number;
}

/**
 * Current slide and build step. The slide number is kept in the URL hash
 * (#7 = slide 7); both are mirrored to other open windows (presenter view)
 * over BroadcastChannel.
 *
 * next/prev walk through a slide's steps before changing slide, like a
 * PowerPoint clicker. Going back lands on the previous slide fully built.
 */
export function useDeck(count: number, stepsOf: (index: number) => number) {
  const [pos, setPos] = useState<DeckPosition>(() => ({ index: readHash(count), step: 0 }));
  const posRef = useRef(pos);
  posRef.current = pos;
  const stepsRef = useRef(stepsOf);
  stepsRef.current = stepsOf;

  const apply = useCallback(
    (next: DeckPosition, broadcast = true) => {
      const index = Math.min(count - 1, Math.max(0, next.index));
      const step = Math.min(stepsRef.current(index), Math.max(0, next.step));
      const cur = posRef.current;
      if (cur.index === index && cur.step === step) return;
      posRef.current = { index, step };
      setPos({ index, step });
      if (broadcast) post({ type: 'goto', index, step });
    },
    [count],
  );

  /** Jump to a slide at its first step. */
  const go = useCallback((index: number) => apply({ index, step: 0 }), [apply]);

  const setStep = useCallback((step: number) => apply({ index: posRef.current.index, step }), [apply]);

  const next = useCallback(() => {
    const { index, step } = posRef.current;
    if (step < stepsRef.current(index)) apply({ index, step: step + 1 });
    else apply({ index: index + 1, step: 0 });
  }, [apply]);

  const prev = useCallback(() => {
    const { index, step } = posRef.current;
    if (step > 0) apply({ index, step: step - 1 });
    else if (index > 0) apply({ index: index - 1, step: stepsRef.current(index - 1) });
  }, [apply]);

  const nextSlide = useCallback(() => apply({ index: posRef.current.index + 1, step: 0 }), [apply]);
  const prevSlide = useCallback(() => apply({ index: posRef.current.index - 1, step: 0 }), [apply]);

  useEffect(() => {
    const hash = `#${pos.index + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [pos.index]);

  useEffect(() => {
    const onHash = () => apply({ index: readHash(count), step: 0 });
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [apply, count]);

  useEffect(
    () =>
      listen((msg) => {
        if (msg.type === 'goto') apply({ index: msg.index, step: msg.step }, false);
        if (msg.type === 'hello') post({ type: 'goto', ...posRef.current });
      }),
    [apply],
  );

  return { index: pos.index, step: pos.step, go, setStep, next, prev, nextSlide, prevSlide };
}
