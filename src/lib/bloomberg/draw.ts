// Modular drawing functions for Bloomberg terminal modules
// All functions accept context, bounds, timing, and data state
// Optimized for 60fps rendering with minimal allocations

import type { 
  QuoteData, 
  CandleData, 
  DepthLevel, 
  TradeData 
} from './sim';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawState {
  quotes: QuoteData[];
  candles: CandleData[];
  depth: DepthLevel[];
  trades: TradeData[];
  sectors: { sector: string; return: number }[];
  fxRates: { pair: string; rate: number; change: number }[];
  yields: { duration: string; yield: number }[];
  headlines: string[];
  sparklines: { symbol: string; prices: number[]; current: number }[];
  macroData: { name: string; value: number; change: number }[];
}

// 1. Terminal Grid & Vignette
export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.strokeStyle = '#0d2235';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.15;
  
  const step = 40;
  for (let x = step; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = step; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Subtle vignette
  ctx.globalAlpha = 0.08;
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.restore();
}

// 2. Quotes Tape (top-left)
export function drawQuotes(
  ctx: CanvasRenderingContext2D, 
  bounds: Bounds, 
  now: number, 
  quotes: QuoteData[]
): void {
  ctx.save();
  ctx.fillStyle = '#0f1b2e';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.font = '11px "SF Mono", "Monaco", "Consolas", monospace';
  ctx.textBaseline = 'top';
  
  const itemHeight = 16;
  const padding = 8;
  
  quotes.slice(0, Math.floor((bounds.height - padding * 2) / itemHeight)).forEach((quote, i) => {
    const y = bounds.y + padding + i * itemHeight;
    const flickerIntensity = Math.sin(now * 0.003 + i * 1.7) * 0.1;
    const isUp = quote.change >= 0;
    
    // Symbol
    ctx.fillStyle = '#a0b4c8';
    ctx.fillText(quote.symbol, bounds.x + padding, y);
    
    // Price with flicker
    const displayPrice = quote.price * (1 + flickerIntensity * 0.001);
    ctx.fillStyle = isUp ? '#1ed47c' : '#ff5050';
    ctx.fillText(displayPrice.toFixed(2), bounds.x + padding + 50, y);
    
    // Change
    const changeText = (quote.change >= 0 ? '+' : '') + quote.change.toFixed(2) + '%';
    ctx.fillText(changeText, bounds.x + padding + 110, y);
  });
  
  ctx.restore();
}

// 3. Candlestick Chart with EMAs
export function drawCandles(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  candles: CandleData[]
): void {
  if (candles.length === 0) return;
  
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  const candleWidth = Math.max(2, (bounds.width - 16) / candles.length);
  const priceRange = Math.max(...candles.map(c => c.high)) - Math.min(...candles.map(c => c.low));
  const scaleY = (bounds.height - 16) / priceRange;
  
  // Draw candles
  candles.forEach((candle, i) => {
    const x = bounds.x + 8 + i * candleWidth;
    const centerX = x + candleWidth / 2;
    
    const highY = bounds.y + 8 + (Math.max(...candles.map(c => c.high)) - candle.high) * scaleY;
    const lowY = bounds.y + 8 + (Math.max(...candles.map(c => c.high)) - candle.low) * scaleY;
    const openY = bounds.y + 8 + (Math.max(...candles.map(c => c.high)) - candle.open) * scaleY;
    const closeY = bounds.y + 8 + (Math.max(...candles.map(c => c.high)) - candle.close) * scaleY;
    
    const isUp = candle.close >= candle.open;
    
    // Wick
    ctx.strokeStyle = '#4a7fa7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, highY);
    ctx.lineTo(centerX, lowY);
    ctx.stroke();
    
    // Body
    ctx.fillStyle = isUp ? 'rgba(30, 212, 124, 0.8)' : 'rgba(255, 80, 80, 0.8)';
    ctx.strokeStyle = isUp ? '#1ed47c' : '#ff5050';
    ctx.lineWidth = 1;
    
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY);
    
    ctx.fillRect(x, bodyTop, candleWidth - 1, Math.max(1, bodyHeight));
    ctx.strokeRect(x, bodyTop, candleWidth - 1, Math.max(1, bodyHeight));
  });
  
  ctx.restore();
}

