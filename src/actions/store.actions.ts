'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Get all available scenes and check ownership for the current user
 */
export async function getStoreScenes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', scenes: [] }

  const [allScenes, userInventory] = await Promise.all([
    prisma.scene.findMany({
      orderBy: { price: 'asc' }
    }),
    prisma.userInventory.findMany({
      where: { userId: user.id },
      select: { sceneId: true }
    })
  ])

  const ownedSceneIds = new Set(userInventory.map(item => item.sceneId))

  const scenesWithStatus = allScenes.map(scene => ({
    ...scene,
    isOwned: ownedSceneIds.has(scene.id) || scene.isDefault
  }))

  return { scenes: scenesWithStatus }
}

/**
 * Purchase a scene
 */
export async function purchaseScene(sceneId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', success: false }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get scene and user profile
      const [scene, profile] = await Promise.all([
        tx.scene.findUnique({ where: { id: sceneId } }),
        tx.profile.findUnique({ where: { id: user.id } })
      ])

      if (!scene) throw new Error('Scene not found')
      if (!profile) throw new Error('Profile not found')

      // 2. Check if already owned
      const existing = await tx.userInventory.findUnique({
        where: {
          userId_sceneId: { userId: user.id, sceneId }
        }
      })

      if (existing || scene.isDefault) {
        return { error: 'You already own this scene', success: false }
      }

      // 3. Check if enough points
      if (profile.totalPoints < scene.price) {
        return { error: 'Insufficient ◈ Points', success: false }
      }

      // 4. Deduct points and add to inventory
      await tx.profile.update({
        where: { id: user.id },
        data: {
          totalPoints: {
            decrement: scene.price
          }
        }
      })

      await tx.userInventory.create({
        data: {
          userId: user.id,
          sceneId: sceneId
        }
      })

      return { success: true, message: `Unlocked ${scene.name}!` }
    })
  } catch (error: any) {
    return { error: error.message || 'Purchase failed', success: false }
  } finally {
    revalidatePath('/')
  }
}

/**
 * Set active scene
 */
export async function setActiveScene(sceneId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized', success: false }

  try {
    // Check ownership first
    const scene = await prisma.scene.findUnique({ where: { id: sceneId } })
    if (!scene) throw new Error('Scene not found')

    if (!scene.isDefault) {
      const owned = await prisma.userInventory.findUnique({
        where: {
          userId_sceneId: { userId: user.id, sceneId }
        }
      })
      if (!owned) throw new Error('You do not own this scene')
    }

    await prisma.profile.update({
      where: { id: user.id },
      data: { currentSceneId: sceneId }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message, success: false }
  }
}
