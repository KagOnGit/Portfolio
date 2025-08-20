'use client';
import React, { useEffect, useRef } from 'react';
import {
  generateQuotes,
  generateCandles,
  generateDepth,
  generateTrades,
  generateSectorReturns,
  generateFXRates,
  generateSparklines,
  generateMacroData,
  generateNews
} from './sim';
import {
  drawGrid,
  drawQuotes,
  drawCandles,
  drawDepth,
  drawTimeAndSales,
  drawHeatmap,
  drawSparklines,
  drawMacro,
  drawFX,
  drawOptionsSkew,
  drawVolSurface,
  drawNewsTicker
} from './draw';
import type { DrawState } from './draw';

// Layout zones (avoiding nav header)
const ZONES = {
  quotes: { x: 60, y: 80, width: 240, height: 120 },
  candles: { x: 320, y: 80, width: 480, height: 180 },
  heatmap: { x: 820, y: 80, width: 280, height: 160 },
  depth: { x: 60, y: 220, width: 240, height: 280 },
  timeAndSales: { x: 320, y: 280, width: 180, height: 200 },
  sparklines: { x: 520, y: 280, width: 280, height: 200 },
  macro: { x: 820, y: 260, width: 280, height: 220 },
  fx: { x: 60, y: 520, width: 240, height: 160 },
  optionsSkew: { x: 320, y: 500, width: 180, height: 120 },
  volSurface: { x: 520, y: 500, width: 180, height: 120 },
  newsTicker: { x: 720, y: 500, width: 380, height: 40 }
};

