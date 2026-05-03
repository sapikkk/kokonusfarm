import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — List semua pelanggan
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") ?? ""

  const customers = await prisma.customer.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    include: {
      _count: { select: { salesOrders: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(customers)
}

// POST — Tambah pelanggan baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { name, phone, address, type } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nama pelanggan wajib diisi" }, { status: 400 })
  }

  const customer = await prisma.customer.create({
    data: { name: name.trim(), phone, address, type: type ?? "PERSONAL" },
  })

  return NextResponse.json(customer, { status: 201 })
}
