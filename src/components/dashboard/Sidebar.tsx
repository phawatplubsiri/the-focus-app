'use client'

import { useState } from 'react'
import { useUIStore } from '@/store/useUIStore'

interface MenuItem {
  label: string
  description: string
  icon: string
}

const menuItems: MenuItem[] = [
  { label: 'Focus', description: 'Enter flow state', icon: '▶' },
  { label: 'Store', description: 'Buy boosts & items', icon: '🛒' },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState(0)
  const { isSidebarCollapsed, toggleStore } = useUIStore()

  const handleMenuClick = (idx: number, label: string) => {
    if (label === 'Store') {
      toggleStore()
    } else {
      setActiveItem(idx)
    }
  }

  return (
    <aside 
      className={`fixed left-0 top-20 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-md border-r border-b border-white/5 p-3 flex flex-col gap-2 z-30 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] rounded-br-xl h-fit max-h-[calc(100vh-80px)] ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {menuItems.map((item, idx) => (
        <button
          key={item.label}
          onClick={() => handleMenuClick(idx, item.label)}
          className={`group flex items-center rounded transition-all overflow-hidden ${
            activeItem === idx
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 border'
              : 'border border-transparent text-neutral-500 hover:bg-white/5 hover:text-neutral-200'
          } ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3 gap-3'}`}
          title={isSidebarCollapsed ? item.label : ''}
        >
          <span className={`text-lg transition-transform ${activeItem === idx ? 'scale-110' : 'group-hover:scale-110'}`}>
            {item.icon}
          </span>
          
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0 text-left animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest truncate">
                {item.label}
              </p>
              <p className="text-[8px] opacity-40 uppercase tracking-tighter truncate font-medium">
                {item.description}
              </p>
            </div>
          )}
        </button>
      ))}

      {/* Footer Info (Only show when not collapsed) 
      {!isSidebarCollapsed && (
        <div className="mt-2 p-2 border-t border-white/5 opacity-40">
           <p className="text-[7px] text-neutral-400 uppercase tracking-widest font-bold text-center">
            System v1.0.4
          </p>
        </div>
      )}*/}
    </aside>
  )
}
