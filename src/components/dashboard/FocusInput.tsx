'use client'

import { useState } from 'react'

export function FocusInput() {
  const [value, setValue] = useState('')

  return (
    <div className="w-full max-w-2xl bg-black/50 backdrop-blur-sm border border-white/10 rounded p-4">
      <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
        <span className="text-cyan-400 mr-2">{'>'}</span> What are you focusing on?
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Build ML model, Read 30 pages, Finish project..."
        className="w-full bg-transparent text-sm focus:outline-none text-white placeholder:text-neutral-600"
      />
      <div className="mt-2 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
    </div>
  )
}
