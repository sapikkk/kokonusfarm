import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/transactions/[id] - Get full transaction detail with journal lines
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        journalLines: {
          include: {
            account: {
              select: { id: true, code: true, name: true, type: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Compute totals
    const totalDebit = transaction.journalLines.reduce(
      (sum, line) => sum + parseFloat(line.debit.toString()),
      0
    )
    const totalCredit = transaction.journalLines.reduce(
      (sum, line) => sum + parseFloat(line.credit.toString()),
      0
    )

    return NextResponse.json({ ...transaction, totalDebit, totalCredit })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/transactions/[id] - Update transaction status or details
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, description, reference, date, journalLines } = body

    const existing = await prisma.transaction.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Only ADMIN/OWNER can approve or reject
    if (
      (status === "APPROVED" || status === "REJECTED") &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "OWNER"
    ) {
      return NextResponse.json(
        { error: "Only ADMIN or OWNER can approve/reject transactions" },
        { status: 403 }
      )
    }

    // Cannot edit an approved transaction
    if (existing.status === "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Cannot edit an approved transaction" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (description !== undefined) updateData.description = description
    if (reference !== undefined) updateData.reference = reference
    if (date !== undefined) updateData.date = new Date(date)

    // If journal lines are being updated, validate balance and replace them
    if (journalLines && journalLines.length > 0) {
      const totalDebit = journalLines.reduce(
        (sum: number, line: any) => sum + parseFloat(line.debit),
        0
      )
      const totalCredit = journalLines.reduce(
        (sum: number, line: any) => sum + parseFloat(line.credit),
        0
      )

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return NextResponse.json(
          { error: "Journal lines must balance (debit = credit)" },
          { status: 400 }
        )
      }

      // Replace all journal lines atomically
      await prisma.$transaction([
        prisma.journalLine.deleteMany({ where: { transactionId: params.id } }),
        prisma.journalLine.createMany({
          data: journalLines.map((line: any) => ({
            transactionId: params.id,
            accountId: line.accountId,
            debit: parseFloat(line.debit),
            credit: parseFloat(line.credit),
            notes: line.notes,
          })),
        }),
      ])
    }

    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        journalLines: {
          include: { account: true },
        },
      },
    })

    return NextResponse.json(transaction)
  } catch (error: any) {
    console.error("Error updating transaction:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/transactions/[id] - Cancel/delete a transaction (DRAFT or REJECTED only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.transaction.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Prevent deleting approved transactions to preserve accounting integrity
    if (existing.status === "APPROVED") {
      return NextResponse.json(
        { error: "Cannot delete an approved transaction. Reject it first." },
        { status: 400 }
      )
    }

    // JournalLines are deleted automatically via onDelete: Cascade
    await prisma.transaction.delete({ where: { id: params.id } })

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting transaction:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
