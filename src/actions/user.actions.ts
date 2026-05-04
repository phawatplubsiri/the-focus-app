'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateUsername(username: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  if (username.length < 3) {
    return { error: 'Username too short', success: false }
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { username }
    })
    
    revalidatePath('/dashboard')
    return { success: true, message: 'Username updated successfully' }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Username already taken', success: false }
    }
    return { error: 'Database update failed', success: false }
  }
}

export async function resetPasswordEmail() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { error: 'User email not found', success: false }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`
  })

  if (error) {
    return { error: error.message, success: false }
  }

  return { success: true, message: 'Reset link sent to your email' }
}
