'use client'

import React from 'react'

export default function Spotlight() {
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const el = ref.current!
    const root = document.body
    
    function move(e: MouseEvent) {
      const x = e.clientX
      const y = e.clientY
      el.style.background = `radial-gradient(240px 240px at ${x}px ${y}px, rgba(0,185,252,.16), transparent 60%)`
    }
    
    root.addEventListener('mousemove', move)
    return () => root.removeEventListener('mousemove', move)
  }, [])
  
  return <div ref={ref} className='pointer-events-none fixed inset-0 z-0'></div>
}