export default function RootBloombergCanvas() {
  const mainRef = useRef<HTMLCanvasElement|null>(null);
  const offRef = useRef<HTMLCanvasElement|null>(null);
  const mouse = useRef({ x: 0, y: 0, inside: false });
  const radius = useRef({ cur: 0, target: 0 });
  const dataState = useRef<DrawState>({
    quotes: [],
    candles: [],
    depth: [],
    trades: [],
    sectors: [],
    fxRates: [],
    yields: [],
    headlines: [],
    sparklines: [],
    macroData: []
  });
  
  const dpr = typeof window !== 'undefined' ? Math.max(1, Math.min(2, window.devicePixelRatio || 1)) : 1;

  useEffect(() => {
    const canvas = mainRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const off = offRef.current = document.createElement('canvas');
    const octx = off.getContext('2d', { alpha: true })!;

    let w = 0, h = 0, raf = 0;
    const t0 = performance.now();

    // Initialize data
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'META', 'AMZN', 'NFLX'];
    dataState.current.quotes = generateQuotes(symbols);
    dataState.current.candles = generateCandles('AAPL', 60);
    dataState.current.depth = generateDepth();
    dataState.current.trades = [];
    dataState.current.sectors = generateSectorReturns();
    dataState.current.fxRates = generateFXRates();
    dataState.current.sparklines = generateSparklines(symbols.slice(0, 6));
    dataState.current.macroData = generateMacroData();
    dataState.current.headlines = generateNews();

    function resize() {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      off.width = Math.floor(w * dpr);
      off.height = Math.floor(h * dpr);
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Pointer handling with nav exclusion
    function isInExclusionZone(x: number, y: number): boolean {
      // Exclude header nav area (top 60px)
      return y < 60;
    }

    function enter() {
      mouse.current.inside = true;
      radius.current.target = 360;
    }

    function leave() {
      mouse.current.inside = false;
      radius.current.target = 0;
    }

    function move(e: PointerEvent) {
      if (isInExclusionZone(e.clientX, e.clientY)) {
        leave();
        return;
      }
      
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!mouse.current.inside) enter();
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);

    // Data update loop (slower than render)
    let lastDataUpdate = 0;
    function updateData(now: number) {
      if (now - lastDataUpdate > 200) { // Update every 200ms
        // Update quotes with small movements
        dataState.current.quotes.forEach(quote => {
          const change = (Math.random() - 0.5) * 0.1;
          quote.price *= (1 + change / 100);
          quote.change += change * 0.1;
        });

        // Add new trades periodically
        if (Math.random() < 0.3) {
          const newTrade = generateTrades('AAPL', 1)[0];
          dataState.current.trades.push(newTrade);
          if (dataState.current.trades.length > 50) {
            dataState.current.trades.shift();
          }
        }

        // Update sparklines
        dataState.current.sparklines.forEach(spark => {
          const lastPrice = spark.prices[spark.prices.length - 1];
          const newPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.02);
          spark.prices.push(newPrice);
          spark.current = newPrice;
          if (spark.prices.length > 100) {
            spark.prices.shift();
          }
        });

        lastDataUpdate = now;
      }
    }

    // Scene drawing (offscreen)
    function drawScene(now: number) {
      const t = now - t0;
      
      updateData(now);
      
      // Clear offscreen canvas
      octx.clearRect(0, 0, w, h);
      
      // Draw background grid and vignette
      drawGrid(octx, w, h);
      
      // Adjust zones based on screen size
      const scaleX = w / 1200;
      const scaleY = h / 800;
      
      // Draw all modules with scaled positions
      Object.entries(ZONES).forEach(([key, zone]) => {
        const scaledZone = {
          x: zone.x * scaleX,
          y: zone.y * scaleY,
          width: zone.width * scaleX,
          height: zone.height * scaleY
        };
        
        // Skip if zone would be too small or off-screen
        if (scaledZone.width < 50 || scaledZone.height < 30) return;
        if (scaledZone.x + scaledZone.width > w || scaledZone.y + scaledZone.height > h) return;
        
        switch (key) {
          case 'quotes':
            drawQuotes(octx, scaledZone, t, dataState.current.quotes);
            break;
          case 'candles':
            drawCandles(octx, scaledZone, t, dataState.current.candles);
            break;
          case 'heatmap':
            drawHeatmap(octx, scaledZone, t, dataState.current.sectors);
            break;
          case 'depth':
            drawDepth(octx, scaledZone, t, dataState.current.depth);
            break;
          case 'timeAndSales':
            drawTimeAndSales(octx, scaledZone, t, dataState.current.trades);
            break;
          case 'sparklines':
            drawSparklines(octx, scaledZone, t, dataState.current.sparklines);
            break;
          case 'macro':
            drawMacro(octx, scaledZone, t, dataState.current.macroData);
            break;
          case 'fx':
            drawFX(octx, scaledZone, t, dataState.current.fxRates);
            break;
          case 'optionsSkew':
            drawOptionsSkew(octx, scaledZone, t);
            break;
          case 'volSurface':
            drawVolSurface(octx, scaledZone, t);
            break;
          case 'newsTicker':
            drawNewsTicker(octx, scaledZone, t, dataState.current.headlines);
            break;
        }
      });
    }

    // Composite spotlight to main canvas
    function drawToMain() {
      // Base black
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      // Draw offscreen scene
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(off, 0, 0, w * dpr, h * dpr, 0, 0, w, h);

      // Black it out, then punch a circular window with gradient soften
      ctx.globalCompositeOperation = 'destination-in';
      const r = radius.current.cur;
      
      if (r > 0) {
        const grd = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, Math.max(0, r * 0.6),
          mouse.current.x, mouse.current.y, r
        );
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset
      ctx.globalCompositeOperation = 'source-over';
    }

    // Main animation loop
    function tick(now: number) {
      // Ease radius with smooth interpolation
      radius.current.cur += (radius.current.target - radius.current.cur) * 0.12;
      
      // Only draw if there's meaningful change or animation
      drawScene(now);
      drawToMain();
      
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Idle timer to collapse spotlight
    let idleTimer: number | undefined;
    const wake = () => {
      if (mouse.current.inside) {
        radius.current.target = 360;
      }
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        radius.current.target = 0;
      }, 3000); // 3 second idle timeout
    };
    
    window.addEventListener('pointermove', wake, { passive: true });
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointermove', wake);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [dpr]);

  return (
    <canvas
      ref={mainRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
