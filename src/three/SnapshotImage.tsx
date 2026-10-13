import type { CSSProperties } from 'react';
import { useSnapshot } from '../shell/snapshots';

/**
 * Thumbnail stand-in for a 3D view: the captured still if the slide has been
 * shown, otherwise a quiet outline so the layout still reads.
 */
export function SnapshotImage({ id, style }: { id: string; style?: CSSProperties }) {
  const url = useSnapshot(id);
  return (
    <div className="model-stage" style={style}>
      {url ? (
        <img className="snapshot-img" src={url} alt="" />
      ) : (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <g fill="none" stroke="var(--line)" strokeWidth="0.6">
            <path d="M50 28 L72 40 L72 62 L50 74 L28 62 L28 40 Z" />
            <path d="M28 40 L50 52 L72 40 M50 52 L50 74" />
          </g>
        </svg>
      )}
    </div>
  );
}
