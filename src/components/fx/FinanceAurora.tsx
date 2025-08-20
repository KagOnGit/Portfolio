'use client'
import React, { useEffect, useRef } from 'react'

export default function FinanceAurora(){
  const ref = useRef<HTMLCanvasElement|null>(null)
  useEffect(()=>{
    const c = ref.current; if(!c) return
    const ctx = c.getContext('2d', { alpha: true })!
    let w=window.innerWidth, h=window.innerHeight
    c.width=w; c.height=h
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    c.width = w*dpr; c.height = h*dpr; ctx.scale(dpr,dpr)

    const blobs = Array.from({length:3}).map((_,i)=>({
      x: (i+1)*w/(4), y: (i%2?0.35:0.65)*h, r: 220+ i*40, a: 0.12 + i*0.03,
      vx: (Math.random()*0.6+0.2)*(Math.random()<0.5?-1:1),
      vy: (Math.random()*0.4+0.2)*(Math.random()<0.5?-1:1),
      hue: 205 + i*10
    }))

    let stop=false
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    function frame(){
      if(stop) return
      ctx.clearRect(0,0,w,h)
      ctx.globalCompositeOperation='lighter'
      for(const b of blobs){
        const grad=ctx.createRadialGradient(b.x,b.y,10,b.x,b.y,b.r)
        grad.addColorStop(0, `hsla(${b.hue},100%,60%,${b.a})`)
        grad.addColorStop(1, 'hsla(210,100%,50%,0)')
        ctx.fillStyle=grad
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill()
        if(!prefersReduced){
          b.x+=b.vx; b.y+=b.vy
          if(b.x<b.r/3||b.x>w-b.r/3) b.vx*=-1
          if(b.y<b.r/3||b.y>h-b.r/3) b.vy*=-1
        }
      }
      ctx.globalCompositeOperation='source-over'
      requestAnimationFrame(frame)
    }
    const ro = new ResizeObserver(()=>{
      w = window.innerWidth; h = window.innerHeight
      c.width = w*dpr; c.height = h*dpr; c.style.width = w+'px'; c.style.height = h+'px'
      ctx.setTransform(dpr,0,0,dpr,0,0)
    })
    ro.observe(document.body)
    frame()
    return ()=>{ stop=true; ro.disconnect() }
  },[])
  return <canvas ref={ref} className='fixed inset-0 -z-40 opacity-60 pointer-events-none' aria-hidden/>
}
