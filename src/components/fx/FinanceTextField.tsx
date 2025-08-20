'use client'
import React from 'react'

const TERMS = [
 'M&A','DCF','LBO','IRR','NPV','EBIT','EBITDA','FCF','WACC','CAPM','ARR','MoM','TV','EV','P/E',
 'Comps','Precedents','SOTP','Synergies','Runway','Coverage','Leverage','Working Capital',
 'Sensitivity','Accretion','Dilution','Terminal Value','Buy-Side','Sell-Side','CIM','Teaser'
]

function Layer({ speed, offset=0 }:{speed:number; offset?:number}){
  return (
    <div className='absolute inset-0 will-change-transform' data-speed={speed} style={{ transform: `translate3d(0,${offset}px,0)`}}>
      {TERMS.map((t,i)=>{
        const size = 44 + ((i*7)%66)     // 44–110px
        const rot  = ((i*19)%10)-5        // -5..+5
        const op   = 0.045 + ((i*13)%20)/400
        const y = (i*173)%100; const x=(i*97)%100
        return (
          <span key={t+i}
            className='absolute font-black select-none'
            style={{
              top:`${y}%`, left:`${x}%`,
              fontSize:`${size}px`,
              transform:`rotate(${rot}deg)`,
              color:`rgba(10,162,255,${op})`,
              letterSpacing:'-.02em', whiteSpace:'nowrap'
            }}>{t}</span>
        )
      })}
    </div>
  )
}

export default function FinanceTextField(){
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(()=>{
    const el = ref.current; if(!el) return
    let af:number|undefined
    const onScroll = () => {
      if (af) return
      af = requestAnimationFrame(()=>{
        const y = window.scrollY
        // parallax by data-speed (lower = slower)
        el.querySelectorAll<HTMLElement>('[data-speed]').forEach(n=>{
          const s = Number(n.dataset.speed || 1)
          n.style.transform = `translate3d(0, ${-y*(0.02*s)}px, 0)`
        })
        af = undefined
      })
    }
    document.addEventListener('scroll', onScroll, { passive:true })
    return ()=>{ if(af) cancelAnimationFrame(af); document.removeEventListener('scroll', onScroll) }
  },[])
  return (
    <div ref={ref} className='fixed inset-0 -z-30 pointer-events-none fx-hidden' aria-hidden>
      <div className='relative w-full h-full'>
        <Layer speed={0.6} />
        <Layer speed={1.0} />
        <Layer speed={1.5} />
      </div>
    </div>
  )
}
