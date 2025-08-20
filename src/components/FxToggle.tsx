'use client';
import { useFx } from '@/providers/FxProvider';

export default function FxToggle() {
  const { state, toggle } = useFx();
  const isOn = state === 'on';

  return (
    <button
      onClick={toggle}
      aria-pressed={isOn}
      aria-label={`Toggle visual effects ${isOn ? 'on' : 'off'}`}
      className='rounded-2xl border border-white/20 bg-black px-3 py-2 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.15)]
                 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all'
    >
      <div className='flex flex-col items-center leading-tight'>
        <span className='text-xs text-gray-300'>FX:</span>
        <span className='text-lg font-bold'>{isOn ? 'On' : 'Off'}</span>
      </div>
    </button>
  );
}
