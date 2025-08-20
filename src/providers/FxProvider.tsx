'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type FxState = 'on' | 'off';
type Ctx = { state: FxState; set: (s: FxState) => void; toggle: () => void };

const KEY = 'fx:state';
const FxContext = createContext<Ctx | null>(null);

export default function FxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FxState>('on');

  // Initialize from localStorage ASAP on mount
  useEffect(() => {
    try {
      const saved = (window.localStorage.getItem(KEY) as FxState | null) || 'on';
      setState(saved);
      document.documentElement.setAttribute('data-fx', saved);
    } catch {}
  }, []);

  // Reflect to <html data-fx> + persist
  useEffect(() => {
    document.documentElement.setAttribute('data-fx', state);
    try { window.localStorage.setItem(KEY, state); } catch {}
  }, [state]);

  const set = useCallback((s: FxState) => setState(s), []);
  const toggle = useCallback(() => setState(s => (s === 'on' ? 'off' : 'on')), []);

  return <FxContext.Provider value={{ state, set, toggle }}>{children}</FxContext.Provider>;
}

export function useFx() {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error('useFx must be used within FxProvider');
  return ctx;
}
