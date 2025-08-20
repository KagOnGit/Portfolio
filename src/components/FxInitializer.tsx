'use client';
import { useEffect } from 'react';
import { initFxOnce } from '@/lib/fx';

export default function FxInitializer() {
  useEffect(() => {
    initFxOnce();
  }, []);

  return null;
}
