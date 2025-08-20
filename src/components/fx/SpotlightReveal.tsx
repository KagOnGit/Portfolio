'use client'
import React from 'react'

export default function SpotlightReveal(){
  const maskRef = React.useRef<HTMLDivElement>(null)
  const glowRef = React.useRef<HTMLDivElement>(null)
  const rafLock = React.useRef(false)
  const last = React.useRef({ x: 0, y: 0, t: 0 })

  React.useEffect(()=>{
    const mask = maskRef.current!, glow = glowRef.current!
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    function paint(x:number, y:number){
      const now = performance.now()
      const dt = Math.max(1, now - (last.current.t || now))
      const dx = x - (last.current.x || x)
      const dy = y - (last.current.y || y)
      const speed = Math.min(1000, Math.hypot(dx,dy) / dt * 1000) // px/s
      const r = Math.max(180, Math.min(320, 180 + speed*0.06))    // 180–320

      const maskCSS = `radial-gradient(${r}px ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.96) 100%)`
      ;(mask.style as { webkitMaskImage?: string }).webkitMaskImage = maskCSS
      ;(mask.style as { maskImage?: string }).maskImage = maskCSS
      glow.style.background = `radial-gradient(${r*1.3}px ${r*1.3}px at ${x}px ${y}px, rgba(0,140,255,.20), rgba(0,140,255,0) 65%)`
      glow.style.filter = 'blur(22px)'

      last.current = { x, y, t: now }
    }

    const onMove = (e: MouseEvent) => {
      if (prefersReduced.matches) return
      last.current.x = e.clientX; last.current.y = e.clientY
      if (!rafLock.current){
        rafLock.current = true
        requestAnimationFrame(()=>{ rafLock.current = false; paint(last.current.x, last.current.y) })
      }
    }

    // Mobile/touch: pulse at tap position
    const pulse = (x:number, y:number) => {
      if (prefersReduced.matches) return
      paint(x,y)
      glow.animate([{ opacity:.9 }, { opacity:.6 }], { duration: 450, easing: 'ease-out' })
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]; if(!t) return
      pulse(t.clientX, t.clientY)
    }

    document.addEventListener('mousemove', onMove, { passive:true })
    document.addEventListener('touchstart', onTouch, { passive:true })
    return ()=> {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('touchstart', onTouch)
    }
  },[])

  return (
    <>
      <div ref={glowRef} className='fixed inset-0 -z-25 pointer-events-none opacity-70' aria-hidden />
      <div ref={maskRef} className='fixed inset-0 -z-20 pointer-events-none' aria-hidden />
    </>
  )
}
