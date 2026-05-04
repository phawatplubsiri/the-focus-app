'use client'

import { useUIStore } from '@/store/useUIStore'

export function NavActions() {
  const { toggleFullscreen, isFullscreen, toggleSettings } = useUIStore()

  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={toggleFullscreen}
        className="w-8 h-8 flex items-center justify-center rounded text-neutral-500 hover:bg-white/5 hover:text-white transition-all text-xs"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? '⇙⇗' : '⇗⇙'}
      </button>
      <button 
        onClick={toggleSettings}
        className="w-8 h-8 flex items-center justify-center rounded text-neutral-500 hover:bg-white/5 hover:text-white transition-all text-sm"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  )
}
