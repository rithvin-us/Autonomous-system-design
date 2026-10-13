import type { ReactNode } from 'react';
import type { Slide } from '../content/types';
import './layouts.css';

/** Heading block + visual area, arranged by the slide's layout. */
export function SlideFrame({
  slide,
  children,
  entering,
}: {
  slide: Slide;
  children: ReactNode;
  entering?: boolean;
}) {
  const titleStyle = slide.titleSize ? { fontSize: slide.titleSize } : undefined;
  return (
    <section
      className={`slide l-${slide.layout}${entering ? ' is-entering' : ''}`}
      data-theme={slide.theme}
      aria-roledescription="slide"
      aria-label={slide.title.replace(/\n/g, ' ')}
    >
      <div className="visual">{children}</div>
      {!slide.hideHeading && (
        <header className="heading">
          <div className="heading-main">
            {slide.kicker && <div className="kicker t-label">{slide.kicker}</div>}
            <h1 className="h-display title" style={titleStyle}>
              {slide.title}
            </h1>
            {slide.subtitle && <div className="subtitle">{slide.subtitle}</div>}
          </div>
          {slide.description && <p className="t-desc desc">{slide.description}</p>}
        </header>
      )}
    </section>
  );
}
