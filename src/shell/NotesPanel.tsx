import type { Slide } from '../content/types';

/** Presenter-only notes drawer (N). Hidden unless opened. */
export function NotesPanel({
  slide,
  next,
  index,
  count,
  nextClick,
}: {
  slide: Slide;
  next?: Slide;
  index: number;
  count: number;
  /** What the next clicker press reveals on this slide, if anything. */
  nextClick: string | null;
}) {
  return (
    <aside className="notes-panel" data-theme="dark" aria-label="Presenter notes">
      <div className="notes-head">
        <span className="t-label">Notes</span>
        <span className="t-num notes-count">
          {String(index + 1).padStart(2, '0')} / {count}
        </span>
      </div>
      <h2 className="notes-title">{slide.title.replace(/\n/g, ' ')}</h2>
      <div className="notes-body">{slide.notes}</div>
      <div className="notes-next">
        <span className="t-label">Next click</span>
        <span>{nextClick ?? (next ? `Slide: ${next.title.replace(/\n/g, ' ')}` : 'End of deck')}</span>
      </div>
      <div className="notes-keys">N to close · P for presenter window</div>
    </aside>
  );
}
