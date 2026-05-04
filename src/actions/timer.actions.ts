'use server'

import { createClient } from '@/utils/supabase/server'
import { userService } from '@/services/user.service'
import { revalidatePath } from 'next/cache'

/**
 * Handle completing a focus session
 */
export async function completeFocusSession(durationMinutes: number, points: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  try {
    await userService.recordSession(user.id, durationMinutes, points)
    
    // Revalidate the dashboard to update total points/level UI
    revalidatePath('/dashboard')
    
    return { success: true, message: `Points recorded: +${points}◈` }
  } catch (error) {
    console.error('Failed to record session:', error)
    return { error: 'Database update failed', success: false }
  }
}
