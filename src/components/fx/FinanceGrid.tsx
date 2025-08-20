'use client'
export default function FinanceGrid(){
  return (
    <div className='pointer-events-none fixed inset-0 -z-40 opacity-[.22] fx-hidden' aria-hidden>
      <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
            <path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,.04)' strokeWidth='1'/>
          </pattern>
          <linearGradient id='candle' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='rgba(0,140,255,.55)'/>
            <stop offset='100%' stopColor='rgba(0,140,255,.05)'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#grid)'/>
        <g opacity='.6'>
          <rect x='12%' y='36%' width='2' height='110' fill='url(#candle)'>
            <animate attributeName='y' values='36%;34%;36%' dur='6s' repeatCount='indefinite'/>
          </rect>
          <rect x='18%' y='42%' width='2' height='90' fill='url(#candle)'>
            <animate attributeName='y' values='42%;40%;42%' dur='7.2s' repeatCount='indefinite'/>
          </rect>
          <rect x='26%' y='40%' width='2' height='100' fill='url(#candle)'>
            <animate attributeName='y' values='40%;38%;40%' dur='5.4s' repeatCount='indefinite'/>
          </rect>
          <rect x='74%' y='44%' width='2' height='80' fill='url(#candle)'>
            <animate attributeName='y' values='44%;42%;44%' dur='6.6s' repeatCount='indefinite'/>
          </rect>
          <rect x='82%' y='35%' width='2' height='105' fill='url(#candle)'>
            <animate attributeName='y' values='35%;33%;35%' dur='5.8s' repeatCount='indefinite'/>
          </rect>
        </g>
      </svg>
    </div>
  )
}
