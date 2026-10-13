import { useEffect, useState } from 'react';
import { stepCount, stepLabels } from '../content/steps';
import { slides } from '../content/slides';
import { post } from './channel';
import { requestResetView } from './events';
import { IconNext, IconPrev } from './icons';
import { actionForKey } from './keys';
import { ScaledSlide } from './ScaledSlide';
import { SlideRenderer } from './SlideRenderer';
import { useDeck } from './useDeck';
import './presenter.css';

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const stepsOf = (i: number) => stepCount(slides[i]);

/**
 * Second window for the presenter (open with P). Follows and drives the
 * audience window; shows notes, what the next click does, the next slide
 * and a timer. The clicker works in either window.
 */
export function PresenterView() {
  const { index, step, go, next, prev, nextSlide, prevSlide } = useDeck(slides.length, stepsOf);
  const [start, setStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    post({ type: 'hello' });
    document.title = `Presenter · ${document.title}`;
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const action = actionForKey(e);
      if (!action) return;
      const handlers: Partial<Record<typeof action, () => void>> = {
        next,
        prev,
        nextSlide,
        prevSlide,
        first: () => go(0),
        last: () => go(slides.length - 1),
        reset: requestResetView,
      };
      const run = handlers[action];
      if (run) {
        e.preventDefault();
        run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, next, prev, nextSlide, prevSlide]);

  const slide = slides[index];
  const upcoming = slides[index + 1];
  const labels = stepLabels(slide);
  const nextClick = labels[step];

  return (
    <div className="presenter" data-theme="dark">
      <section className="p-current">
        <div className="p-label t-label">
          Now · {String(index + 1).padStart(2, '0')} / {slides.length}
          {labels.length > 0 && ` · step ${step} of ${labels.length}`}
        </div>
        <ScaledSlide className="p-frame">
          <SlideRenderer key={slide.id} slide={slide} index={index} mode="thumb" step={step} />
        </ScaledSlide>
      </section>

      <section className="p-side">
        <div className="p-label t-label">Next click</div>
        <div className="p-nextclick">
          {nextClick ?? (upcoming ? `Slide ${index + 2}: ${upcoming.title.replace(/\n/g, ' ')}` : 'End of deck')}
        </div>
        <div className="p-label t-label">Next slide</div>
        {upcoming ? (
          <ScaledSlide className="p-frame p-next">
            <SlideRenderer key={upcoming.id} slide={upcoming} index={index + 1} mode="thumb" />
          </ScaledSlide>
        ) : (
          <div className="p-frame p-next p-end">End of deck</div>
        )}
        <div className="p-label t-label">Notes</div>
        <div className="p-notes">{slide.notes}</div>
      </section>

      <footer className="p-bar">
        <button className="p-timer t-num" onClick={() => setStart(Date.now())} title="Click to restart timer">
          {fmt((now - start) / 1000)}
        </button>
        <span className="p-clock t-num">
          {new Date(now).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="p-nav">
          <button onClick={prev} aria-label="Back">
            <IconPrev />
          </button>
          <button onClick={next} aria-label="Forward">
            <IconNext />
          </button>
        </div>
      </footer>
    </div>
  );
}
