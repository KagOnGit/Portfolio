'use client'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Reuse the Bloomberg drawing, but mount directly to document.body
const COL = {
  bg: '#000000',
  grid: 'rgba(255,255,255,0.06)',
  cyan: '#00B9FF',
  green: '#00D084',
  red: '#FF4D4D',
  amber: '#FFC14D',
  gray: 'rgba(255,255,255,0.65)',
  faint: 'rgba(255,255,255,0.25)',
}
type Pt = { x:number; y:number }
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v))

function BloombergCanvasEl(){
  const ref = useRef<HTMLCanvasElement|null>(null)
  const hostRef = useRef<HTMLDivElement|null>(null)
  const [mounted, setMounted] = useState(false)
  const last = useRef({ x: 0, y: 0, t: 0 })
  const target = useRef<Pt>({ x: -1, y: -1 })
  const radius = useRef({ cur: 0, target: 0 }) // hidden until hover

  useEffect(() => {
    // Create host element
    const hostDiv = document.createElement('div');
    hostDiv.id = 'root-bloomberg-canvas';
    hostDiv.className = 'fx-layer pointer-events-none fixed inset-0 -z-40';
    hostDiv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(hostDiv);
    hostRef.current = hostDiv;
    setMounted(true);
    
    return () => {
      if (hostRef.current) {
        hostRef.current.remove();
        hostRef.current = null;
      }
    };
  }, []);

  useEffect(()=>{
    if (!mounted || !ref.current) return;
    const cvs = ref.current!, ctx = cvs.getContext('2d', { alpha: true })!
    let W=innerWidth, H=innerHeight, DPR=Math.min(2, devicePixelRatio||1)
    const size=()=>{ W=innerWidth; H=innerHeight; DPR=Math.min(2, devicePixelRatio||1); cvs.width=Math.floor(W*DPR); cvs.height=Math.floor(H*DPR); cvs.style.width=W+'px'; cvs.style.height=H+'px'; ctx.setTransform(DPR,0,0,DPR,0,0) }
    size(); const ro=new ResizeObserver(size); ro.observe(document.body)

    const symbols=['AAPL','GOOGL','MSFT','NVDA','TSLA','META','AMZN','JPM','GS','MS','BAC','NFLX']
    const base=Object.fromEntries(symbols.map(s=>[s, 50+Math.random()*200]))
    const heat=Array.from({length:30},()=>({v:Math.random()*2-1}))
    const spark=Array.from({length:140},(_,i)=>Math.sin(i*0.18)+Math.sin(i*0.055)*0.5)
    let stop=false

    function grid(x:number,y:number,w:number,h:number,step=40){
      ctx.strokeStyle=COL.grid; ctx.lineWidth=1
      for(let gx=x; gx<=x+w; gx+=step){ ctx.beginPath(); ctx.moveTo(gx,y); ctx.lineTo(gx,y+h); ctx.stroke() }
      for(let gy=y; gy<=y+h; gy+=step){ ctx.beginPath(); ctx.moveTo(x,gy); ctx.lineTo(x+w,gy); ctx.stroke() }
    }
    function quotes(x:number,y:number,w:number,h:number,t:number){
      grid(x,y,w,h)
      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'
      const rows=6, cols=6, cw=Math.floor(w/cols), rh=Math.floor(h/rows)
      let k=0
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const sx=symbols[k%symbols.length], basePx=base[sx] as number
          const p=basePx + Math.sin((t*0.002)+(k*0.7))*(3+(k%5))
          const ch=Math.sin((t*0.0012)+(k*0.9))*1.8
          const col=ch>=0?COL.green:COL.red
          const cx=x+c*cw+10, cy=y+r*rh+18
          ctx.fillStyle=COL.gray; ctx.fillText(sx,cx,cy)
          ctx.fillStyle=col; ctx.fillText(p.toFixed(2),cx+60,cy)
          ctx.fillText((ch>=0?'+':'')+ch.toFixed(2)+'%',cx+128,cy)
          k++
        }
      }
    }
    function heatmap(x:number,y:number,w:number,h:number,t:number){
      const cols=10, rows=3, bw=Math.floor(w/cols)-6, bh=Math.floor(h/rows)-6
      for(let i=0;i<heat.length;i++){
        const c=i%cols, r=Math.floor(i/cols), hx=x+c*(bw+6), hy=y+r*(bh+6)
        const v=heat[i].v=Math.sin((t*0.001)+(i*0.37))
        const col=v>=0?COL.green:COL.red
        ctx.fillStyle=v>=0?`rgba(0,208,132,${0.25+Math.min(0.7,Math.abs(v))})`:`rgba(255,77,77,${0.25+Math.min(0.7,Math.abs(v))})`
        ctx.fillRect(hx,hy,bw,bh); ctx.strokeStyle=col; ctx.strokeRect(hx+0.5,hy+0.5,bw-1,bh-1)
      }
      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'; ctx.fillStyle=COL.faint; ctx.fillText('Sector Heatmap', x+6, y+14)
    }
    function sparkline(x:number,y:number,w:number,h:number,t:number){
      grid(x,y,w,h)
      ctx.beginPath()
      for(let i=0;i<spark.length;i++){
        const px=x+(i/(spark.length-1))*w
        const py=y+h*0.5 + spark[(i+Math.floor(t*0.08))%spark.length]*h*0.25
        if (i === 0) { ctx.moveTo(px,py) } else { ctx.lineTo(px,py) }
      }
      ctx.strokeStyle=COL.cyan; ctx.lineWidth=2; ctx.stroke()
      for(let i=0;i<40;i++){
        const px=x+(i/40)*w, v=Math.sin((i*0.6)+t*0.012), up=v>0
        ctx.strokeStyle=up?COL.green:COL.red; ctx.beginPath(); ctx.moveTo(px,y+h*0.6); ctx.lineTo(px,y+h*0.6 - v*30); ctx.stroke()
      }
      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'; ctx.fillStyle=COL.faint; ctx.fillText('Indices & Microstructure', x+6, y+14)
    }
    function news(x:number,y:number,w:number,h:number,t:number){
      ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(x,y,w,h)
      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle=COL.amber; ctx.fillText('NEWSWIRE', x+10, y+18)
      ctx.fillStyle=COL.gray
      const items=['M&A chatter in semis boosts targets','Rates drift as markets weigh CPI print','Energy edges higher amid supply concerns','Buybacks accelerate in mega-cap tech','Banks guide on NIM stabilization']
      for(let i=0;i<items.length;i++){ const yy=y+38+i*18, off=Math.sin((t*0.001)+i)*4; ctx.fillText('• '+items[i], x+12+off, yy) }
    }
    function terminal(t:number){
      const pad=28, topH=Math.min(220,H*0.28), rightW=Math.min(420,W*0.32), botH=Math.min(200,H*0.26), leftW=Math.min(360,W*0.28)
      quotes(pad, pad, W-pad*2, topH-pad, t)
      heatmap(W-rightW-pad, topH+pad, rightW, H-(topH+botH+pad*3), t)
      sparkline(pad, H-botH-pad, W-(leftW+pad*3), botH, t)
      news(pad, topH+pad, leftW, H-(topH+botH+pad*3), t)
    }

    function frame(now:number){
      if (stop) return
      ctx.fillStyle=COL.bg; ctx.fillRect(0,0,W,H)
      const cx = target.current.x<0 ? W*0.5 : lerp(last.current.x, target.current.x, 0.18)
      const cy = target.current.y<0 ? H*0.5 : lerp(last.current.y, target.current.y, 0.18)
      last.current.x=cx; last.current.y=cy
      radius.current.cur = lerp(radius.current.cur, radius.current.target, 0.15)

      // Only reveal if radius > 1 (hovering)
      if(radius.current.cur>1){
        ctx.save()
        ctx.beginPath(); ctx.arc(cx,cy,radius.current.cur,0,Math.PI*2); ctx.clip()
        terminal(now)
        ctx.restore()
        const rg=ctx.createRadialGradient(cx,cy,0,cx,cy,radius.current.cur*1.2)
        rg.addColorStop(0,'rgba(0,185,255,0.18)'); rg.addColorStop(1,'rgba(0,185,255,0.00)')
        ctx.fillStyle=rg; ctx.fillRect(0,0,W,H)
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // input handling
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)')
    const show = (x:number,y:number,spd:number)=>{ target.current={x,y}; radius.current.target = clamp(220 + spd*0.06, 200, 380) }
    const hide = ()=>{ radius.current.target = 0 }

    const onPointerMove=(e:PointerEvent)=>{ if(prefersReduced.matches) return; const now=performance.now(); const dt=Math.max(1, now-(last.current.t||now)); const spd=Math.hypot(e.clientX-last.current.x, e.clientY-last.current.y)/dt*1000; last.current.t=now; show(e.clientX,e.clientY,spd) }
    const onPointerEnter=(e:PointerEvent)=>show(e.clientX,e.clientY,0)
    const onPointerLeave=()=>hide()
    const onWheel=()=>{ if(performance.now()-(last.current.t||0)>400) hide() }

    document.addEventListener('pointermove', onPointerMove, { passive:true })
    document.addEventListener('pointerenter', onPointerEnter, { passive:true })
    document.addEventListener('pointerleave', onPointerLeave, { passive:true })
    document.addEventListener('wheel', onWheel, { passive:true })

    return ()=>{ stop=true; ro.disconnect(); document.removeEventListener('pointermove', onPointerMove); document.removeEventListener('pointerenter', onPointerEnter); document.removeEventListener('pointerleave', onPointerLeave); document.removeEventListener('wheel', onWheel) }
  },[mounted])

  if (!mounted || !hostRef.current) return null;
  
  return createPortal(
    <canvas ref={ref} className='absolute inset-0 w-full h-full' />,
    hostRef.current
  )
}

export default function RootBloombergCanvas(){
  // Render nothing on server; mount on client
  return typeof window === 'undefined' ? null : <BloombergCanvasEl/>
}
