'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const BloombergScene = () => {
  const quotes = [
    { symbol: 'AAPL', price: '175.32', change: '+2.14' },
    { symbol: 'GOOGL', price: '142.68', change: '-1.02' },
    { symbol: 'MSFT', price: '384.72', change: '+0.89' },
    { symbol: 'TSLA', price: '238.45', change: '+4.21' },
    { symbol: 'AMZN', price: '147.92', change: '-0.43' },
    { symbol: 'META', price: '305.16', change: '+1.78' },
  ];

  const newsItems = [
    'FED signals potential rate adjustment in Q2 2024',
    'Tech sector shows resilience amid market volatility',
    'Energy commodities surge on supply concerns',
    'Cryptocurrency market consolidates after recent gains',
    'M&A activity picks up in healthcare sector',
  ];

  return (
    <div className="bb-scene">
      {/* Grid Background */}
      <div className="bb-grid" />
      
      {/* Quotes Section */}
      <div className="bb-quotes-section">
        <div style={{ color: 'var(--bb-blue)', fontSize: '10px', marginBottom: '8px' }}>
          MARKET QUOTES
        </div>
        {quotes.map((quote, i) => (
          <div key={i} className="bb-quote-item">
            <span style={{ color: 'white' }}>{quote.symbol}</span>
            <span style={{ color: 'white' }}>{quote.price}</span>
            <span style={{ 
              color: quote.change.startsWith('+') ? 'var(--bb-green)' : 'var(--bb-red)' 
            }}>
              {quote.change}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bb-heatmap">
        {Array.from({ length: 32 }).map((_, i) => (
          <div 
            key={i} 
            className={`bb-heatmap-cell ${Math.random() > 0.6 ? 'negative' : ''}`}
            style={{ 
              opacity: Math.random() * 0.8 + 0.2,
              height: `${Math.random() * 20 + 10}px`
            }}
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bb-chart">
        <div style={{ color: 'var(--bb-blue)', fontSize: '10px', marginBottom: '8px' }}>
          MARKET TRENDS
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <svg key={i} className="bb-sparkline" style={{ stroke: 'var(--bb-green)' }}>
            <polyline
              fill="none"
              strokeWidth="1"
              points={Array.from({ length: 20 })
                .map((_, j) => `${j * 5},${Math.random() * 30 + 5}`)
                .join(' ')}
            />
          </svg>
        ))}
      </div>

      {/* News Wire */}
      <div className="bb-newswire">
        <div style={{ color: 'var(--bb-blue)', fontSize: '9px', marginBottom: '4px' }}>
          REUTERS NEWSWIRE
        </div>
        {newsItems.map((news, i) => (
          <div key={i} className="bb-news-item">
            {new Date().toLocaleTimeString()} - {news}
          </div>
        ))}
      </div>
    </div>
  );
};

export function RootBloombergCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div id="root-bloomberg-canvas">
      <BloombergScene />
    </div>,
    document.body
  );
}
