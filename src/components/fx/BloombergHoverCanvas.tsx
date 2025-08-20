'use client'
import React from 'react'

// Bloomberg-ish palette
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
const lerp = (a:number,b:number,t:number)=>a+(b-a)*t

export default function BloombergHoverCanvas(){
  const ref = React.useRef<HTMLCanvasElement|null>(null)
  const last = React.useRef({ x: 0, y: 0, t: 0 })
  const target = React.useRef<Pt>({ x: -1, y: -1 })
  const radius = React.useRef({ cur: 220, target: 220 })

  React.useEffect(()=>{
    const cvs = ref.current!; const ctx = cvs.getContext('2d', { alpha: true })!
    let W=window.innerWidth, H=window.innerHeight, DPR=Math.min(2, window.devicePixelRatio||1)

    function size(){
      W=window.innerWidth; H=window.innerHeight; DPR=Math.min(2, window.devicePixelRatio||1)
      cvs.width=Math.floor(W*DPR); cvs.height=Math.floor(H*DPR)
      cvs.style.width=W+'px'; cvs.style.height=H+'px'
      ctx.setTransform(DPR,0,0,DPR,0,0)
    }
    size(); const ro = new ResizeObserver(size); ro.observe(document.body)

    // Random demo quotes
    const symbols = ['AAPL','GOOGL','MSFT','NVDA','TSLA','META','AMZN','JPM','GS','MS','BAC','NFLX']
    const base = Object.fromEntries(symbols.map(s=>[s, 50+Math.random()*200]))

    // Heatmap blocks seed
    const heat = Array.from({length: 30}, ()=>({
      x: 0, y: 0, w: 0, h: 0,
      v: (Math.random()*2-1) // -1..1
    }))

    // Sparkline path seed
    const spark: number[] = Array.from({length: 140}, (_,i)=>Math.sin(i*0.18)+Math.sin(i*0.055)*0.5)

    let stop=false

    function drawGrid(x:number,y:number,w:number,h:number, step=40){
      ctx.save()
      ctx.strokeStyle = COL.grid
      ctx.lineWidth = 1
      ctx.globalAlpha = 1
      for(let gx = x; gx<=x+w; gx+=step){ ctx.beginPath(); ctx.moveTo(gx,y); ctx.lineTo(gx,y+h); ctx.stroke() }
      for(let gy = y; gy<=y+h; gy+=step){ ctx.beginPath(); ctx.moveTo(x,gy); ctx.lineTo(x+w,gy); ctx.stroke() }
      ctx.restore()
    }

    function drawQuotePanel(x:number,y:number,w:number,h:number, t:number){
      drawGrid(x,y,w,h,40)
      ctx.save()
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
      const rows = 6, cols = 6
      const cw = Math.floor(w/cols), rh = Math.floor(h/rows)
      let k=0
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const sx = symbols[k % symbols.length]
          const basePx = base[sx] || 100
          const price = basePx + Math.sin((t*0.002)+(k*0.7))* (3 + (k%5))
          const chg = Math.sin((t*0.0012)+(k*0.9))*1.8
          const col = chg>=0 ? COL.green : COL.red
          const cx = x + c*cw + 10, cy = y + r*rh + 18
          ctx.fillStyle = COL.gray; ctx.fillText(sx, cx, cy)
          ctx.fillStyle = col; ctx.fillText(price.toFixed(2), cx+60, cy)
          ctx.fillStyle = col; ctx.fillText((chg>=0?'+':'')+chg.toFixed(2)+'%', cx+128, cy)
          k++
        }
      }
      ctx.restore()
    }

    function drawHeatmap(x:number,y:number,w:number,h:number,t:number){
      // layout into grid
      const cols = 10, rows = 3
      const bw = Math.floor(w/cols)-6, bh = Math.floor(h/rows)-6
      for(let i=0;i<heat.length;i++){
        const c = i%cols, r = Math.floor(i/cols)
        const hx = x + c*(bw+6), hy = y + r*(bh+6)
        const v = heat[i].v = Math.sin((t*0.001)+(i*0.37))
        const g = v>=0 ? COL.green : COL.red
        ctx.fillStyle = v>=0 ? `rgba(0,208,132,${0.25+Math.min(0.7,Math.abs(v))})`
                             : `rgba(255,77,77,${0.25+Math.min(0.7,Math.abs(v))})`
        ctx.fillRect(hx,hy,bw,bh)
        ctx.strokeStyle = g; ctx.strokeRect(hx+0.5,hy+0.5,bw-1,bh-1)
      }
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = COL.faint
      ctx.fillText('Sector Heatmap', x+6, y+14)
    }

    function drawSparkline(x:number,y:number,w:number,h:number,t:number){
      drawGrid(x,y,w,h,40)
      // animated spark
      ctx.save()
      ctx.beginPath()
      for(let i=0;i<spark.length;i++){
        const px = x + (i/(spark.length-1))*w
        const py = y + h*0.5 + spark[(i+Math.floor(t*0.08))%spark.length]*h*0.25
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py)
      }
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2; ctx.stroke()
      ctx.restore()

      // little candlesticks
      ctx.save()
      for(let i=0;i<40;i++){
        const px = x + (i/40)*w
        const v = Math.sin((i*0.6)+t*0.012)
        const up = v>0
        ctx.strokeStyle = up?COL.green:COL.red
        ctx.beginPath(); ctx.moveTo(px, y+h*0.6); ctx.lineTo(px, y+h*0.6 - v*30); ctx.stroke()
      }
      ctx.restore()

      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = COL.faint
      ctx.fillText('Indices & Microstructure', x+6, y+14)
    }

    function drawNews(x:number,y:number,w:number,h:number,t:number){
      ctx.save()
      ctx.fillStyle='rgba(255,255,255,0.06)'
      ctx.fillRect(x,y,w,h)
      ctx.font='12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle=COL.amber
      ctx.fillText('NEWSWIRE', x+10, y+18)
      ctx.fillStyle=COL.gray
      const items = [
        'M&A chatter in semis boosts targets',
        'Rates drift as markets weigh CPI print',
        'Energy edges higher amid supply concerns',
        'Buybacks accelerate in mega-cap tech',
        'Banks guide on NIM stabilization'
      ]
      for(let i=0;i<items.length;i++){
        const yy = y+38 + i*18
        const off = Math.sin((t*0.001)+i)*4
        ctx.fillText('• '+items[i], x+12+off, yy)
      }
      ctx.restore()
    }

    function drawTerminal(t:number){
      // layout regions (top quote wall, right heatmap, bottom sparkline, left news)
      const pad = 28
      const topH = Math.min(220, H*0.28)
      const rightW = Math.min(420, W*0.32)
      const botH = Math.min(200, H*0.26)
      const leftW = Math.min(360, W*0.28)

      // top quotes
      drawQuotePanel(pad, pad, W - pad*2, topH - pad, t)

      // right heatmap
      drawHeatmap(W - rightW - pad, topH + pad, rightW, H - (topH + botH + pad*3), t)

      // bottom sparkline
      drawSparkline(pad, H - botH - pad, W - (leftW + pad*3), botH, t)

      // left news
      drawNews(pad, topH + pad, leftW, H - (topH + botH + pad*3), t)
    }

    function frame(now:number){
      if (stop) return
      // clear to pitch black
      ctx.fillStyle = COL.bg; ctx.fillRect(0,0,W,H)

      // ease spotlight center & radius
      const cx = target.current.x<0 ? W*0.5 : lerp(last.current.x, target.current.x, 0.18)
      const cy = target.current.y<0 ? H*0.5 : lerp(last.current.y, target.current.y, 0.18)
      last.current.x = cx; last.current.y = cy
      radius.current.cur = lerp(radius.current.cur, radius.current.target, 0.12)

      // reveal terminal ONLY inside circular clip
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, radius.current.cur, 0, Math.PI*2); ctx.clip()
      drawTerminal(now)
      ctx.restore()

      // inner glow
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius.current.cur*1.25)
      rg.addColorStop(0, 'rgba(0,185,255,0.18)')
      rg.addColorStop(1, 'rgba(0,185,255,0.00)')
      ctx.fillStyle = rg; ctx.fillRect(0,0,W,H)

      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // pointer logic
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    function pointer(x:number,y:number){
      target.current = { x, y }
      const now = performance.now()
      const dt = Math.max(1, now - (last.current.t || now))
      const spd = Math.hypot(x-last.current.x, y-last.current.y)/dt*1000
      radius.current.target = Math.max(200, Math.min(380, 220 + spd*0.06))
      last.current.t = now
    }
    const onMove = (e:MouseEvent)=>{ if(!prefersReduced.matches) pointer(e.clientX,e.clientY) }
    const onTouch = (e:TouchEvent)=>{ const t=e.touches[0]; if(t) pointer(t.clientX,t.clientY) }

    document.addEventListener('mousemove', onMove, { passive:true })
    document.addEventListener('touchstart', onTouch, { passive:true })

    return ()=>{ stop=true; ro.disconnect(); document.removeEventListener('mousemove', onMove); document.removeEventListener('touchstart', onTouch) }
  },[])

  return <canvas ref={ref} className='fixed inset-0 -z-30 pointer-events-none' aria-hidden/>
}
