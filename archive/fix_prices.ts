import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.inventoryItem.updateMany({
    where: { category: "BENIH" },
    data: { unitPrice: 50, unit: "biji" }
  })
  
  await prisma.inventoryItem.updateMany({
    where: { category: "MEDIA" },
    data: { unitPrice: 115, unit: "dadu" } // asumsi 1 dadu Rp 115
  })
  
  await prisma.inventoryItem.updateMany({
    where: { category: "NUTRISI" },
    data: { unitPrice: 300, unit: "dosis" } // asumsi 1 dosis semai Rp 300
  })
  
  await prisma.inventoryItem.updateMany({
    where: { category: "KEMASAN" },
    data: { unitPrice: 500, unit: "pcs" }
  })

  console.log("Database diperbarui: Harga Inventory direset ke angka wajar (Base Unit).")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
