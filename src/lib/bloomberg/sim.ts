// Deterministic data simulation for Bloomberg terminal
// All functions use seeded pseudo-random generators for consistent results

export class SeededRNG {
  private seed: number;
  
  constructor(seedStr: string) {
    this.seed = this.hashCode(seedStr);
  }
  
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  
  jitter(center: number, variance: number): number {
    return center + (this.next() - 0.5) * variance * 2;
  }
}

export function createSeededRng(seed: string): SeededRNG {
  return new SeededRNG(seed);
}

// Geometric Brownian Motion for price simulation
export function geometricBrownianMotion(
  initial: number, 
  drift: number, 
  volatility: number, 
  steps: number, 
  dt: number,
  rng: SeededRNG
): number[] {
  const prices = [initial];
  let current = initial;
  
  for (let i = 1; i < steps; i++) {
    const dW = rng.range(-1, 1) * Math.sqrt(dt);
    const dS = current * (drift * dt + volatility * dW);
    current = Math.max(0.01, current + dS);
    prices.push(current);
  }
  
  return prices;
}

// Exponential Moving Average
export function ema(prices: number[], period: number): number[] {
  if (prices.length === 0) return [];
  
  const alpha = 2 / (period + 1);
  const result = [prices[0]];
  
  for (let i = 1; i < prices.length; i++) {
    const emaValue = alpha * prices[i] + (1 - alpha) * result[i - 1];
    result.push(emaValue);
  }
  
  return result;
}

// Market data generators
export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  lastUpdate: number;
}

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

export interface DepthLevel {
  price: number;
  size: number;
  side: 'bid' | 'ask';
}

export interface TradeData {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export class MarketDataSimulator {
  private rng: SeededRNG;
  private baseTime: number;
  
  constructor(seed: string) {
    this.rng = createSeededRng(seed);
    this.baseTime = Date.now();
  }
  
  generateQuotes(symbols: string[], baseTime: number): QuoteData[] {
    const basePrices: Record<string, number> = {
      'AAPL': 192.45, 'GOOGL': 168.83, 'MSFT': 421.12, 'TSLA': 218.54,
      'NVDA': 130.91, 'META': 311.34, 'AMZN': 147.92, 'NFLX': 485.23,
      'CRM': 267.45, 'ORCL': 142.67, 'ADBE': 563.21, 'INTC': 43.76
    };
    
    return symbols.map(symbol => {
      const basePrice = basePrices[symbol] || 100;
      const volatility = this.rng.range(0.02, 0.08);
      const timeVariation = Math.sin(baseTime * 0.001 + this.rng.range(0, Math.PI * 2));
      const price = basePrice * (1 + volatility * timeVariation * this.rng.range(0.5, 1.5));
      const change = (price - basePrice) / basePrice * 100;
      
      return {
        symbol,
        price,
        change,
        lastUpdate: baseTime + this.rng.range(-5000, 0)
      };
    });
  }
  
  generateCandles(count: number, basePrice: number, timeframe: number): CandleData[] {
    const candles: CandleData[] = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < count; i++) {
      const volatility = this.rng.range(0.015, 0.045);
      const trend = this.rng.range(-0.002, 0.002);
      
      const open = currentPrice;
      const priceMove = open * trend + this.rng.jitter(0, open * volatility);
      const close = Math.max(0.01, open + priceMove);
      
      const high = Math.max(open, close) + this.rng.range(0, Math.abs(priceMove) * 0.5);
      const low = Math.min(open, close) - this.rng.range(0, Math.abs(priceMove) * 0.5);
      
      candles.push({
        open,
        high: Math.max(high, Math.max(open, close)),
        low: Math.min(low, Math.min(open, close)),
        close,
        timestamp: this.baseTime + i * timeframe
      });
      
      currentPrice = close;
    }
    
    return candles;
  }
  
  generateDepth(midPrice: number, levels: number): DepthLevel[] {
    const depth: DepthLevel[] = [];
    const spread = midPrice * this.rng.range(0.0001, 0.0008);
    
    // Generate bid levels
    for (let i = 0; i < levels; i++) {
      const price = midPrice - spread/2 - (i * spread * 0.1);
      const size = this.rng.range(100, 5000) * Math.exp(-i * 0.3);
      depth.push({ price, size, side: 'bid' });
    }
    
    // Generate ask levels
    for (let i = 0; i < levels; i++) {
      const price = midPrice + spread/2 + (i * spread * 0.1);
      const size = this.rng.range(100, 5000) * Math.exp(-i * 0.3);
      depth.push({ price, size, side: 'ask' });
    }
    
    return depth;
  }
  
  generateTrades(count: number, midPrice: number, timespan: number): TradeData[] {
    const trades: TradeData[] = [];
    const currentTime = Date.now();
    
    for (let i = 0; i < count; i++) {
      const side = this.rng.next() > 0.5 ? 'buy' : 'sell';
      const priceOffset = this.rng.jitter(0, midPrice * 0.002);
      const price = midPrice + priceOffset;
      const size = this.rng.range(10, 1000);
      const timestamp = currentTime - (count - i) * (timespan / count);
      
      trades.push({ price, size, side, timestamp });
    }
    
    return trades;
  }
  
