'use client';

import { useEffect } from 'react';

export function HoverController() {
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return null;
}
