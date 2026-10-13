import { useState } from 'react';
import { useSlide } from '../shell/contexts';
import type { VisualProps } from './registry';
import './types.css';

const base = import.meta.env.BASE_URL;

function Photo({ src, focus, label }: { src: string; focus?: string; label: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className="types-missing">
        <span>Add photo</span>
        <code>public/{src}</code>
      </div>
    );
  }
  return (
    <img
      className="types-photo"
      src={`${base}${src}`}
      alt={label}
      style={{ objectPosition: focus ?? '50% 50%' }}
      onError={() => setMissing(true)}
      draggable={false}
    />
  );
}

/**
 * Slide 04: four kinds of autonomous machine as photos in one row, widths
 * set per photo in slides.ts. Clicker steps spotlight each in turn.
 */
export default function SystemTypes({ visual }: VisualProps<'systemTypes'>) {
  const { step } = useSlide();
  const active = step - 1;
  const columns = visual.items.map((it) => `${it.width}fr`).join(' ');

  return (
    <>
      <ol className="types-row" style={{ gridTemplateColumns: columns }}>
        {visual.items.map((it, i) => (
          <li key={it.id} className={i === active ? 'is-active' : active >= 0 ? 'is-dim' : ''}>
            <div className="types-frame">
              <Photo src={it.image} focus={it.focus} label={it.label} />
            </div>
            <div className="types-label">{it.label}</div>
            {(it.detail || it.credit) && <div className="types-note">{[it.detail, it.credit].filter(Boolean).join(' · ')}</div>}
          </li>
        ))}
      </ol>
      <div className="types-shared">
        <span>{visual.shared}</span>
      </div>
    </>
  );
}
