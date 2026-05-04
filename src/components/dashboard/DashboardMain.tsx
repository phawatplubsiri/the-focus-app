import { BackgroundLayer } from '@/components/dashboard/BackgroundLayer'
import { Navbar } from '@/components/dashboard/navbar/Navbar'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Timer } from '@/components/features/Timer'
import { DailyQuest } from '@/components/dashboard/DailyQuest'
import { MusicPlayer } from '@/components/dashboard/MusicPlayer'
import { SettingsModal } from '@/components/dashboard/settings/SettingsModal'
import { StoreModal } from '@/components/dashboard/StoreModal'

interface DashboardMainProps {
  user: any
  profile: any
  dailyStats?: any
}

export function DashboardMain({ user, profile, dailyStats }: DashboardMainProps) {
  // เตรียมข้อมูลสำหรับการแสดงผล
  const backgroundImage = profile?.currentScene?.imageUrl || undefined
  const displayName = profile?.username || (user ? `User_${user.id.substring(0, 5)}` : 'Guest Hero')
  const provider = user?.app_metadata?.provider
  const totalPoints = profile?.totalPoints || 0
  const email = user?.email || ''
  
  // XP Calculation Logic
  const experienceScore = profile?.experienceScore || 0
  const XP_PER_LEVEL = 1000
  const level = Math.floor(experienceScore / XP_PER_LEVEL) + 1
  const currentLevelXp = experienceScore % XP_PER_LEVEL

  // Daily Stats Logic
  const pomodorosCompleted = dailyStats?.completedCount || 0
  const hoursCompleted = parseFloat(((dailyStats?.totalMinutes || 0) / 60).toFixed(1))

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-hidden flex flex-col">
      {/* SEO Hidden H1 */}
      <h1 className="sr-only">Focus Quest - Gamified Deep Work and Pomodoro Hub</h1>
      
      {/* Background Layer */}
      <BackgroundLayer imageUrl={backgroundImage} />

      {/* Navbar */}
      <div className="animate-slide-in-top fill-mode-both">
        <Navbar
          username={displayName}
          level={level}
          currentXp={currentLevelXp}
          maxXp={XP_PER_LEVEL}
          coins={totalPoints}
          provider={provider}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        <div className="animate-slide-in-left fill-mode-both [animation-delay:150ms]">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 gap-12 overflow-auto animate-zoom-in fill-mode-both [animation-delay:300ms]">
          <Timer />
        </div>
      </main>

      {/* Widgets */}
      <div className="absolute bottom-0 left-8 right-auto z-20 animate-slide-in-bottom fill-mode-both [animation-delay:500ms]">
        <DailyQuest 
          questsCompleted={pomodorosCompleted}
          questsTotal={4}
          hoursCompleted={hoursCompleted}
          hoursTarget={2}
          dailyPoints={dailyStats?.totalPoints || 0}
        />
      </div>

      <div className="absolute bottom-0 right-8 left-auto z-20 animate-slide-in-bottom fill-mode-both [animation-delay:700ms] w-80">
        <MusicPlayer />
      </div>

      {/* Modals */}
      <StoreModal userPoints={totalPoints} currentSceneId={profile?.currentSceneId} />

      {/* Settings Modal */}
      {user && (
        <SettingsModal 
          email={email} 
          currentUsername={profile?.username || displayName}
          role={profile?.role}
        />
      )}
    </div>
  )
}
