'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
type FxState = 'on' | 'off';
type Ctx = { state: FxState; set: (s: FxState) => void; toggle: () => void };

const KEY = 'fx:state';
const FxContext = createContext<Ctx | null>(null);

export default function FxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FxState>('on');

  // Initialize synchronously from the DOM attribute set in layout bootstrap
  useEffect(() => {
    const html = document.documentElement;
    const attr = (html.getAttribute('data-fx') as FxState | null) || 'on';
    setState(attr === 'off' ? 'off' : 'on'); // normalize
  }, []);

  // Keep <html data-fx> and localStorage in sync whenever state changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-fx', state);
    try { localStorage.setItem(KEY, state); } catch {}
  }, [state]);

  const set = useCallback((s: FxState) => setState(s), []);
  const toggle = useCallback(() => setState((s) => (s === 'on' ? 'off' : 'on')), []);

  return <FxContext.Provider value={{ state, set, toggle }}>{children}</FxContext.Provider>;
}
export function useFx() {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error('useFx must be used within FxProvider');
  return ctx;
}
