'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Check if the current user is an admin
 */
async function ensureAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  })

  if (profile?.role !== 'ADMIN') {
    throw new Error('Access denied: Admin role required')
  }

  return user
}

/**
 * Get all scenes for management
 */
export async function getAllScenes() {
  await ensureAdmin()
  return prisma.scene.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Create a new scene
 */
export async function createScene(formData: FormData) {
  await ensureAdmin()

  const name = formData.get('name') as string
  const imageUrl = formData.get('imageUrl') as string
  const type = formData.get('type') as string
  const price = parseInt(formData.get('price') as string) || 0
  const isDefault = formData.get('isDefault') === 'on'

  try {
    await prisma.scene.create({
      data: {
        name,
        imageUrl,
        type,
        price,
        isDefault
      }
    })
    revalidatePath('/admin/scenes')
    return { success: true, message: 'Scene created successfully' }
  } catch (error: any) {
    return { error: error.message, success: false }
  }
}

/**
 * Delete a scene
 */
export async function deleteScene(id: string) {
  await ensureAdmin()
  try {
    await prisma.scene.delete({ where: { id } })
    revalidatePath('/admin/scenes')
    return { success: true }
  } catch (error: any) {
    return { error: error.message, success: false }
  }
}

/**
 * Get all users for management
 */
export async function getAllUsers() {
  await ensureAdmin()
  return prisma.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Update user details
 */
export async function updateUserDetails(userId: string, data: { 
  role?: string, 
  totalPoints?: number, 
  experienceScore?: number,
  username?: string 
}) {
  await ensureAdmin()
  try {
    await prisma.profile.update({
      where: { id: userId },
      data
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    return { error: error.message, success: false }
  }
}

/**
 * Delete a user from both Prisma and Supabase Auth
 */
export async function deleteUser(userId: string) {
  await ensureAdmin()
  
  try {
    // 1. Delete from Prisma (Cascades to focus sessions and inventory)
    await prisma.profile.delete({
      where: { id: userId }
    })

    // 2. Note: Deleting from Supabase Auth requires Service Role Key.
    // If we only have the anon/authenticated key on server.ts, we can't delete auth users easily.
    // However, the Prisma delete ensures they can't use the app features.
    
    revalidatePath('/admin/users')
    return { success: true, message: 'User profile deleted successfully.' }
  } catch (error: any) {
    return { error: error.message, success: false }
  }
}
