'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { initHoverSpotlight } from '@/lib/hoverSpotlight';

export default function RootBloombergCanvas() {
  const [mounted, setMounted] = useState(false);
  const hostRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const host = document.createElement('div');
    host.id = 'bb-root';
    host.className = 'pointer-events-none fixed inset-0 -z-40';
    host.setAttribute('aria-hidden','true');
    document.body.appendChild(host);
    hostRef.current = host;
    setMounted(true);

    initHoverSpotlight();
    return () => { host.remove(); };
  }, []);

  if (!mounted || !hostRef.current) return null;

  // Two layers: black underlay + masked Bloomberg scene overlay
  return createPortal(
    <div className='absolute inset-0'>
      <div className='absolute inset-0 bg-black' />
      <div className='absolute inset-0 bb-scene bb-mask' />
    </div>,
    hostRef.current
  );
}
