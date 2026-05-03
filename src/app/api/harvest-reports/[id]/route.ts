import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH — Admin approve atau reject laporan panen
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { action, hppPerUnit, hppNotes, costSeed, costMedia, costNutrient, costElectricity, costLabor, costOther } = body

  if (action === "APPROVE") {
    if (!hppPerUnit) {
      return NextResponse.json({ error: "HPP per unit wajib diisi" }, { status: 400 })
    }

    const report = await prisma.harvestReport.findUnique({
      where: { id: params.id },
      include: { cycle: { select: { batchCode: true, plantType: true } } },
    })

    if (!report) return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })

    const totalHpp = parseFloat(hppPerUnit) * parseFloat(report.harvestQuantity.toString())

    // Auto-create jurnal HPP jika ada akun yang sesuai
    // Cari akun HPP dan Persediaan Barang Jadi
    const [hppAccount, inventoryAccount] = await Promise.all([
      prisma.account.findFirst({ where: { code: { startsWith: "5-" }, name: { contains: "Pokok" } } }),
      prisma.account.findFirst({ where: { code: { startsWith: "1-" }, name: { contains: "Persediaan" } } }),
    ])

    let journalTransactionId: string | undefined

    if (hppAccount && inventoryAccount) {
      const journal = await prisma.transaction.create({
        data: {
          date: new Date(),
          description: `HPP Panen ${report.cycle.plantType} — ${report.cycle.batchCode}`,
          reference: report.cycle.batchCode,
          status: "APPROVED",
          userId: session.user.id,
          journalLines: {
            create: [
              {
                accountId: inventoryAccount.id,
                debit: totalHpp,
                credit: 0,
                notes: `Persediaan panen ${report.harvestQuantity} ${report.harvestUnit}`,
              },
              {
                accountId: hppAccount.id,
                debit: 0,
                credit: totalHpp,
                notes: `HPP @ Rp${hppPerUnit}/unit`,
              },
            ],
          },
        },
      })
      journalTransactionId = journal.id
    }

    const updated = await prisma.harvestReport.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        hppPerUnit,
        hppNotes,
        costSeed: costSeed ?? null,
        costMedia: costMedia ?? null,
        costNutrient: costNutrient ?? null,
        costElectricity: costElectricity ?? null,
        costLabor: costLabor ?? null,
        costOther: costOther ?? null,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        journalTransactionId,
      },
      include: {
        cycle: { select: { batchCode: true, plantType: true } },
        submittedBy: { select: { name: true } },
        reviewedBy: { select: { name: true } },
      },
    })

    return NextResponse.json(updated)
  }

  if (action === "REJECT") {
    const updated = await prisma.harvestReport.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        hppNotes: body.hppNotes || "Ditolak oleh admin",
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Action tidak valid" }, { status: 400 })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const report = await prisma.harvestReport.findUnique({
    where: { id: params.id },
    include: {
      cycle: true,
      submittedBy: { select: { name: true, email: true } },
      reviewedBy: { select: { name: true } },
    },
  })

  if (!report) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  return NextResponse.json(report)
}
