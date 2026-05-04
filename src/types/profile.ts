import { Prisma } from '@prisma/client'

/**
 * Profile with its currently active scene included.
 * Used primary in dashboard and header logic.
 */
export type ProfileWithScene = Prisma.ProfileGetPayload<{
  include: { currentScene: true }
}>

/**
 * Basic user stats for display in UI components
 */
export interface UserStats {
  experienceScore: number
  totalPoints: number
  currentXp: number
  maxXp: number
  streakDays: number
}
