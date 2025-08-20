export type FxState = 'on' | 'off';

const KEY = 'fx:state';

export function getInitialFxState(): FxState {
  if (typeof window === 'undefined') return 'on';
  const saved = window.localStorage.getItem(KEY) as FxState | null;
  return saved === 'off' ? 'off' : 'on';
}

export function setFxState(next: FxState) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-fx', next);
  try { window.localStorage.setItem(KEY, next); } catch {}
}

export function initFxOnce() {
  if (typeof document === 'undefined') return;
  const first = getInitialFxState();
  document.documentElement.setAttribute('data-fx', first);
}
