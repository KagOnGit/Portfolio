'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
export default function RootBloombergCanvas() {
  const [mounted, setMounted] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = document.createElement('div');
    host.id = 'root-bloomberg-canvas';
    host.className = 'fx-layer pointer-events-none fixed inset-0 -z-40';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
    hostRef.current = host;
    setMounted(true);
    return () => { host.remove(); };
  }, []);
  if (!mounted || !hostRef.current) return null;
  return createPortal(<canvas className='absolute inset-0 w-full h-full' />, hostRef.current);
}
