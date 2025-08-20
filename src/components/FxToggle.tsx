'use client';
import { useState } from 'react';

export default function FxToggle() {
  const [on, setOn] = useState(true);

  return (
    <button
      onClick={() => setOn(!on)}
      className='flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-black text-white text-lg font-medium shadow-inner hover:border-blue-400 hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all'
    >
      <div className='flex flex-col items-center justify-center'>
        <span className='text-sm text-gray-300'>FX:</span>
        <span className='text-xl font-bold'>{on ? 'On' : 'Off'}</span>
      </div>
    </button>
  );
}