  generateYieldCurve(): { duration: string; yield: number }[] {
    const durations = ['1M', '3M', '6M', '1Y', '2Y', '5Y', '10Y', '30Y'];
    const baseYields = [4.8, 4.9, 5.0, 4.7, 4.5, 4.2, 4.3, 4.4];
    
    return durations.map((duration, i) => ({
      duration,
      yield: baseYields[i] + this.rng.jitter(0, 0.3)
    }));
  }
  
  generateFXRates(): { pair: string; rate: number; change: number }[] {
    const pairs = [
      { pair: 'EUR/USD', base: 1.0854 },
      { pair: 'USD/JPY', base: 149.82 },
      { pair: 'GBP/USD', base: 1.2634 },
      { pair: 'USD/CHF', base: 0.8976 },
      { pair: 'AUD/USD', base: 0.6534 },
      { pair: 'USD/CAD', base: 1.3621 }
    ];
    
    return pairs.map(({ pair, base }) => {
      const volatility = this.rng.range(0.005, 0.02);
      const rate = base * (1 + this.rng.jitter(0, volatility));
      const change = (rate - base) / base * 100;
      
      return { pair, rate, change };
    });
  }
  
  generateSectorReturns(): { sector: string; return: number }[] {
    const sectors = [
      'Technology', 'Healthcare', 'Financials', 'Consumer Disc.',
      'Industrials', 'Energy', 'Materials', 'Consumer Staples',
      'Utilities', 'Real Estate', 'Communication', 'Others'
    ];
    
    return sectors.map(sector => ({
      sector,
      return: this.rng.range(-3.5, 3.5)
    }));
  }
}

// News headlines generator
export function generateNewsHeadlines(rng: SeededRNG): string[] {
  const headlines = [
    "Fed Officials Signal Cautious Approach to Rate Cuts Amid Inflation Data",
    "Tech Earnings Beat Expectations as AI Investment Drives Growth",
    "Oil Prices Rally on Middle East Supply Concerns and OPEC+ Cuts",
    "Dollar Strengthens Against Majors as Treasury Yields Rise",
    "Equity Markets Show Resilience Despite Geopolitical Headwinds",
    "Central Bank Digital Currency Trials Expand in Major Economies",
    "Green Energy Sector Attracts Record Investment Flows",
    "Volatility Index Drops as Market Sentiment Improves"
  ];
  
  // Return 3-4 headlines in random order
  const count = Math.floor(rng.range(3, 5));
  const selected: string[] = [];
  const used = new Set<number>();
  
  while (selected.length < count) {
    const index = Math.floor(rng.range(0, headlines.length));
    if (!used.has(index)) {
      used.add(index);
      selected.push(headlines[index]);
    }
  }
  
  return selected;
}

// Global simulator instance and wrapper functions
const globalSimulator = new MarketDataSimulator('bloomberg-terminal');
const globalRng = createSeededRng('news-feed');

// Export wrapper functions
export function generateQuotes(symbols: string[]): QuoteData[] {
  return globalSimulator.generateQuotes(symbols, Date.now());
}

export function generateCandles(symbol: string, count: number): CandleData[] {
  return globalSimulator.generateCandles(count, 192.45, 60000); // 1-minute candles
}

export function generateDepth(): DepthLevel[] {
  return globalSimulator.generateDepth(192.45, 15);
}

export function generateTrades(symbol: string, count: number): TradeData[] {
  return globalSimulator.generateTrades(count, 192.45, 300000); // 5-minute window
}

export function generateSectorReturns(): { sector: string; return: number }[] {
  return globalSimulator.generateSectorReturns();
}

export function generateFXRates(): { pair: string; rate: number; change: number }[] {
  return globalSimulator.generateFXRates();
}

export function generateSparklines(symbols: string[]): { symbol: string; prices: number[]; current: number }[] {
  return symbols.map(symbol => {
    const prices = geometricBrownianMotion(100, 0.05, 0.2, 50, 0.1, globalRng);
    return {
      symbol,
      prices,
      current: prices[prices.length - 1]
    };
  });
}

export function generateMacroData(): { name: string; value: number; change: number }[] {
  const rng = createSeededRng('macro-data');
  return [
    { name: '10Y Treasury', value: 4.2 + rng.jitter(0, 0.1), change: rng.range(-0.05, 0.05) },
    { name: 'VIX', value: 18.5 + rng.jitter(0, 2), change: rng.range(-1, 1) },
    { name: 'Gold', value: 2045 + rng.jitter(0, 20), change: rng.range(-15, 15) },
    { name: 'Oil (WTI)', value: 78.5 + rng.jitter(0, 3), change: rng.range(-2, 2) },
    { name: 'DXY', value: 104.2 + rng.jitter(0, 1), change: rng.range(-0.5, 0.5) },
    { name: 'Bitcoin', value: 67500 + rng.jitter(0, 2000), change: rng.range(-5, 5) }
  ];
}

export function generateNews(): string[] {
  return generateNewsHeadlines(globalRng);
}
