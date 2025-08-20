'use client';
import { useEffect } from 'react';
import Image from 'next/image';

type Props = {
  open: boolean;
  onClose: () => void;
  srcs: string[];
  titles: string[];
  index: number;
  setIndex: (i:number)=>void;
};
export default function Lightbox({ open, onClose, srcs, titles, index, setIndex }: Props){
  useEffect(()=>{
    if(!open) return;
    const onKey = (e: KeyboardEvent) => {
      if(e.key === 'Escape') onClose();
      if(e.key === 'ArrowRight') setIndex((index+1)%srcs.length);
      if(e.key === 'ArrowLeft') setIndex((index-1+srcs.length)%srcs.length);
    };
    window.addEventListener('keydown', onKey, { passive:true });
    return ()=> window.removeEventListener('keydown', onKey);
  },[open,index,srcs.length,onClose,setIndex]);

  if(!open) return null;
  return (
    <div className='fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'>
      <button aria-label='Close' onClick={onClose}
        className='absolute top-4 right-4 rounded-full border border-blue-500 text-white/90 px-3 py-1 hover:bg-blue-500/10'>✕</button>
      <div className='relative w-full max-w-5xl h-[80vh]'>
        <Image src={srcs[index]} alt={titles[index]} fill priority className='object-contain rounded-lg' />
      </div>
      <div className='absolute bottom-6 text-center text-white/80 text-sm'>
        {titles[index]}
      </div>
      <button aria-label='Prev' onClick={()=>setIndex((index-1+srcs.length)%srcs.length)}
        className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-blue-500 px-3 py-2 text-white/90 hover:bg-blue-500/10'>&larr;</button>
      <button aria-label='Next' onClick={()=>setIndex((index+1)%srcs.length)}
        className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-blue-500 px-3 py-2 text-white/90 hover:bg-blue-500/10'>&rarr;</button>
    </div>
  );
}
