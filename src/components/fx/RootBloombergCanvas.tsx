'use client';
import React, { useEffect, useRef } from 'react';

export default function RootBloombergCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 400, y: 300 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let raf = 0;
    const state = {
      t: 0,
      w: 0, h: 0,
      quotes: [
        { s:'AAPL', p: 192.4, d: +0.83 },
        { s:'GOOGL', p: 168.8, d: -0.21 },
        { s:'MSFT', p: 421.1, d: +0.37 },
        { s:'TSLA', p: 218.5, d: -1.72 },
        { s:'NVDA', p: 130.9, d: +1.11 },
      ],
      heat: new Array(18).fill(0).map((_,i)=>({ v: 0.2 + 0.8*Math.random(), x: i%6, y: (i/6|0) })),
      candles: new Array(32).fill(0).map((_,i)=>({
        x:i, o: rand(80,120), h: rand(120,140), l: rand(60,90), c: rand(80,120)
      }))
    };

    function rand(a:number,b:number){ return a + Math.random()*(b-a); }

    const resize = () => {
      state.w = window.innerWidth;
      state.h = window.innerHeight;
      canvas.width = Math.floor(state.w * dpr);
      canvas.height = Math.floor(state.h * dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointer = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    function drawGrid() {
      const { w,h } = state;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#0b3750';
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
      }
      ctx.restore();
    }

    function drawHeatmap(t:number){
      const { w } = state;
      const cw = 18, ch = 28;
      const ox = w - cw*12 - 56;
      const oy = 90;
      ctx.save();
      for (let i=0;i<state.heat.length;i++){
        const c = state.heat[i];
        const v = 0.5 + 0.5*Math.sin(t*0.001 + i);
        const green = c.v*v;
        const red = 1 - green;
        ctx.fillStyle = `rgba(${Math.floor(220*red)}, ${Math.floor(255*green)}, 120, 0.35)`;
        const xPos = ox + c.x*(cw+6);
        const yPos = oy + c.y*(ch+6);
        ctx.fillRect(xPos, yPos, cw, ch);
        ctx.strokeStyle = 'rgba(0,120,255,0.25)';
        ctx.strokeRect(xPos+0.5, yPos+0.5, cw-1, ch-1);
      }
      ctx.restore();
    }

    function drawQuotes(t:number){
      const { quotes } = state;
      ctx.save();
      ctx.font = '12px Inter, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.textBaseline = 'top';
      const xPos = 80;
      let yPos = 110;
      quotes.forEach((q,i)=>{
        const flick = 0.2*Math.sin(t*0.003 + i*1.7);
        const up = q.d >= 0;
        ctx.fillStyle = 'rgba(160,180,200,0.75)';
        ctx.fillText(q.s, xPos, yPos);
        ctx.fillStyle = up ? 'rgba(30,220,140,0.85)' : 'rgba(255,80,80,0.85)';
        ctx.fillText((q.p + flick).toFixed(2), xPos+60, yPos);
        ctx.fillText((q.d + 0.02*Math.sin(t*0.004+i)).toFixed(2)+'%', xPos+120, yPos);
        yPos += 20;
      });
      ctx.restore();
    }

    function drawCandles(t:number){
      const { candles } = state;
      const baseY = 360;
      const step = 18;
      ctx.save();
      candles.forEach((c,i)=>{
        const cx = 80 + i*step;
        const off = Math.sin(t*0.002 + i*0.35)*6;
        const up = c.c >= c.o;
        // wick
        ctx.strokeStyle = 'rgba(0,160,255,0.55)';
        ctx.beginPath();
        ctx.moveTo(cx, baseY - c.l - off);
        ctx.lineTo(cx, baseY - c.h - off);
        ctx.stroke();
        // body
        ctx.fillStyle = up ? 'rgba(30,220,140,0.5)' : 'rgba(255,80,80,0.5)';
        const top = baseY - Math.max(c.o,c.c) - off;
        const h = Math.abs(c.c - c.o);
        ctx.fillRect(cx-4, top, 8, Math.max(4,h));
      });
      ctx.restore();
    }

    function drawCursorGlow(){
      const r = 180;
      const g = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, r);
      g.addColorStop(0, 'rgba(0,120,255,0.22)');
      g.addColorStop(1, 'rgba(0,120,255,0.0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, r, 0, Math.PI*2);
      ctx.fill();
    }

    function loop(now:number){
      state.t = now;
      ctx.clearRect(0,0,state.w,state.h);
      // Depth ordering (back to front):
      drawGrid();
      drawHeatmap(now);
      drawQuotes(now);
      drawCandles(now);
      drawCursorGlow();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden='true'
      className='fx-layer pointer-events-none fixed inset-0 -z-10'
    />
  );
}
