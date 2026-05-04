import { createClient } from '@/utils/supabase/server'
import { userService } from '@/services/user.service'
import { DashboardMain } from '@/components/dashboard/DashboardMain'
import { LoginModal } from '@/components/auth/LoginModal'

export default async function Home() {
  const supabase = await createClient()

  // 1. ตรวจสอบการยืนยันตัวตน
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  let dailyStats = null
  if (user) {
    // 2. ดึงข้อมูล Profile ถ้าล็อกอินแล้ว
    profile = await userService.getProfile(user.id)
    
    // ถ้าไม่มี Profile ให้สร้างใหม่
    if (!profile) {
      profile = await userService.createProfile(user.id, user.email || '')
    }

    // 3. ดึงข้อมูล Daily Stats
    dailyStats = await userService.getDailyStats(user.id)
  }

  return (
    <>
      {/* Background Dashboard (Visible even if not logged in) */}
      <div className={!user ? "pointer-events-none select-none blur-[2px] opacity-60" : ""}>
        <DashboardMain user={user} profile={profile} dailyStats={dailyStats} />
      </div>

      {/* Login Modal Overlay (Show only if NOT logged in) */}
      {!user && <LoginModal />}
    </>
  )
}
