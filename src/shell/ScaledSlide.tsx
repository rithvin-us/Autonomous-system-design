import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { STAGE_H, STAGE_W, StageScaleContext } from './contexts';

/**
 * Renders a 1920x1080 stage scaled to fit its parent, letterboxed and centred.
 * Used for the main view, overview thumbnails and the presenter window.
 */
export function ScaledSlide({ children, className }: { children: ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 0, x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const scale = Math.min(w / STAGE_W, h / STAGE_H);
      setBox({ scale, x: (w - STAGE_W * scale) / 2, y: (h - STAGE_H * scale) / 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={host} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {box.scale > 0 && (
        <div
          className="stage"
          style={{ transform: `translate(${box.x}px, ${box.y}px) scale(${box.scale})` }}
        >
          <StageScaleContext.Provider value={box.scale}>{children}</StageScaleContext.Provider>
        </div>
      )}
    </div>
  );
}