// 4. Order Book Depth
export function drawDepth(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  depth: DepthLevel[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  const bids = depth.filter(d => d.side === 'bid').slice(0, 12);
  const asks = depth.filter(d => d.side === 'ask').slice(0, 12);
  const maxSize = Math.max(...depth.map(d => d.size));
  
  const centerY = bounds.y + bounds.height / 2;
  const rowHeight = Math.min(12, (bounds.height - 20) / 24);
  
  ctx.font = '9px "SF Mono", monospace';
  ctx.textBaseline = 'middle';
  
  // Bids (green, top half)
  bids.forEach((bid, i) => {
    const y = centerY - (i + 1) * rowHeight;
    const barWidth = (bid.size / maxSize) * (bounds.width - 60) * (1 + Math.sin(now * 0.002 + i) * 0.05);
    
    ctx.fillStyle = 'rgba(30, 212, 124, 0.2)';
    ctx.fillRect(bounds.x + 60, y - rowHeight/2, barWidth, rowHeight);
    
    ctx.fillStyle = '#1ed47c';
    ctx.textAlign = 'right';
    ctx.fillText(bid.price.toFixed(2), bounds.x + 55, y);
    ctx.textAlign = 'left';
    ctx.fillText(Math.floor(bid.size).toString(), bounds.x + 65, y);
  });
  
  // Spread indicator
  ctx.fillStyle = '#ff8c42';
  ctx.font = '8px "SF Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPREAD', bounds.x + bounds.width/2, centerY);
  
  // Asks (red, bottom half)
  asks.forEach((ask, i) => {
    const y = centerY + (i + 1) * rowHeight;
    const barWidth = (ask.size / maxSize) * (bounds.width - 60) * (1 + Math.sin(now * 0.002 + i) * 0.05);
    
    ctx.fillStyle = 'rgba(255, 80, 80, 0.2)';
    ctx.fillRect(bounds.x + 60, y - rowHeight/2, barWidth, rowHeight);
    
    ctx.fillStyle = '#ff5050';
    ctx.textAlign = 'right';
    ctx.fillText(ask.price.toFixed(2), bounds.x + 55, y);
    ctx.textAlign = 'left';
    ctx.fillText(Math.floor(ask.size).toString(), bounds.x + 65, y);
  });
  
  ctx.restore();
}

// 5. Time & Sales Scrolling Tape
export function drawTimeAndSales(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  trades: TradeData[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.font = '9px "SF Mono", monospace';
  ctx.textBaseline = 'top';
  
  const rowHeight = 14;
  const scrollOffset = (now * 0.02) % rowHeight;
  const visibleRows = Math.ceil(bounds.height / rowHeight) + 1;
  
  trades.slice(-visibleRows).forEach((trade, i) => {
    const y = bounds.y + bounds.height - (i + 1) * rowHeight + scrollOffset;
    if (y < bounds.y - rowHeight || y > bounds.y + bounds.height) return;
    
    const age = now - trade.timestamp;
    const alpha = Math.max(0.3, 1 - age / 30000);
    
    const time = new Date(trade.timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      timeStyle: 'medium' 
    });
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = trade.side === 'buy' ? '#1ed47c' : '#ff5050';
    
    ctx.textAlign = 'left';
    ctx.fillText(time.slice(-8), bounds.x + 4, y);
    ctx.fillText(trade.price.toFixed(2), bounds.x + 60, y);
    ctx.fillText(Math.floor(trade.size).toString(), bounds.x + 110, y);
  });
  
  ctx.restore();
}

