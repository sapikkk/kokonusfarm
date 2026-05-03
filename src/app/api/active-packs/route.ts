import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — Ambil semua pack yang sedang "DIBUKA"
export async function GET(req: NextRequest) {
  try {
    const activePacks = await prisma.activePack.findMany({
      where: { status: "DIBUKA" },
      include: {
        item: { select: { name: true, code: true, category: true } },
        seedProductionCycles: { select: { initialQuantity: true } },
        mediaProductionCycles: { select: { initialQuantity: true } }
      },
      orderBy: { openedAt: "desc" }
    })

    const result = activePacks.map(p => {
      // Hitung akumulasi penggunaan sejauh ini
      const seedUsage = p.seedProductionCycles.reduce((sum, c) => sum + c.initialQuantity, 0)
      const mediaUsage = p.mediaProductionCycles.reduce((sum, c) => sum + c.initialQuantity, 0)
      const totalUsage = seedUsage + mediaUsage
      
      const batchCount = p.seedProductionCycles.length + p.mediaProductionCycles.length

      return {
        id: p.id,
        itemId: p.itemId,
        itemName: p.item.name,
        itemCode: p.item.code,
        category: p.item.category,
        packPrice: Number(p.packPrice),
        openedAt: p.openedAt,
        usedUnits: totalUsage,
        batchCount: batchCount
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}

// POST — Buka pack baru (mengurangi stok gudang)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { itemId } = await req.json()
    if (!itemId) return NextResponse.json({ error: "itemId wajib diisi" }, { status: 400 })

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } })
    if (!item) return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 })

    if (Number(item.currentStock) < 1) {
      return NextResponse.json({ error: "Stok habis" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Kurangi stok gudang 1 satuan
      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: { decrement: 1 } }
      })

      // 2. Catat log keluar
      await tx.inventoryLog.create({
        data: {
          itemId,
          movement: "OUT",
          quantity: 1,
          reference: "PEMBUKAAN_PACK",
          notes: `Buka pack baru untuk operasional`,
          userId: session.user.id
        }
      })

      // 3. Buat lifecycle active pack
      const packPrice = Number(item.unitPrice) > 0 ? Number(item.unitPrice) : 0 // Fallback ke unitPrice
      const activePack = await tx.activePack.create({
        data: {
          itemId,
          status: "DIBUKA",
          packPrice
        }
      })

      return activePack
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
