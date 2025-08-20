'use client'
import React from 'react'

/**
 * Pitch-black by default. Reveals a 'Wall Street' scene under a circular spotlight.
 * The scene is a lightweight SVG: grid, trendlines, candlestick bars, and faint quote ticks.
 */
export default function HoverWallStreet(){
  const wrap = React.useRef<HTMLDivElement>(null)
  const rafLock = React.useRef(false)
  const last = React.useRef({x: 0, y: 0, t: 0})

  React.useEffect(()=>{
    const el = wrap.current!
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const paint = (x:number, y:number) => {
      const now = performance.now()
      const dt = Math.max(1, now - (last.current.t || now))
      const dx = x - (last.current.x || x)
      const dy = y - (last.current.y || y)
      const speed = Math.min(1000, Math.hypot(dx,dy) / dt * 1000)
      const r = Math.max(180, Math.min(320, 180 + speed*0.06)) // 180–320 based on speed

      const mask = `radial-gradient(${r}px ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,.65) 60%, rgba(0,0,0,.98) 100%)`
      ;(el.style as { webkitMaskImage?: string }).webkitMaskImage = mask
      ;(el.style as { maskImage?: string }).maskImage = mask
      last.current = { x, y, t: now }
    }

    const onMove = (e: MouseEvent) => {
      if (prefersReduced.matches) return
      last.current.x = e.clientX; last.current.y = e.clientY
      if (!rafLock.current){
        rafLock.current = true
        requestAnimationFrame(()=>{ rafLock.current=false; paint(last.current.x,last.current.y) })
      }
    }

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]; if(!t) return
      paint(t.clientX,t.clientY)
    }

    document.addEventListener('mousemove', onMove, { passive:true })
    document.addEventListener('touchstart', onTouch, { passive:true })
    return ()=> {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('touchstart', onTouch)
    }
  },[])

  return (
    <div
      ref={wrap}
      className="fixed inset-0 -z-30 pointer-events-none fx-hidden"
      style={{ opacity: .85 }}
      aria-hidden
    >
      <svg viewBox="0 0 1600 900" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"  stopColor="rgba(10,162,255,.9)"/>
            <stop offset="100%" stopColor="rgba(58,123,255,.6)"/>
          </linearGradient>
          <linearGradient id="candle" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(10,162,255,.75)"/>
            <stop offset="100%" stopColor="rgba(10,162,255,.1)"/>
          </linearGradient>
        </defs>

        {/* base grid */}
        <rect width="1600" height="900" fill="url(#grid)"/>

        {/* complex trendlines */}
        <g fill="none" stroke="url(#line)" strokeWidth="2">
          <path d="M0,720 C200,660 340,640 520,600 C760,540 920,520 1120,560 C1300,596 1420,560 1600,520" opacity=".9"/>
          <path d="M0,640 C240,600 360,560 520,520 C740,460 960,480 1200,520 C1380,552 1500,540 1600,500" opacity=".6"/>
          <path d="M0,760 C260,720 420,700 640,660 C900,612 1060,620 1300,660 C1460,688 1540,680 1600,660" opacity=".45"/>
        </g>

        {/* micro candlesticks */}
        <g opacity=".75">
          <rect x="220" y="520" width="4" height="120" fill="url(#candle)"/>
          <rect x="260" y="560" width="4" height="80"  fill="url(#candle)"/>
          <rect x="300" y="540" width="4" height="100" fill="url(#candle)"/>
          <rect x="760" y="500" width="4" height="130" fill="url(#candle)"/>
          <rect x="820" y="540" width="4" height="90"  fill="url(#candle)"/>
          <rect x="1380" y="560" width="4" height="80" fill="url(#candle)"/>
        </g>

        {/* faint quotes / ticks */}
        <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="16" fill="rgba(10,162,255,.55)">
          <text x="80"  y="120">EURUSD 1.0932 ▲0.21%</text>
          <text x="360" y="160">SPX 5546.3 ▲0.35%</text>
          <text x="760" y="110">AAPL 223.41 ▼0.12%</text>
          <text x="1160" y="150">WTI 78.44 ▲1.02%</text>
        </g>
      </svg>
    </div>
  )
}
