'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import React from 'react'

export default function ParallaxBackdrop() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  React.useEffect(() => {
    function onMove(e: MouseEvent) {
      x.set((e.clientX / window.innerWidth - 0.5) * 10)
      y.set((e.clientY / window.innerHeight - 0.5) * 10)
    }
    
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])
  
  const tx = useTransform(x, v => `${v}px`)
  const ty = useTransform(y, v => `${v}px`)
  
  return (
    <motion.div 
      style={{ translateX: tx, translateY: ty }}
      className='fixed inset-0 -z-10 opacity-60'
    >
      <div className='absolute -left-32 -top-24 h-[60vh] w-[60vw] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(0,185,252,.25),transparent_60%)]' />
      <div className='absolute right-[-20vw] bottom-[-10vh] h-[65vh] w-[65vw] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(0,185,252,.14),transparent_60%)]' />
    </motion.div>
  )
}
