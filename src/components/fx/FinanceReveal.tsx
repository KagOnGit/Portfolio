'use client'
import React from 'react'

const TERMS = [
  'M&A','DCF','LBO','IRR','NPV','EBITDA','MoM','ARR','CAC','WACC','Synergies',
  'Comps','Precedents','SOTP','Working Capital','Leverage','Coverage','Runway'
]

export default function FinanceReveal() {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY
      // a dark mask that reveals text near the cursor (supports WebKit + modern)
      const r = 200
      const css = `radial-gradient(${r}px ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.85) 100%)`
      ;(el.style as { webkitMaskImage?: string }).webkitMaskImage = css
      ;(el.style as { maskImage?: string }).maskImage = css
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  return (
    <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
      {/* faint blue vignette for depth */}
      <div className='absolute inset-0 opacity-60'>
        <div className='absolute -left-40 -top-40 h-[60vh] w-[60vw] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(0,120,255,.18),transparent_60%)]'/>
        <div className='absolute right-[-25vw] bottom-[-10vh] h-[70vh] w-[70vw] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(0,120,255,.12),transparent_60%)]'/>
      </div>

      {/* keywords layer (masked by cursor) */}
      <div ref={ref} className='absolute inset-0 text-[10vw] md:text-[7vw] font-black tracking-tighter leading-none select-none' style={{color:'rgba(170,200,255,0.06)'}}>
        <div className='absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap'>
          {TERMS.slice(0,8).map(t => <span key={t} className='mx-6'>{t}</span>)}
        </div>
        <div className='absolute left-1/2 -translate-x-1/2 top-1/3 whitespace-nowrap'>
          {TERMS.slice(8).map(t => <span key={t} className='mx-6'>{t}</span>)}
        </div>
        <div className='absolute left-1/2 -translate-x-1/2 bottom-10 whitespace-nowrap'>
          {TERMS.sort().map(t => <span key={t+'b'} className='mx-6'>{t}</span>)}
        </div>
      </div>
    </div>
  )
}
