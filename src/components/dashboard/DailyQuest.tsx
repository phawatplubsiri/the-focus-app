'use client'

import { useUIStore } from '@/store/useUIStore'
import { Icons } from '@/components/ui/Icons'

interface DailyQuestProps {
  questsCompleted?: number
  questsTotal?: number
  hoursCompleted?: number
  hoursTarget?: number
  dailyPoints?: number
}

export function DailyQuest({
  questsCompleted = 0,
  questsTotal = 4,
  hoursCompleted = 0,
  hoursTarget = 2,
  dailyPoints = 0,
}: DailyQuestProps) {
  const { isDailyQuestVisible, toggleDailyQuest } = useUIStore()
  const questProgress = Math.min((questsCompleted / questsTotal) * 100, 100)
  const hourProgress = Math.min((hoursCompleted / hoursTarget) * 100, 100)

  return (
    <>
      {/* Collapsed Tab (Left Side) */}
      {!isDailyQuestVisible && (
        <button
          onClick={toggleDailyQuest}
          className="fixed left-0 top-1/2 -translate-y-1/10 z-50 flex flex-col items-center gap-4 py-8 px-2 bg-black/40 backdrop-blur-md border border-l-0 border-cyan-500/50 rounded-r-2xl hover:bg-cyan-500/10 transition-all group shadow-[5px_0_15px_rgba(6,182,212,0.2)]"
        >
          <Icons.ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          <div className="flex flex-col gap-2">
             {['Q', 'U', 'E', 'S', 'T'].map((char, i) => (
               <span key={i} className="text-[14px] font-black text-cyan-400/80 leading-none">{char}</span>
             ))}
          </div>
          {questsCompleted > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-[10px] font-black text-black">
              {questsCompleted}
            </div>
          )}
        </button>
      )}

      {/* Expanded Content */}
      <div 
        className={`fixed left-0 top-1/2 -translate-y-1/10 z-50 transition-all duration-500 ease-in-out ${
          isDailyQuestVisible ? 'translate-x-4 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 space-y-5 shadow-2xl min-w-[280px] relative">
          {/* Close Button Inside */}
          <button 
            onClick={toggleDailyQuest}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-cyan-500 text-black flex items-center justify-center rounded-r hover:bg-cyan-400 transition-colors"
          >
            <Icons.ChevronLeft className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">Daily Quest</h3>
              <p className="text-[9px] text-neutral-500 mt-1 uppercase">Resets at Midnight</p>
            </div>
          </div>

          {/* Quests */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-300">
                <span>Pomodoros</span>
                <span className="text-cyan-500">{questsCompleted}/{questsTotal}</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-full border border-white/5 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ width: `${questProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-300">
                <span>Focus Hours</span>
                <span className="text-cyan-500">{hoursCompleted} / {hoursTarget}</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-full border border-white/5 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ width: `${hourProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="pt-3 flex flex-col gap-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">Earnings</div>
            <div className="flex justify-around text-[9px] font-black uppercase tracking-widest bg-white/5 py-2 rounded">
              <span className="text-green-500 font-bold uppercase tracking-tighter">+ {dailyPoints} XP</span>
              <span className="text-yellow-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                + <Icons.Coin className="w-2.5 h-2.5" /> {dailyPoints}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
