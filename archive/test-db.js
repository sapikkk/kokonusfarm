const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const latestCycles = await prisma.productionCycle.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log(latestCycles)
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
