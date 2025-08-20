'use client'
import React from 'react'
export default function FxToggle(){
  const [on,setOn] = React.useState(true)
  React.useEffect(()=>{
    const saved = localStorage.getItem('fx') ?? 'on'
    const startOn = saved !== 'off'
    setOn(startOn)
    document.documentElement.dataset.fx = startOn ? 'on':'off'
  },[])
  React.useEffect(()=>{ localStorage.setItem('fx', on?'on':'off'); document.documentElement.dataset.fx = on?'on':'off' },[on])
  return <button onClick={()=>setOn(v=>!v)} className='btn text-xs' aria-pressed={on}>FX: {on?'On':'Off'}</button>
}
