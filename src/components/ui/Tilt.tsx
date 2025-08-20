'use client'

import React from 'react'

export default function Tilt({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  
  function onMove(e: React.MouseEvent) {
    const el = ref.current!
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateX(${(-py * 6)}deg) rotateY(${px * 8}deg)`
  }
  
  function onLeave() {
    if (ref.current) ref.current.style.transform = ''
  }
  
  return (
    <div 
      ref={ref} 
      onMouseMove={onMove} 
      onMouseLeave={onLeave} 
      className='transition-transform will-change-transform'
    >
      {children}
    </div>
  )
}
