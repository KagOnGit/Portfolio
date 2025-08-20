'use client';
import React, { useEffect, useRef } from 'react';

export default function RootBloombergCanvas() {
  const mainRef = useRef<HTMLCanvasElement|null>(null);
  const offRef = useRef<HTMLCanvasElement|null>(null);
  const mouse = useRef({ x: 0, y: 0, inside: false });
  const radius = useRef({ cur: 0, target: 0 });
  const dpr = typeof window !== 'undefined' ? Math.max(1, Math.min(2, window.devicePixelRatio || 1)) : 1;

  useEffect(() => {
    const canvas = mainRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const off = offRef.current = document.createElement('canvas');
    const octx = off.getContext('2d', { alpha: true })!;

    let w = 0, h = 0, raf = 0;
    const t0 = performance.now();

    const quotes = [
      { s:'AAPL', p: 192.42, d:+0.83 }, { s:'GOOGL', p:168.83, d:-0.21 },
      { s:'MSFT', p: 421.10, d:+0.37 }, { s:'TSLA',  p:218.54, d:-1.72 },
      { s:'NVDA', p: 130.90, d:+1.11 }, { s:'META',  p:311.32, d:+0.95 },
    ];

    // Mini orderbook columns
    const book = new Array(18).fill(0).map((_,i)=>({
      px: 100 + i*2 + Math.sin(i)*1,
      vol: 8 + Math.floor(Math.random()*18),
      side: i%2 ? 'bid':'ask'
    }));

    const sparks = new Array(6).fill(0).map((_,k)=>({
      x: 0, y: 0, pts: new Array(48).fill(0).map((__,i)=>100+Math.sin(i*0.35 + k)*24 + Math.random()*8)
    }));

    const heat = new Array(36).fill(0).map((_,i)=>({ x:i%9, y:(i/9|0), v:Math.random() }));

    function resize(){
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      off.width = Math.floor(w*dpr); off.height = Math.floor(h*dpr);
      octx.setTransform(dpr,0,0,dpr,0,0);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Pointer handling
    function enter(){ mouse.current.inside = true; radius.current.target = 360; }
    function leave(){ mouse.current.inside = false; radius.current.target = 0; }
    function move(e: PointerEvent){ mouse.current.x = e.clientX; mouse.current.y = e.clientY; if(!mouse.current.inside) enter(); }
    window.addEventListener('pointermove', move, { passive:true });
    window.addEventListener('pointerleave', leave);

    // Scene drawing (offscreen)
    function drawScene(now:number){
      const t = (now - t0);

      // clear
      octx.clearRect(0,0,w,h);

      // grid
      octx.save();
      octx.globalAlpha = 0.14;
      octx.strokeStyle = '#0b3750';
      const step = 40;
      for(let x=0;x<=w;x+=step){ octx.beginPath(); octx.moveTo(x,0); octx.lineTo(x,h); octx.stroke(); }
      for(let y=0;y<=h;y+=step){ octx.beginPath(); octx.moveTo(0,y); octx.lineTo(w,y); octx.stroke(); }
      octx.restore();

      // quotes panel (top left)
      octx.save();
      const qx = 72, qy = 90;
      octx.font = '12px Inter, system-ui, -apple-system';
      octx.textBaseline = 'top';
      quotes.forEach((q,i)=>{
        const flick = (Math.sin(t*0.003 + i*1.6))*0.15;
        const up = q.d >= 0;
        octx.fillStyle = 'rgba(165,185,205,0.85)'; octx.fillText(q.s, qx, qy + i*18);
        octx.fillStyle = up ? 'rgba(30,220,140,0.9)' : 'rgba(255,80,80,0.9)';
        octx.fillText((q.p+flick).toFixed(2), qx+56, qy + i*18);
        octx.fillText((q.d + 0.02*Math.sin(t*0.004+i)).toFixed(2)+'%', qx+120, qy + i*18);
      });
      octx.restore();

      // candlesticks strip
      octx.save();
      const baseY = 240, stepX = 14;
      for(let i=0;i<80;i++){
        const cx = qx + i*stepX;
        const mid = 100 + 20*Math.sin(i*0.25 + t*0.002);
        const o = mid + 20*Math.sin(i*0.35 + t*0.003);
        const c = mid + 20*Math.sin(i*0.31 + t*0.0035);
        const hi = Math.max(o,c) + 10 + 6*Math.sin(i*0.4 + t*0.001);
        const lo = Math.min(o,c) - 10 - 6*Math.cos(i*0.3 + t*0.0013);
        const up = c>=o;

        // wick
        octx.strokeStyle = 'rgba(0,160,255,0.55)';
        octx.beginPath(); octx.moveTo(cx, baseY - lo); octx.lineTo(cx, baseY - hi); octx.stroke();

        // body
        octx.fillStyle = up ? 'rgba(30,220,140,0.5)' : 'rgba(255,80,80,0.5)';
        const top = baseY - Math.max(o,c);
        const hgt = Math.max(4, Math.abs(c-o));
        octx.fillRect(cx-3, top, 6, hgt);
      }
      octx.restore();

      // mini heatmap (top right)
      octx.save();
      const cw=16,ch=24, ox=w-9*(cw+6)-72, oy=94;
      for(let i=0;i<heat.length;i++){
        const c = heat[i]; const x = ox + c.x*(cw+6); const y = oy + c.y*(ch+6);
        const vv = 0.35 + 0.65*(0.5 + 0.5*Math.sin(t*0.0015 + i));
        const g = Math.min(1, Math.max(0, vv));
        const r = 1-g;
        octx.fillStyle = `rgba(${Math.floor(210*r)}, ${Math.floor(255*g)}, 130, 0.4)`;
        octx.fillRect(x,y,cw,ch);
        octx.strokeStyle = 'rgba(0,120,255,0.25)'; octx.strokeRect(x+0.5,y+0.5,cw-1,ch-1);
      }
      octx.restore();

      // orderbook bars (bottom right)
      octx.save();
      const bx = w - 380, by = h - 120;
      book.forEach((b,i)=>{
        const len = b.vol + 6*Math.sin(t*0.003 + i);
        octx.fillStyle = b.side==='bid' ? 'rgba(30,220,140,0.35)' : 'rgba(255,80,80,0.35)';
        octx.fillRect(bx + (b.side==='bid'? 180-len : 200), by + i*6, (b.side==='bid'? len : len), 4);
      });
      octx.restore();

      // 3 small sparklines bottom
      octx.save();
      const sx = 160, sy = h - 110;
      octx.strokeStyle = 'rgba(0,140,255,0.6)'; octx.lineWidth = 2;
      sparks.forEach((s,k)=>{
        const y0 = sy + k*26;
        octx.beginPath();
        for(let i=0;i<s.pts.length;i++){
          const px = sx + i*6;
          const py = y0 - (s.pts[i] + 6*Math.sin(t*0.003 + i*0.25 + k));
          if (i === 0) {
            octx.moveTo(px, py);
          } else {
            octx.lineTo(px, py);
          }
        }
        octx.stroke();
      });
      octx.restore();
    }

    // Composite spotlight to main canvas
    function drawToMain(){
      // Base black
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0,w,h);

      // Draw offscreen scene
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(off, 0, 0, w*dpr, h*dpr, 0, 0, w, h);

      // Black it out, then punch a circular window with gradient soften
      ctx.globalCompositeOperation = 'destination-in';
      const r = radius.current.cur;
      const grd = ctx.createRadialGradient(mouse.current.x, mouse.current.y, Math.max(0,r*0.6), mouse.current.x, mouse.current.y, r);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, r, 0, Math.PI*2);
      ctx.fill();

      // Reset
      ctx.globalCompositeOperation = 'source-over';
    }

    function tick(now:number){
      // ease radius
      radius.current.cur += (radius.current.target - radius.current.cur) * 0.15;

      drawScene(now);
      drawToMain();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Idle timer to collapse spotlight
    let idleTimer:number|undefined;
    const wake = () => { 
      radius.current.target = 360; 
      if(idleTimer) clearTimeout(idleTimer); 
      idleTimer = window.setTimeout(() => {
        radius.current.target = 0;
      }, 2200); 
    };
    window.addEventListener('pointermove', wake, { passive:true });
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointermove', wake);
    };
  }, [dpr]);

  return (
    <canvas
      ref={mainRef}
      className='pointer-events-none fixed inset-0 -z-10'
      aria-hidden='true'
    />
  );
}
