import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH — Nyatakan pack habis dan hitung costPerUnit untuk semua batch terkait
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const pack = await prisma.activePack.findUnique({
      where: { id: params.id },
      include: {
        item: { select: { category: true } },
        seedProductionCycles: { select: { id: true, initialQuantity: true } },
        mediaProductionCycles: { select: { id: true, initialQuantity: true } }
      }
    })

    if (!pack) return NextResponse.json({ error: "Pack tidak ditemukan" }, { status: 404 })
    if (pack.status === "HABIS") return NextResponse.json({ error: "Pack sudah habis" }, { status: 400 })

    // Total satuan (biji/dadu) dari semua batch yang pakai pack ini
    const isSeed = pack.item.category === "BENIH"
    const cycles = isSeed ? pack.seedProductionCycles : pack.mediaProductionCycles
    const totalUnits = cycles.reduce((sum, cycle) => sum + cycle.initialQuantity, 0)
    
    if (totalUnits === 0) {
      // Jika ternyata pack ini tidak dipakai batch sama sekali, langsung tutup
      const closed = await prisma.activePack.update({
        where: { id: params.id },
        data: { status: "HABIS", depletedAt: new Date(), estimatedYield: 0, costPerUnit: 0 }
      })
      return NextResponse.json(closed)
    }

    const packPrice = Number(pack.packPrice)
    const costPerUnit = packPrice / totalUnits

    // Transaksi update pack & injeksi cost ke batch terkait
    const result = await prisma.$transaction(async (tx) => {
      const updatedPack = await tx.activePack.update({
        where: { id: params.id },
        data: {
          status: "HABIS",
          depletedAt: new Date(),
          estimatedYield: totalUnits,
          costPerUnit: costPerUnit
        }
      })

      // Update fixedCostSeed / fixedCostMedia untuk tiap batch semai
      for (const cycle of cycles) {
        const costForThisBatch = cycle.initialQuantity * costPerUnit
        
        const dataToUpdate = isSeed 
          ? { fixedCostSeed: costForThisBatch }
          : { fixedCostMedia: costForThisBatch }
          
        await tx.productionCycle.update({
          where: { id: cycle.id },
          data: dataToUpdate
        })
      }

      return updatedPack
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
