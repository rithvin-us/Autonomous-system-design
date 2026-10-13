import type { CSSProperties } from 'react';
import type { Labelled } from '../content/types';

/**
 * Numbered stage strip along the bottom of a scenario slide; the active
 * stage (set by the clicker step) is highlighted.
 */
export function PhaseStrip({ items, active, style }: { items: Labelled[]; active: number; style?: CSSProperties }) {
  return (
    <ol className="phase-strip" style={style}>
      {items.map((it, i) => (
        <li key={it.label} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
          <div className="phase-cell">
            <span className="phase-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="phase-label">{it.label}</span>
            {it.detail && <span className="phase-detail">{it.detail}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
