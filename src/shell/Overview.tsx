import { useEffect, useRef } from 'react';
import type { Slide } from '../content/types';
import { SlideRenderer } from './SlideRenderer';
import { STAGE_H, STAGE_W } from './contexts';

const COLS = 6;
const THUMB_W = 250;
const SCALE = THUMB_W / STAGE_W;
const THUMB_H = STAGE_H * SCALE;

/** Grid of every slide. Arrows move, Enter opens, Esc or O returns. */
export function Overview({
  slides,
  current,
  selected,
  onSelect,
  onOpen,
}: {
  slides: Slide[];
  current: number;
  selected: number;
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    grid.current?.querySelector<HTMLElement>(`[data-i="${selected}"]`)?.focus({ preventScroll: true });
  }, [selected]);

  return (
    <div className="overview" data-theme="dark" role="dialog" aria-label="All slides">
      <div className="overview-head">
        <span className="t-label">All slides</span>
        <span className="overview-hint">Arrows to move · Enter to open · Esc to return</span>
      </div>
      <div
        ref={grid}
        className="overview-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${THUMB_W}px)` }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            data-i={i}
            className={`thumb${i === current ? ' is-current' : ''}${i === selected ? ' is-selected' : ''}`}
            style={{ width: THUMB_W, height: THUMB_H }}
            onClick={() => onOpen(i)}
            onMouseEnter={() => onSelect(i)}
            aria-label={`Slide ${i + 1}: ${s.title.replace(/\n/g, ' ')}`}
          >
            <div className="thumb-stage" style={{ transform: `scale(${SCALE})` }}>
              <SlideRenderer slide={s} index={i} mode="thumb" />
            </div>
            <span className="thumb-num t-num">{String(i + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const OVERVIEW_COLS = COLS;
