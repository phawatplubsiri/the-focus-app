import prisma from '@/lib/prisma'
import { ProfileWithScene } from '@/types/profile'

export const userService = {
  /**
   * Get user profile with current scene details
   */
  async getProfile(userId: string): Promise<ProfileWithScene | null> {
    return prisma.profile.findUnique({
      where: { id: userId },
      include: {
        currentScene: true
      }
    })
  },

  /**
   * Create a new profile for a user with a random username
   */
  async createProfile(userId: string, email: string): Promise<ProfileWithScene> {
    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase()
    const defaultUsername = `User_${randomSuffix}`

    return prisma.profile.create({
      data: {
        id: userId,
        email: email,
        username: defaultUsername,
        experienceScore: 0,
        totalPoints: 0,
      },
      include: {
        currentScene: true
      }
    })
  },

  /**
   * Record a completed focus session and update total points
   */
  async recordSession(userId: string, durationMinutes: number, points: number) {
    return prisma.$transaction([
      prisma.profile.update({
        where: { id: userId },
        data: {
          totalPoints: {
            increment: points
          },
          experienceScore: {
            increment: points // Assuming 1 point = 1 XP for now
          }
        }
      }),
      prisma.focusSession.create({
        data: {
          userId,
          durationMinutes,
          earnedPoints: points
        }
      })
    ])
  },

  /**
   * Get daily stats for a user (since midnight)
   */
  async getDailyStats(userId: string) {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfToday
        }
      }
    })

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    const totalPoints = sessions.reduce((sum, s) => sum + s.earnedPoints, 0)
    const completedCount = sessions.length

    return {
      totalMinutes,
      totalPoints,
      completedCount
    }
  }
}
