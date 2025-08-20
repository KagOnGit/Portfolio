'use client'
import React from 'react'
export default function FxToggle(){
  const [on,setOn]=React.useState(true)
  React.useEffect(()=>{ document.documentElement.dataset.fx = on ? 'on' : 'off' },[on])
  return (
    <button onClick={()=>setOn(v=>!v)} className='btn text-xs'>FX: {on?'On':'Off'}</button>
  )
}
