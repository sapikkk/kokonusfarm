import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { 
      itemId, 
      buyQuantity,         // Jumlah beli (misal: 1)
      totalPrice,          // Harga total (misal: Rp 800.000)
      conversionMultiplier // Rumus pecah ke Base Unit (misal: 7200)
    } = body

    if (!itemId || !buyQuantity || !totalPrice || !conversionMultiplier) {
      return NextResponse.json({ error: "Semua data wajib diisi" }, { status: 400 })
    }

    const receiptQtyBase = buyQuantity * conversionMultiplier

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 })
    }

    // Kalkulasi Moving Average:
    // (Total Nilai Lama + Total Beli Baru) / (Kuantitas Lama + Kuantitas Baru)
    const oldQty = Number(item.currentStock)
    const oldPrice = Number(item.unitPrice)
    const oldTotalValue = oldQty * oldPrice
    
    const newQty = oldQty + receiptQtyBase
    const newTotalValue = oldTotalValue + totalPrice

    const newUnitPrice = newQty > 0 ? (newTotalValue / newQty) : 0

    // Begin Transaction untuk keamanan data
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Inventory Item (Stok bertambah, Harga Rata-rata berubah)
      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: newQty,
          unitPrice: newUnitPrice
        }
      })

      // 2. Catat riwayat log masuk barang
      const log = await tx.inventoryLog.create({
        data: {
          itemId,
          movement: "IN",
          quantity: receiptQtyBase,
          notes: `Pembelian: ${buyQuantity} pax/bal (Total Rp${totalPrice.toLocaleString('id-ID')}). Dikali konversi ${conversionMultiplier} masuk sebagai ${receiptQtyBase} base unit.`,
          userId: session.user.id
        }
      })

      return updatedItem
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error("Goods Receipt Error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan sistem internal" }, { status: 500 })
  }
}
