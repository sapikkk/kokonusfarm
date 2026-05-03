const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const cycle = await prisma.productionCycle.create({
      data: {
        batchCode: "BATCH-TEST-001",
        plantType: "Selada",
        phase: "SEMAI",
        initialQuantity: 500,
        currentQuantity: 500,
        rejectedCount: 0,
        startDate: new Date(),
        notes: "",
        installationId: null,
        activeSeedPackId: null,
        activeMediaPackId: null,
        fixedCostSeed: 0,
        fixedCostMedia: 0,
      },
    })
    console.log("Success:", cycle)
  } catch (err) {
    console.error("Prisma Error:", err)
  }
}

main().finally(() => prisma.$disconnect())
