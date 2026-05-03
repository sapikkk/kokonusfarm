import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — Detail Sales Order
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const order = await prisma.salesOrder.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: {
          inventoryItem: { select: { id: true, name: true, unit: true, currentStock: true } },
        },
      },
      deliveries: {
        include: { kurir: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!order) return NextResponse.json({ error: "Sales Order tidak ditemukan" }, { status: 404 })
  return NextResponse.json(order)
}

// PATCH — Handle actions: CONFIRM, SHIP, DELIVER, CANCEL, PAY
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { action, notes, deliveryNotes, paidAmount } = body

  const order = await prisma.salesOrder.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { inventoryItem: true } },
      customer: true,
    },
  })

  if (!order) return NextResponse.json({ error: "SO tidak ditemukan" }, { status: 404 })

  // ── CONFIRM: Validate stok, kurangi stok, ubah status ─────────────────────
  if (action === "CONFIRM") {
    if (order.status !== "DRAFT") {
      return NextResponse.json({ error: "Hanya SO berstatus DRAFT yang bisa dikonfirmasi" }, { status: 400 })
    }

    // Validasi stok semua item
    for (const item of order.items) {
      const stock = Number(item.inventoryItem.currentStock)
      const qty = Number(item.quantity)
      if (stock < qty) {
        return NextResponse.json(
          {
            error: `Stok ${item.inventoryItem.name} tidak mencukupi. Tersedia: ${stock} ${item.inventoryItem.unit}, Dibutuhkan: ${qty}`,
          },
          { status: 400 }
        )
      }
    }

    // Kurangi stok + buat inventory log dalam satu transaksi atomik
    const updated = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.inventoryItem.update({
          where: { id: item.inventoryItemId },
          data: { currentStock: { decrement: Number(item.quantity) } },
        })
        await tx.inventoryLog.create({
          data: {
            itemId: item.inventoryItemId,
            movement: "OUT",
            quantity: item.quantity,
            reference: order.orderNumber,
            notes: `Penjualan SO: ${order.orderNumber}`,
            userId: session.user.id,
          },
        })
      }

      // Buat DeliveryLog awal
      await tx.deliveryLog.create({
        data: {
          orderId: order.id,
          kurirId: session.user.id,
          status: "PENDING",
          notes: "SO dikonfirmasi, menunggu pengiriman",
        },
      })

      return tx.salesOrder.update({
        where: { id: params.id },
        data: { status: "CONFIRMED", notes: notes || order.notes },
        include: { customer: true, items: { include: { inventoryItem: true } }, deliveries: true },
      })
    })

    return NextResponse.json(updated)
  }

  // ── SHIP: Ubah status ke SHIPPED ──────────────────────────────────────────
  if (action === "SHIP") {
    if (order.status !== "CONFIRMED" && order.status !== "PACKED") {
      return NextResponse.json({ error: "SO belum dikonfirmasi" }, { status: 400 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.deliveryLog.create({
        data: {
          orderId: order.id,
          kurirId: session.user.id,
          status: "SHIPPING",
          notes: deliveryNotes || "Barang dalam pengiriman",
        },
      })

      return tx.salesOrder.update({
        where: { id: params.id },
        data: { status: "SHIPPED" },
        include: { customer: true, deliveries: { orderBy: { createdAt: "desc" } } },
      })
    })

    return NextResponse.json(updated)
  }

  // ── DELIVER: Ubah ke DELIVERED + auto-generate jurnal pendapatan ──────────
  if (action === "DELIVER") {
    if (order.status !== "SHIPPED") {
      return NextResponse.json({ error: "SO belum dalam status SHIPPED" }, { status: 400 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.deliveryLog.create({
        data: {
          orderId: order.id,
          kurirId: session.user.id,
          status: "DELIVERED",
          deliveryDate: new Date(),
          notes: deliveryNotes || "Barang berhasil diterima pelanggan",
        },
      })

      // Auto-generate jurnal pendapatan (US5.4)
      const [revenueAccount, receivableAccount] = await Promise.all([
        tx.account.findFirst({ where: { type: "REVENUE", code: { startsWith: "4-" } } }),
        tx.account.findFirst({ where: { type: "ASSET", name: { contains: "Kas" } } }),
      ])

      if (revenueAccount && receivableAccount) {
        await tx.transaction.create({
          data: {
            date: new Date(),
            description: `Pendapatan Penjualan — ${order.orderNumber}${order.customer ? ` (${order.customer.name})` : ""}`,
            reference: order.orderNumber,
            status: "PENDING",
            userId: session.user.id,
            journalLines: {
              create: [
                {
                  accountId: receivableAccount.id,
                  debit: Number(order.totalAmount),
                  credit: 0,
                  notes: `Penerimaan dari SO ${order.orderNumber}`,
                },
                {
                  accountId: revenueAccount.id,
                  debit: 0,
                  credit: Number(order.totalAmount),
                  notes: `Pendapatan penjualan SO ${order.orderNumber}`,
                },
              ],
            },
          },
        })
      }

      return tx.salesOrder.update({
        where: { id: params.id },
        data: { status: "DELIVERED" },
        include: { customer: true, deliveries: { orderBy: { createdAt: "desc" } } },
      })
    })

    return NextResponse.json(updated)
  }

  // ── CANCEL ────────────────────────────────────────────────────────────────
  if (action === "CANCEL") {
    if (order.status === "DELIVERED") {
      return NextResponse.json({ error: "SO yang sudah DELIVERED tidak bisa dibatalkan" }, { status: 400 })
    }

    // Kembalikan stok jika sudah dikonfirmasi
    const updated = await prisma.$transaction(async (tx) => {
      if (order.status !== "DRAFT") {
        for (const item of order.items) {
          await tx.inventoryItem.update({
            where: { id: item.inventoryItemId },
            data: { currentStock: { increment: Number(item.quantity) } },
          })
          await tx.inventoryLog.create({
            data: {
              itemId: item.inventoryItemId,
              movement: "IN",
              quantity: item.quantity,
              reference: order.orderNumber,
              notes: `Pembatalan SO: ${order.orderNumber}`,
              userId: session.user.id,
            },
          })
        }
      }

      return tx.salesOrder.update({
        where: { id: params.id },
        data: { status: "CANCELLED", notes: notes || "Dibatalkan" },
      })
    })

    return NextResponse.json(updated)
  }

  // ── PAY: Update payment status ────────────────────────────────────────────
  if (action === "PAY") {
    const paid = parseFloat(paidAmount ?? order.totalAmount.toString())
    const payStatus = paid >= Number(order.totalAmount) ? "PAID" : "PARTIAL"

    const updated = await prisma.salesOrder.update({
      where: { id: params.id },
      data: { paidAmount: paid, paymentStatus: payStatus },
    })

    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Action tidak valid" }, { status: 400 })
}
