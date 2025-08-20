'use client';
import { useEffect, useState } from 'react';
import { getInitialFxState, setFxState, initFxOnce } from '@/lib/fx';

export default function FxToggle() {
  const [fx, setFx] = useState<'on'|'off'>(() => getInitialFxState());

  useEffect(() => { initFxOnce(); }, []);
  useEffect(() => { setFxState(fx); }, [fx]);

  const isOn = fx === 'on';
  const toggle = () => setFx(isOn ? 'off' : 'on');

  return (
    <button
      aria-pressed={isOn}
      aria-label={`Toggle visual effects ${isOn ? 'on' : 'off'}`}
      onClick={toggle}
      className='fx-toggle select-none rounded-2xl border border-white/25 bg-black px-3 py-2 text-white shadow-[inset_0_0_12px_rgba(255,255,255,0.15)]
                 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all'
    >
      <div className='flex flex-col items-center leading-tight'>
        <span className='text-xs text-gray-300'>FX:</span>
        <span className='text-lg font-bold'>{isOn ? 'On' : 'Off'}</span>
      </div>
    </button>
  );
}
