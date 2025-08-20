'use client'
import React from 'react'

const TERMS = [
 'M&A','DCF','LBO','IRR','NPV','EBIT','EBITDA','FCF','WACC','CAPM','ARR','MoM','TV','EV','P/E',
 'Comps','Precedents','SOTP','Synergies','Runway','Coverage','Leverage','Working Capital',
 'Sensitivity','Accretion','Dilution','Terminal Value','Buy-Side','Sell-Side','CIM','Teaser'
]

function Item({t, i}:{t:string; i:number}){
  const size = 48 + ((i*7)%72)   // 48–120px
  const rot  = ((i*19)%10) - 5   // -5..+5 deg
  const op   = 0.05 + ((i*13)%20)/400 // 0.05–0.1
  const y = (i*173)%100; const x=(i*97)%100
  return (
    <span
      className='absolute font-black select-none'
      style={{
        top: `${y}%`, left: `${x}%`,
        fontSize: `${size}px`,
        transform: `rotate(${rot}deg)`,
        color: `rgba(190,210,255,${op})`,
        letterSpacing: '-.02em',
        whiteSpace: 'nowrap',
      }}
    >{t}</span>
  )
}

export default function FinanceTextField(){
  return (
    <div className='fixed inset-0 -z-30 pointer-events-none' aria-hidden>
      <div className='relative w-full h-full'>
        {TERMS.concat(TERMS).map((t,i)=>(<Item t={t} i={i} key={t+String(i)} />))}
      </div>
    </div>
  )
}