// 6. Sector Heatmap
export function drawHeatmap(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  sectors: { sector: string; return: number }[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  const cols = 4;
  const rows = Math.ceil(sectors.length / cols);
  const cellWidth = (bounds.width - 8) / cols;
  const cellHeight = (bounds.height - 8) / rows;
  
  ctx.font = '8px "SF Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  sectors.forEach((sector, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = bounds.x + 4 + col * cellWidth;
    const y = bounds.y + 4 + row * cellHeight;
    
    // Pulsing effect
    const pulsePhase = now * 0.001 + i * 0.5;
    const pulse = 1 + Math.sin(pulsePhase) * 0.1;
    const intensity = Math.abs(sector.return) / 4 * pulse;
    
    // Color based on return
    const hue = sector.return >= 0 ? 120 : 0; // Green or red
    const saturation = Math.min(80, intensity * 100);
    const lightness = 20 + intensity * 20;
    
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);
    
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.9;
    
    // Draw sector name (abbreviated)
    const shortName = sector.sector.length > 8 ? sector.sector.slice(0, 8) + '.' : sector.sector;
    ctx.fillText(shortName, x + cellWidth/2, y + cellHeight/2 - 6);
    ctx.fillText(`${sector.return >= 0 ? '+' : ''}${sector.return.toFixed(1)}%`, x + cellWidth/2, y + cellHeight/2 + 6);
  });
  
  ctx.restore();
}

