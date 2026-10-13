import { useCallback, useEffect, useRef, useState } from 'react';
import { deck } from '../content/deck';
import { slides } from '../content/slides';
import { Controls } from './Controls';
import { NotesPanel } from './NotesPanel';
import { OVERVIEW_COLS, Overview } from './Overview';
import { ScaledSlide } from './ScaledSlide';
import { SlideRenderer } from './SlideRenderer';
import { useDeck } from './useDeck';
import { requestResetView } from './events';
import { actionForKey, SHORTCUTS } from './keys';
import { stepCount, stepLabels } from '../content/steps';
import './shell.css';

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function openPresenterWindow() {
  const url = `${window.location.pathname}?presenter${window.location.hash}`;
  window.open(url, 'deck-presenter', 'width=1400,height=860');
}

export function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.();
}

const stepsOf = (i: number) => stepCount(slides[i]);

export function Presentation() {
  const { index, step, go, setStep, next, prev, nextSlide, prevSlide } = useDeck(slides.length, stepsOf);
  const [overview, setOverview] = useState(false);
  const [selected, setSelected] = useState(index);
  const [notes, setNotes] = useState(false);
  const [help, setHelp] = useState(false);
  const [black, setBlack] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const firstRender = useRef(true);

  const slide = slides[index];

  const goTo = useCallback(
    (id: string) => {
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) go(i);
    },
    [go],
  );

  const openOverview = useCallback(() => {
    setSelected(index);
    setOverview(true);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const k = e.key;

      if (overview) {
        const n = slides.length;
        const moves: Record<string, number> = {
          ArrowRight: 1,
          ArrowLeft: -1,
          ArrowDown: OVERVIEW_COLS,
          ArrowUp: -OVERVIEW_COLS,
          PageDown: 1,
          PageUp: -1,
        };
        if (k in moves) {
          e.preventDefault();
          setSelected((s) => Math.min(n - 1, Math.max(0, s + moves[k])));
        } else if (k === 'Enter' || k === ' ') {
          e.preventDefault();
          go(selected);
          setOverview(false);
        } else if (k === 'Escape' || k === 'o' || k === 'O') {
          e.preventDefault();
          setOverview(false);
        }
        return;
      }

      const action = actionForKey(e);
      if (!action) return;
      if (action !== 'escape') e.preventDefault();
      // Like PowerPoint: any key while blacked out just returns to the slide.
      if (black && action !== 'black') {
        setBlack(false);
        return;
      }

      switch (action) {
        case 'next':
          next();
          break;
        case 'prev':
          prev();
          break;
        case 'nextSlide':
          nextSlide();
          break;
        case 'prevSlide':
          prevSlide();
          break;
        case 'first':
          go(0);
          break;
        case 'last':
          go(slides.length - 1);
          break;
        case 'overview':
          openOverview();
          break;
        case 'escape':
          setHelp(false);
          setNotes(false);
          break;
        case 'notes':
          setNotes((v) => !v);
          break;
        case 'presenter':
          openPresenterWindow();
          break;
        case 'reset':
          requestResetView();
          break;
        case 'fullscreen':
          toggleFullscreen();
          break;
        case 'black':
          setBlack((v) => !v);
          break;
        case 'help':
          setHelp((v) => !v);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overview, selected, black, go, next, prev, nextSlide, prevSlide, openOverview]);

  // Hide the cursor when the mouse is idle.
  useEffect(() => {
    let timer = 0;
    const wake = () => {
      setCursorHidden(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCursorHidden(true), deck.cursorHideMs);
    };
    wake();
    window.addEventListener('pointermove', wake);
    window.addEventListener('pointerdown', wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', wake);
      window.removeEventListener('pointerdown', wake);
    };
  }, []);

  // Block page scrolling from wheel and touch everywhere except inside 3D views.
  useEffect(() => {
    const stop = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest('canvas')) e.preventDefault();
    };
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
    };
  }, []);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <div className={`viewport${cursorHidden && !overview ? ' hide-cursor' : ''}`}>
      <ScaledSlide className="viewport-fit">
        <SlideRenderer
          key={slide.id}
          slide={slide}
          index={index}
          mode="live"
          step={step}
          setStep={setStep}
          goTo={goTo}
          entering={!firstRender.current && deck.transitionMs > 0}
        />
        <Controls
          index={index}
          count={slides.length}
          step={step}
          steps={stepCount(slide)}
          theme={slide.theme}
          onPrev={prev}
          onNext={next}
        />
        {notes && (
          <NotesPanel
            slide={slide}
            next={slides[index + 1]}
            index={index}
            count={slides.length}
            nextClick={stepLabels(slide)[step] ?? null}
          />
        )}
        {help && (
          <div className="help" data-theme="dark" onClick={() => setHelp(false)}>
            <div className="t-label help-title">Keyboard</div>
            <dl>
              {SHORTCUTS.map(([keys, what]) => (
                <div key={keys} className="help-row">
                  <dt>{keys}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {overview && (
          <Overview
            slides={slides}
            current={index}
            selected={selected}
            onSelect={setSelected}
            onOpen={(i) => {
              go(i);
              setOverview(false);
            }}
          />
        )}
        {black && <div className="blackout" onClick={() => setBlack(false)} />}
      </ScaledSlide>
    </div>
  );
}
