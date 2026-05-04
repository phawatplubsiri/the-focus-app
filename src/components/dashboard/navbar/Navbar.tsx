'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { UserIdentity } from './UserIdentity'
import { UserStats } from './UserStats'
import { NavActions } from './NavActions'

interface NavbarProps {
  username: string
  level: number
  currentXp: number
  maxXp: number
  coins: number
  provider?: string
}

export function Navbar({
  username,
  level,
  currentXp,
  maxXp,
  coins,
  provider,
}: NavbarProps) {
  const { toggleSidebar, setIsFullscreen } = useUIStore()
  const xpPercentage = (currentXp / maxXp) * 100

  // Sync fullscreen state with actual browser state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setIsFullscreen])

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5 h-20 min-h-[5rem]">
      <div className="h-full px-6 flex justify-between items-center gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center rounded border border-white/5 hover:bg-white/5 transition-all group"
            title="Toggle Sidebar"
          >
            <div className="flex flex-col gap-1 items-center">
              <span className="w-4 h-0.5 bg-cyan-400 group-hover:w-5 transition-all"></span>
              <span className="w-5 h-0.5 bg-cyan-400"></span>
              <span className="w-3 h-0.5 bg-cyan-400 group-hover:w-5 transition-all"></span>
            </div>
          </button>
          
          <UserIdentity 
            username={username} 
            level={level} 
            xpPercentage={xpPercentage} 
            provider={provider}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <UserStats coins={coins} />
          <NavActions />
        </div>
      </div>
    </header>
  )
}
