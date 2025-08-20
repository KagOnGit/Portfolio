'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { extracurricular } from '@/data/extracurricular';
import Lightbox from '@/components/ui/Lightbox';

export default function Extracurricular(){
  const data = useMemo(()=>extracurricular,[]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const srcs = data.map(d=>d.src);
  const titles = data.map(d=>d.title);

  return (
    <section id='extracurricular' className='section-surface relative py-16'>
      <div className='mx-auto max-w-6xl px-4'>
        <h2 className='text-3xl md:text-4xl font-bold text-[#23a4ff] mb-8'>Extracurricular Achievements</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {data.map((c,i)=>(
            <article key={c.id}
              className='group relative overflow-hidden rounded-2xl bg-black border border-blue-500/50 shadow-[0_0_0_1px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50 transition-all'>
              <div className='absolute right-3 top-3 z-10 text-[11px] px-2 py-1 rounded-full bg-black/70 border border-blue-500/40 text-white/80'>
                {new Date(c.dateISO).toLocaleDateString(undefined,{month:"long", day:"numeric", year:"numeric"})}
              </div>
              <button
                onClick={()=>{ setIdx(i); setOpen(true); }}
                className='relative block w-full aspect-[16/10] overflow-hidden'
                aria-label={`Preview ${c.title}`}>
                <Image src={c.src} alt={c.title} fill className='object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]' />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <div className='pointer-events-none absolute bottom-3 left-3 text-[12px] text-white/80 bg-black/60 px-2 py-1 rounded-full border border-blue-500/40'>Click to preview</div>
              </button>
              <div className='p-5'>
                <h3 className='text-white font-semibold text-lg mb-1'>{c.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{c.caption}</p>
                <div className='mt-4 flex gap-3'>
                  <a href={c.src} download className='inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border border-blue-500 text-white hover:bg-blue-500/10'>
                    ⬇️ Download
                  </a>
                  <a href={c.src} target='_blank' className='inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border border-blue-500 text-white hover:bg-blue-500/10'>
                    Open in new tab ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Lightbox open={open} onClose={()=>setOpen(false)} srcs={srcs} titles={titles} index={idx} setIndex={setIdx}/>
    </section>
  );
}
