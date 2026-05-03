import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper: generate nomor order SO-YYYY-NNN
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `SO-${year}-`
  const lastOrder = await prisma.salesOrder.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
  })
  const lastNum = lastOrder
    ? parseInt(lastOrder.orderNumber.replace(prefix, ""), 10)
    : 0
  return `${prefix}${String(lastNum + 1).padStart(3, "0")}`
}

// GET — List semua Sales Order dengan filter
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const customerId = searchParams.get("customerId")

  const orders = await prisma.salesOrder.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(customerId ? { customerId } : {}),
    },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: {
        include: {
          inventoryItem: { select: { id: true, name: true, unit: true } },
        },
      },
      deliveries: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

// POST — Buat Sales Order baru (status DRAFT)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { customerId, items, notes, shippingAddress, costDelivery } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Minimal 1 item harus ditambahkan" }, { status: 400 })
  }

  // Hitung total
  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + parseFloat(item.quantity) * parseFloat(item.unitPrice),
    0
  )

  const orderNumber = await generateOrderNumber()

  const order = await prisma.salesOrder.create({
    data: {
      orderNumber,
      customerId: customerId || null,
      status: "DRAFT",
      paymentStatus: "UNPAID",
      totalAmount,
      costDelivery: costDelivery ?? 0,
      shippingAddress,
      notes,
      items: {
        create: items.map((item: any) => ({
          inventoryItemId: item.inventoryItemId,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        })),
      },
    },
    include: {
      customer: true,
      items: { include: { inventoryItem: true } },
    },
  })

  return NextResponse.json(order, { status: 201 })
}
