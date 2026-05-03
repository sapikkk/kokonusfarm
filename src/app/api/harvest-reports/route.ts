import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST — Worker submit laporan panen
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { cycleId, harvestQuantity, harvestUnit, workerNotes } = body

  if (!cycleId || !harvestQuantity) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
  }

  const report = await prisma.harvestReport.create({
    data: {
      cycleId,
      harvestQuantity,
      harvestUnit: harvestUnit || "kg",
      workerNotes,
      submittedById: session.user.id,
      status: "PENDING",
    },
    include: {
      cycle: { select: { batchCode: true, plantType: true } },
      submittedBy: { select: { name: true } },
    },
  })

  return NextResponse.json(report, { status: 201 })
}

// GET — Admin/Owner get semua laporan
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const where = status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {}

  const reports = await prisma.harvestReport.findMany({
    where,
    include: {
      cycle: {
        select: { batchCode: true, plantType: true, startDate: true },
      },
      submittedBy: { select: { name: true } },
      reviewedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reports)
}
