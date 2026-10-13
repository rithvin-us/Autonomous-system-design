import type { Theme } from '../content/types';
import { IconNext, IconPrev } from './icons';

const pad = (n: number) => String(n).padStart(2, '0');

/** Counter, previous/next buttons (the only on-screen controls) and progress line. */
export function Controls({
  index,
  count,
  step,
  steps,
  theme,
  onPrev,
  onNext,
}: {
  index: number;
  count: number;
  step: number;
  steps: number;
  theme: Theme;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <nav className="chrome" data-theme={theme} aria-label="Slide navigation">
      <div className="progress" aria-hidden>
        <div className="progress-fill" style={{ width: `${((index + 1) / count) * 100}%` }} />
      </div>
      <div className="nav">
        {steps > 0 && (
          <div className="steps" aria-label={`Step ${step} of ${steps}`}>
            {Array.from({ length: steps }, (_, i) => (
              <span key={i} className={i < step ? 'is-done' : ''} />
            ))}
          </div>
        )}
        <button
          className="nav-btn"
          onClick={onPrev}
          disabled={index === 0 && step === 0}
          aria-label="Previous slide"
          title="Previous (←)"
        >
          <IconPrev />
        </button>
        <span className="counter t-num" aria-live="polite">
          <span className="counter-now">{pad(index + 1)}</span>
          <span className="counter-sep">/</span>
          {pad(count)}
        </span>
        <button
          className="nav-btn"
          onClick={onNext}
          disabled={index === count - 1 && step === steps}
          aria-label="Next slide"
          title="Next (→ or Space)"
        >
          <IconNext />
        </button>
      </div>
    </nav>
  );
}
