'use client'
import React from 'react'

export default function SpotlightReveal(){
  const maskRef = React.useRef<HTMLDivElement>(null)
  const glowRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(()=>{
    const mask = maskRef.current!, glow = glowRef.current!
    const onMove = (e:MouseEvent)=>{
      const x=e.clientX, y=e.clientY
      const r=220
      const maskCSS = `radial-gradient(${r}px ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.95) 100%)`
      ;(mask.style as { webkitMaskImage?: string }).webkitMaskImage = maskCSS
      ;(mask.style as { maskImage?: string }).maskImage = maskCSS
      glow.style.background = `radial-gradient(300px 300px at ${x}px ${y}px, rgba(0,140,255,.20), rgba(0,140,255,0) 65%)`
      glow.style.filter = 'blur(22px)'
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e:MouseEvent)=>{ if(!prefersReduced.matches) onMove(e) }
    document.addEventListener('mousemove', handler)
    return ()=>document.removeEventListener('mousemove', handler)
  },[])

  return (
    <>
      {/* glow underlay */}
      <div ref={glowRef} className='fixed inset-0 -z-25 pointer-events-none opacity-70' aria-hidden />
      {/* mask that reveals text where you hover */}
      <div ref={maskRef} className='fixed inset-0 -z-20 pointer-events-none' aria-hidden />
    </>
  )
}
