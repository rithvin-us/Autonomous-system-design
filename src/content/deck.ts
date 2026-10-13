import type { AssetStatus } from './types';

/** Deck-wide settings. */
export const deck = {
  title: 'System Design & Architecture in Autonomous Systems',
  /** Show the small "illustrative / placeholder" tags on hardware visuals. */
  showAssetTags: true,
  /** Slide change fade in ms (0 = instant). */
  transitionMs: 260,
  /** Hide the mouse cursor after this many ms without movement. */
  cursorHideMs: 2500,

  /**
   * Vehicle used on slides 01, 02, 20 and 24.
   * Set `glb` to a file in /public/models (millimetres, +Z forward, Y up)
   * to replace the built-in illustrative buggy.
   */
  vehicle: {
    glb: undefined as string | undefined,
    glbTransform: { scale: 1, rotation: [0, 0, 0] as [number, number, number] },
    status: 'illustrative' as AssetStatus,
    statusNote: 'Illustrative vehicle · team buggy model pending',
  },
};
