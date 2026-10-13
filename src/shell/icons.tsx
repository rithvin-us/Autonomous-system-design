/** The few interface glyphs the deck needs, drawn to one stroke weight. */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
};

export const IconPrev = () => (
  <svg {...base}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconNext = () => (
  <svg {...base}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconReset = () => (
  <svg {...base}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4.5h4.5" />
  </svg>
);

export const IconGrid = () => (
  <svg {...base}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);
