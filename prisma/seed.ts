import { PrismaClient, AccountType, PlantPhase } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const owner = await prisma.user.upsert({
    where: { email: 'owner@kebunhijau.com' },
    update: {},
    create: {
      email: 'owner@kebunhijau.com',
      name: 'sapik',
      password: await hash('password123', 10),
      role: 'OWNER',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kebunhijau.com' },
    update: {},
    create: {
      email: 'admin@kebunhijau.com',
      name: 'admin',
      password: await hash('password123', 10),
      role: 'ADMIN',
    },
  })

  const worker = await prisma.user.upsert({
    where: { email: 'worker@kebunhijau.com' },
    update: {},
    create: {
      email: 'worker@kebunhijau.com',
      name: 'Ahmad Wijaya',
      password: await hash('password123', 10),
      role: 'PEKERJA',
    },
  })

  console.log('✅ Users created')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
