import { Suspense, type ComponentType } from 'react';
import type { Slide, Visual } from '../content/types';
import { SlideFrame } from '../layouts/SlideFrame';
import { ErrorBoundary } from '../lib/ErrorBoundary';
import { visuals } from '../visuals/registry';
import { SlideContext, type RenderMode } from './contexts';

const noop = () => {};

export function SlideRenderer({
  slide,
  index,
  mode,
  step = 0,
  setStep = noop,
  goTo = noop,
  entering,
}: {
  slide: Slide;
  index: number;
  mode: RenderMode;
  step?: number;
  setStep?: (step: number) => void;
  goTo?: (id: string) => void;
  entering?: boolean;
}) {
  const VisualComponent = visuals[slide.visual.kind] as ComponentType<{ visual: Visual }>;
  return (
    <SlideContext.Provider value={{ slide, index, mode, step, setStep, goTo }}>
      <SlideFrame slide={slide} entering={entering}>
        <ErrorBoundary key={slide.id} fallback={null}>
          <Suspense fallback={null}>
            <VisualComponent visual={slide.visual} />
          </Suspense>
        </ErrorBoundary>
      </SlideFrame>
    </SlideContext.Provider>
  );
}
