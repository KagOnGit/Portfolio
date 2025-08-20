'use client';

import React, { useRef, useEffect, useState } from 'react';

interface TradingHoverCanvasProps {
  className?: string;
}

// Trading scene elements data - moved outside component to avoid eslint warning
const tradingElements = [
  { type: 'chart', x: 0.15, y: 0.2, width: 0.3, height: 0.15 },
  { type: 'numbers', x: 0.6, y: 0.15, width: 0.25, height: 0.1 },
  { type: 'graph', x: 0.1, y: 0.45, width: 0.4, height: 0.2 },
  { type: 'tickers', x: 0.55, y: 0.4, width: 0.35, height: 0.08 },
  { type: 'bars', x: 0.2, y: 0.75, width: 0.6, height: 0.15 },
];

export default function TradingHoverCanvas({ className = '' }: TradingHoverCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        canvasRef.current.width = rect.width * window.devicePixelRatio;
        canvasRef.current.height = rect.height * window.devicePixelRatio;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas with pitch black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Create spotlight gradient
      const spotlightRadius = 200;
      const gradient = ctx.createRadialGradient(
        mousePos.x, mousePos.y, 0,
        mousePos.x, mousePos.y, spotlightRadius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // Draw trading scene elements within spotlight
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      tradingElements.forEach((element) => {
        const elemX = element.x * dimensions.width;
        const elemY = element.y * dimensions.height;
        const elemWidth = element.width * dimensions.width;
        const elemHeight = element.height * dimensions.height;

        // Calculate distance from mouse to element center
        const elemCenterX = elemX + elemWidth / 2;
        const elemCenterY = elemY + elemHeight / 2;
        const distance = Math.sqrt(
          Math.pow(mousePos.x - elemCenterX, 2) + Math.pow(mousePos.y - elemCenterY, 2)
        );

        // Only render if within spotlight radius
        if (distance < spotlightRadius) {
          const opacity = Math.max(0, 1 - distance / spotlightRadius);
          
          ctx.save();
          ctx.globalAlpha = opacity;

          switch (element.type) {
            case 'chart':
              drawTradingChart(ctx, elemX, elemY, elemWidth, elemHeight);
              break;
            case 'numbers':
              drawNumbers(ctx, elemX, elemY, elemWidth, elemHeight);
              break;
            case 'graph':
              drawGraph(ctx, elemX, elemY, elemWidth, elemHeight);
              break;
            case 'tickers':
              drawTickers(ctx, elemX, elemY, elemWidth, elemHeight);
              break;
            case 'bars':
              drawBars(ctx, elemX, elemY, elemWidth, elemHeight);
              break;
          }

          ctx.restore();
        }
      });

      ctx.restore();

      // Apply spotlight overlay
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, dimensions]);

  // Drawing functions for trading elements
  const drawTradingChart = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const points = 8;
    for (let i = 0; i <= points; i++) {
      const px = x + (i / points) * width;
      const py = y + height * (0.3 + 0.4 * Math.sin(i * 0.8 + Date.now() * 0.002));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Add candlesticks
    for (let i = 0; i < 6; i++) {
      const cx = x + (i / 5) * width * 0.8 + width * 0.1;
      const high = y + height * 0.2;
      const low = y + height * 0.8;
      const open = y + height * (0.3 + Math.random() * 0.4);
      const close = y + height * (0.3 + Math.random() * 0.4);

      ctx.strokeStyle = open < close ? '#00ff88' : '#ff4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, high);
      ctx.lineTo(cx, low);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(cx - 3, Math.min(open, close), 6, Math.abs(close - open));
    }
  };

  const drawNumbers = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const numbers = ['$45,234.67', '+2.3%', '1,234,567', '$98.45', '+0.8%'];
    ctx.fillStyle = '#00d4ff';
    ctx.font = '14px monospace';
    
    numbers.forEach((num, i) => {
      ctx.fillText(num, x, y + (i + 1) * (height / numbers.length));
    });
  };

  const drawGraph = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y + height);
    
    const points = 20;
    for (let i = 0; i <= points; i++) {
      const px = x + (i / points) * width;
      const py = y + height * (0.7 - 0.5 * Math.sin(i * 0.3 + Date.now() * 0.001));
      ctx.lineTo(px, py);
    }
    
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawTickers = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const tickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    
    tickers.forEach((ticker, i) => {
      const tickerX = x + (i / (tickers.length - 1)) * width * 0.8;
      ctx.fillText(ticker, tickerX, y + height / 2);
      
      // Add price change
      ctx.fillStyle = Math.random() > 0.5 ? '#00ff88' : '#ff4444';
      ctx.fillText(Math.random() > 0.5 ? '+2.1%' : '-1.3%', tickerX, y + height);
      ctx.fillStyle = '#ffffff';
    });
  };

  const drawBars = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const bars = 12;
    const barWidth = width / bars * 0.8;
    
    for (let i = 0; i < bars; i++) {
      const barHeight = height * (0.2 + 0.6 * Math.random());
      const barX = x + i * (width / bars);
      const barY = y + height - barHeight;
      
      ctx.fillStyle = `hsl(${200 + Math.random() * 60}, 80%, 60%)`;
      ctx.fillRect(barX, barY, barWidth, barHeight);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    />
  );
}
