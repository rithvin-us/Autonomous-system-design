import { createContext, useContext } from 'react';
import type { Slide } from '../content/types';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** Current CSS scale of the 1920x1080 stage (1 = native size). */
export const StageScaleContext = createContext(1);
export const useStageScale = () => useContext(StageScaleContext);

export type RenderMode = 'live' | 'thumb';

export interface SlideCtx {
  slide: Slide;
  index: number;
  mode: RenderMode;
  /** Current build step (0 = as the slide first appears). */
  step: number;
  /** Change the build step (on-screen buttons use this; no-op in thumbnails). */
  setStep: (step: number) => void;
  /** Jump to another slide by id (no-op in thumbnails). */
  goTo: (id: string) => void;
}

export const SlideContext = createContext<SlideCtx | null>(null);

export function useSlide(): SlideCtx {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error('useSlide must be used inside a slide');
  return ctx;
}
