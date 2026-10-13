import { listen, post } from './channel';

/** Fired on window when the 3D view should return to its default camera. */
export const RESET_VIEW_EVENT = 'deck:reset-view';

export function requestResetView() {
  window.dispatchEvent(new CustomEvent(RESET_VIEW_EVENT));
  post({ type: 'reset-view' });
}

listen((msg) => {
  if (msg.type === 'reset-view') window.dispatchEvent(new CustomEvent(RESET_VIEW_EVENT));
});
