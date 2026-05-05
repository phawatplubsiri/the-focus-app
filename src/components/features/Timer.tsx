'use client'

import React, { useEffect, useCallback } from 'react'
import { useFocusStore } from '@/store/useFocusStore'
import { useUIStore } from '@/store/useUIStore'
import { completeFocusSession } from '@/actions/timer.actions'
import { Icons } from '@/components/ui/Icons'

export const Timer = () => {
  const { timeLeft, duration, isActive, startTimer, stopTimer, resetTimer, resetToDefault, tick, setDuration } = useFocusStore()
  const { isTimerVisible, toggleTimer } = useUIStore()

  const handleComplete = useCallback(async () => {
    stopTimer()
    const durationMinutes = Math.floor(duration / 60)
    const earnedPoints = Math.floor(durationMinutes / 5)

    const result = await completeFocusSession(durationMinutes, earnedPoints)
    if (result.success) {
      console.log('SUCCESS:', result.message)
    }
  }, [stopTimer, duration])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      handleComplete()
      const durationMinutes = Math.floor(duration / 60)
      const earnedPoints = Math.floor(durationMinutes / 5)
      alert(`Mission Complete! You earned +${earnedPoints} points.`)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, tick, handleComplete, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const adjustDuration = (amount: number) => {
    const newDuration = Math.max(300, duration + amount) // Min 5 mins
    setDuration(newDuration)
  }

  // If Hidden
  if (!isTimerVisible) {
    return (
      <button 
        onClick={toggleTimer}
        className="fixed top-100 left-1/2 -translate-x-1/2 z-40 px-6 py-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-full text-[15px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:bg-cyan-500/10 transition-all animate-bounce"
      >
        Show Timer {formatTime(timeLeft)}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 relative animate-in fade-in zoom-in duration-300">
      {/* Hide Button */}
      <button 
        onClick={toggleTimer}
        className="absolute -top-10 right-0 text-[10px] text-neutral-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"
      >
        Hide System <Icons.Minus className="w-2 h-2 group-hover:scale-125 transition-transform" />
      </button>

      {/* Timer Circle */}
      <div className="relative flex items-center justify-center">
        {/* Adjustment Buttons (Outside) */}
        {!isActive && (
          <>
            <button 
              onClick={() => adjustDuration(-300)}
              className="absolute -left-24 w-12 h-12 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-all shadow-lg"
            >
              <span className="text-neutral-500 text-[8px] font-black uppercase tracking-tighter group-hover:text-cyan-400 mb-0.5">−5M</span>
              <Icons.Minus className="w-4 h-4 text-white group-hover:text-cyan-400" />
            </button>

            <button 
              onClick={() => adjustDuration(300)}
              className="absolute -right-24 w-12 h-12 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-all shadow-lg"
            >
              <span className="text-neutral-500 text-[8px] font-black uppercase tracking-tighter group-hover:text-cyan-400 mb-0.5">+5M</span>
              <Icons.Plus className="w-4 h-4 text-white group-hover:text-cyan-400" />
            </button>
          </>
        )}

        {/* Circle Glow */}
        <div className="absolute inset-0 border-4 border-transparent rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 [mask-image:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] opacity-20 blur-sm" />
        
        {/* Main Circle Body */}
        <div className="w-64 h-64 rounded-full border-2 border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] relative overflow-hidden">
          {/* Internal Grid/Detail (Cyberpunk feel) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex flex-col items-center gap-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] font-black mb-1">
              {isActive ? 'Tracking Active' : 'System Ready'}
            </p>
            
            <p className="text-7xl font-black tracking-tighter tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {formatTime(timeLeft)}
            </p>

            <div className="flex flex-col items-center mt-2">
               <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isActive ? 'text-cyan-400 animate-pulse' : 'text-neutral-600'}`}>
                {isActive ? 'Focusing...' : 'Mode: Idle'}
              </p>
              
              <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Rewards</span>
                <span className="text-[11px] text-yellow-500 font-black tracking-widest flex items-center gap-1.5">
                  <Icons.Coin className="w-2.5 h-2.5" />
                  {Math.floor(Math.floor(duration / 60) / 5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isActive ? stopTimer : startTimer}
          className={`group relative px-10 py-3 overflow-hidden transition-all border-2 rounded ${
            isActive 
              ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' 
              : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          <span className="relative z-10 font-bold uppercase tracking-widest text-sm">
            {isActive ? 'Pause Session' : 'Start Focus Quest'}
          </span>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-md ${
            isActive ? 'bg-red-500/20' : 'bg-cyan-500/20'
          }`} />
        </button>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => resetTimer()}
            className="text-[10px] text-neutral-600 uppercase tracking-widest hover:text-red-400 transition-colors"
          >
            Abort Mission
          </button>
          
          <div className="w-1 h-1 rounded-full bg-white/10" />

          <button 
            onClick={() => resetToDefault()}
            className="text-[10px] text-neutral-600 uppercase tracking-widest hover:text-cyan-400 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}
