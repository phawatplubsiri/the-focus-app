import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding initial data...')

  // Create default scenes
  const scenes = [
    {
      name: 'Cozy Library',
      type: 'static',
      imageUrl: '/scenes/library.png',
      price: 0,
      isDefault: true,
    },
    {
      name: 'Cyberpunk Skyline',
      type: 'static',
      imageUrl: '/scenes/cyber.png',
      price: 100,
      isDefault: false,
    },
    {
      name: 'Zen Garden',
      type: 'static',
      imageUrl: '/scenes/zen.png',
      price: 150,
      isDefault: false,
    },
  ]

  for (const scene of scenes) {
    await prisma.scene.upsert({
      where: { name: scene.name },
      update: {
        imageUrl: scene.imageUrl,
        type: scene.type,
        price: scene.price,
        isDefault: scene.isDefault,
      },
      create: scene,
    })
    console.log(`Created/Updated scene: ${scene.name}`)
  }

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@focusquest.com'
  
  // Try to find the user in auth.users first (via Prisma, though we don't have auth model, we can try to update by email)
  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { email: adminEmail }
    })

    if (existingProfile) {
      await prisma.profile.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' }
      })
      console.log(`Updated existing user to ADMIN: ${adminEmail}`)
    } else {
      console.log(`Note: User ${adminEmail} not found. Register this email first, then run seed again to grant ADMIN role.`)
    }
  } catch (error) {
    console.log('Could not process admin role upgrade:', error)
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
