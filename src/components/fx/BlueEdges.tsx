'use client'
export default function BlueEdges() {
  return (
    <div className='pointer-events-none fixed inset-0 -z-20'>
      <div className='absolute left-0 top-0 h-64 w-64 bg-[radial-gradient(circle,rgba(0,120,255,.12),transparent_60%)] blur-2xl'/>
      <div className='absolute right-0 bottom-0 h-72 w-72 bg-[radial-gradient(circle,rgba(0,140,255,.10),transparent_60%)] blur-2xl'/>
    </div>
  )
}
