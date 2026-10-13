/**
 * Palette and typography for the whole deck.
 * Edit values here; they are written to CSS custom properties at startup
 * and read directly by the 3D scenes.
 */
export const palette = {
  // Dark surfaces
  ink: '#111214',
  ink2: '#1a1c1f',
  ink3: '#25282c',
  // Light surfaces (warm off-white)
  paper: '#ece8e0',
  paper2: '#e1dcd2',
  paper3: '#d3cdc1',
  // Text
  textOnDark: '#f2f0eb',
  textOnLight: '#141517',
  mutedOnDark: '#9ba1a8',
  mutedOnLight: '#575b61',
  // Rules and outlines
  lineOnDark: '#3a3e44',
  lineOnLight: '#bdb6aa',
  // Accents
  orange: '#ff6a13',
  steel: '#8a9199',
  steelDark: '#5c636b',
  // Status colours (used sparingly: fault states only)
  fault: '#e23b2e',
  // 3D studio backdrops
  studioLight: '#e4e1db',
  studioDark: '#141518',
} as const;

export const typography = {
  heading: "'Archivo Variable', 'Archivo', 'Arial Black', system-ui, sans-serif",
  body: "'Inter Variable', 'Inter', 'Segoe UI', system-ui, sans-serif",
  headingWeight: 850,
  headingStretch: '112%',
} as const;

export function applyTheme(root: HTMLElement = document.documentElement) {
  const vars: Record<string, string> = {
    '--c-ink': palette.ink,
    '--c-ink-2': palette.ink2,
    '--c-ink-3': palette.ink3,
    '--c-paper': palette.paper,
    '--c-paper-2': palette.paper2,
    '--c-paper-3': palette.paper3,
    '--c-text-dark': palette.textOnDark,
    '--c-text-light': palette.textOnLight,
    '--c-muted-dark': palette.mutedOnDark,
    '--c-muted-light': palette.mutedOnLight,
    '--c-line-dark': palette.lineOnDark,
    '--c-line-light': palette.lineOnLight,
    '--c-orange': palette.orange,
    '--c-steel': palette.steel,
    '--c-steel-dark': palette.steelDark,
    '--c-fault': palette.fault,
    '--c-studio-light': palette.studioLight,
    '--c-studio-dark': palette.studioDark,
    '--f-head': typography.heading,
    '--f-body': typography.body,
    '--f-head-weight': String(typography.headingWeight),
    '--f-head-stretch': typography.headingStretch,
  };
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}
