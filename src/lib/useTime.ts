import { useEffect, useRef, useState } from 'react';
import { useSlide } from '../shell/contexts';

/**
 * Seconds since the visual mounted, updated every animation frame.
 * Thumbnails get a fixed time so they render one representative frame.
 * Stops automatically when the slide unmounts or the tab is hidden.
 */
export function useTime(thumbTime = 2, paused = false): number {
  const { mode } = useSlide();
  const [t, setT] = useState(mode === 'thumb' ? thumbTime : 0);
  const base = useRef<number | null>(null);
  const offset = useRef(0);

  useEffect(() => {
    if (mode === 'thumb' || paused) {
      base.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (base.current === null) base.current = now - offset.current * 1000;
      const s = (now - base.current) / 1000;
      offset.current = s;
      setT(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      base.current = null;
    };
  }, [mode, paused]);

  return mode === 'thumb' ? thumbTime : t;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** 0→1 progress of t within [a, b]. */
export const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
