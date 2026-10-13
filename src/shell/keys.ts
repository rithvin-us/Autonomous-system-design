/**
 * Keyboard and presentation-clicker mapping, shared by the audience view and
 * the presenter window. Most clickers send PageDown / PageUp for next / back,
 * F5 or Shift+F5 for "start show", and "." or "b" for blank screen.
 */
export type DeckAction =
  | 'next'
  | 'prev'
  | 'nextSlide'
  | 'prevSlide'
  | 'first'
  | 'last'
  | 'overview'
  | 'notes'
  | 'presenter'
  | 'reset'
  | 'fullscreen'
  | 'black'
  | 'help'
  | 'escape';

export function actionForKey(e: KeyboardEvent): DeckAction | null {
  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
      return 'next';
    case ' ':
      return e.shiftKey ? 'prev' : 'next';
    case 'ArrowLeft':
    case 'PageUp':
    case 'Backspace':
      return 'prev';
    case 'ArrowDown':
      return 'nextSlide';
    case 'ArrowUp':
      return 'prevSlide';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    case 'o':
    case 'O':
      return 'overview';
    case 'n':
    case 'N':
      return 'notes';
    case 'p':
    case 'P':
      return 'presenter';
    case 'r':
    case 'R':
      return 'reset';
    case 'f':
    case 'F':
    case 'F5':
      return 'fullscreen';
    case 'b':
    case 'B':
    case '.':
      return 'black';
    case '?':
    case 'h':
    case 'H':
      return 'help';
    case 'Escape':
      return 'escape';
    default:
      return null;
  }
}

export const SHORTCUTS: [string, string][] = [
  ['→  PgDn  Space', 'Next step or slide (clicker forward)'],
  ['←  PgUp  Backspace', 'Previous step or slide (clicker back)'],
  ['↓  ↑', 'Skip to next / previous slide'],
  ['Home  End', 'First / last slide'],
  ['O', 'All slides (Esc returns)'],
  ['N', 'Notes panel'],
  ['P', 'Presenter window'],
  ['R', 'Reset 3D view'],
  ['F  F5', 'Full screen'],
  ['B  .', 'Black screen'],
  ['?', 'This help'],
];
