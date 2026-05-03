import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — Detail pelanggan + riwayat SO
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      salesOrders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, orderNumber: true, status: true, totalAmount: true, createdAt: true },
      },
    },
  })

  if (!customer) return NextResponse.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 })
  return NextResponse.json(customer)
}

// PUT — Update data pelanggan
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { name, phone, address, type } = body

  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: { name, phone, address, type },
  })

  return NextResponse.json(customer)
}
