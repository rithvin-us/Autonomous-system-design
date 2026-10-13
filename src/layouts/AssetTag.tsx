import type { CSSProperties } from 'react';
import { deck } from '../content/deck';
import type { AssetStatus } from '../content/types';

/** Discloses whether a hardware model is verified, illustrative or a placeholder. */
export function AssetTag({
  status,
  note,
  style,
}: {
  status: AssetStatus;
  note: string;
  style?: CSSProperties;
}) {
  if (!deck.showAssetTags || status === 'verified') return null;
  return (
    <div className="asset-tag" data-status={status} style={style}>
      {note}
    </div>
  );
}