// 7. Sparkline Panel
export function drawSparklines(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  sparklines: { symbol: string; prices: number[]; current: number }[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  const tileHeight = bounds.height / sparklines.length;
  
  sparklines.forEach((spark, i) => {
    const tileY = bounds.y + i * tileHeight;
    const padding = 8;
    
    ctx.strokeStyle = '#2a4d6b';
    ctx.beginPath();
    ctx.moveTo(bounds.x, tileY + tileHeight);
    ctx.lineTo(bounds.x + bounds.width, tileY + tileHeight);
    ctx.stroke();
    
    if (spark.prices.length < 2) return;
    
    // Draw sparkline
    const minPrice = Math.min(...spark.prices);
    const maxPrice = Math.max(...spark.prices);
    const priceRange = maxPrice - minPrice || 1;
    const chartWidth = bounds.width - 80;
    const chartHeight = tileHeight - padding * 2;
    
    ctx.strokeStyle = spark.current >= spark.prices[0] ? '#1ed47c' : '#ff5050';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    spark.prices.forEach((price, j) => {
      const x = bounds.x + 60 + (j / (spark.prices.length - 1)) * chartWidth;
      const y = tileY + padding + (1 - (price - minPrice) / priceRange) * chartHeight;
      
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Symbol and price
    ctx.fillStyle = '#a0b4c8';
    ctx.font = '10px "SF Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(spark.symbol, bounds.x + padding, tileY + tileHeight/2 - 6);
    
    ctx.fillStyle = spark.current >= spark.prices[0] ? '#1ed47c' : '#ff5050';
    ctx.fillText(spark.current.toFixed(2), bounds.x + padding, tileY + tileHeight/2 + 6);
  });
  
  ctx.restore();
}

// 8. Macro Dashboard (yields, commodities)
export function drawMacro(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  macroData: { name: string; value: number; change: number }[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  const cols = 2;
  const rows = Math.ceil(macroData.length / cols);
  const cellWidth = bounds.width / cols;
  const cellHeight = bounds.height / rows;
  
  ctx.font = '9px "SF Mono", monospace';
  ctx.textBaseline = 'top';
  
  macroData.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = bounds.x + col * cellWidth;
    const y = bounds.y + row * cellHeight;
    
    // Subtle glow for changed values
    const glowIntensity = Math.abs(item.change) * Math.sin(now * 0.004) * 0.1;
    
    ctx.fillStyle = '#4a7fa7';
    ctx.fillText(item.name, x + 4, y + 4);
    
    ctx.fillStyle = item.change >= 0 ? '#1ed47c' : '#ff5050';
    ctx.globalAlpha = 0.8 + glowIntensity;
    ctx.fillText(item.value.toFixed(2), x + 4, y + 16);
    
    const changeText = (item.change >= 0 ? '+' : '') + item.change.toFixed(2);
    ctx.fillText(changeText, x + 4, y + 28);
  });
  
  ctx.restore();
}

// 9. FX Rates Board
export function drawFX(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  fxRates: { pair: string; rate: number; change: number }[]
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.font = '9px "SF Mono", monospace';
  ctx.textBaseline = 'top';
  
  const itemHeight = 18;
  const padding = 4;
  
  fxRates.slice(0, Math.floor((bounds.height - padding * 2) / itemHeight)).forEach((fx, i) => {
    const y = bounds.y + padding + i * itemHeight;
    const flickerPhase = now * 0.003 + i * 2.1;
    const flicker = Math.sin(flickerPhase) * 0.002;
    
    ctx.fillStyle = '#a0b4c8';
    ctx.fillText(fx.pair, bounds.x + padding, y);
    
    const displayRate = fx.rate * (1 + flicker);
    ctx.fillStyle = fx.change >= 0 ? '#1ed47c' : '#ff5050';
    ctx.fillText(displayRate.toFixed(4), bounds.x + padding + 60, y);
  });
  
  ctx.restore();
}

// 10. Options Skew (simplified smile curve)
export function drawOptionsSkew(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  // Draw simplified volatility smile
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  const amplitude = 20;
  const period = bounds.width * 0.8;
  
  ctx.strokeStyle = '#ff8c42';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i <= period; i += 2) {
    const x = bounds.x + 10 + i;
    const normalized = ((i - period/2) / (period/2)) * 2; // -2 to 2
    const skew = Math.pow(normalized, 2) * 0.5 + Math.sin(now * 0.002) * 0.1; // Parabola with slight movement
    const y = centerY - skew * amplitude;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Add strike dots
  [-1, -0.5, 0, 0.5, 1].forEach((strike) => {
    const x = centerX + strike * period * 0.3;
    const skewValue = Math.pow(strike, 2) * 0.5 + Math.sin(now * 0.002) * 0.1;
    const y = centerY - skewValue * amplitude;
    
    ctx.fillStyle = '#4a7fa7';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // IV% label
  ctx.fillStyle = '#a0b4c8';
  ctx.font = '8px "SF Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('IV%', bounds.x + 4, bounds.y + 4);
  
  ctx.restore();
}

// 11. Volatility Surface Slice
export function drawVolSurface(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number
): void {
  ctx.save();
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  // Draw multiple wavy lines to simulate vol surface slice
  const lines = 5;
  const baseY = bounds.y + bounds.height * 0.7;
  
  for (let line = 0; line < lines; line++) {
    const alpha = 0.3 + (line / lines) * 0.4;
    const yOffset = line * -8;
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#4a7fa7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let x = 0; x < bounds.width; x += 3) {
      const normalizedX = x / bounds.width;
      const wave1 = Math.sin(normalizedX * Math.PI * 4 + now * 0.001 + line) * 10;
      const wave2 = Math.sin(normalizedX * Math.PI * 8 + now * 0.0015) * 5;
      const y = baseY + yOffset + wave1 + wave2;
      
      if (x === 0) {
        ctx.moveTo(bounds.x + x, y);
      } else {
        ctx.lineTo(bounds.x + x, y);
      }
    }
    ctx.stroke();
  }
  
  ctx.restore();
}

// 12. Rolling News Ticker
export function drawNewsTicker(
  ctx: CanvasRenderingContext2D,
  bounds: Bounds,
  now: number,
  headlines: string[]
): void {
  if (headlines.length === 0) return;
  
  ctx.save();
  ctx.fillStyle = '#0f1b2e';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.strokeStyle = '#1e3a52';
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
  ctx.font = '10px "SF Mono", monospace';
  ctx.fillStyle = '#ff8c42';
  ctx.textBaseline = 'middle';
  
  const tickerText = headlines.join('  •  ');
  const scrollSpeed = 0.05;
  const textWidth = ctx.measureText(tickerText).width;
  const scrollOffset = (now * scrollSpeed) % (textWidth + bounds.width);
  const x = bounds.x + bounds.width - scrollOffset;
  
  ctx.fillText(tickerText, x, bounds.y + bounds.height / 2);
  
  // Draw again for seamless loop
  if (x < bounds.x + bounds.width - textWidth) {
    ctx.fillText(tickerText, x + textWidth + bounds.width, bounds.y + bounds.height / 2);
  }
  
  ctx.restore();
}
