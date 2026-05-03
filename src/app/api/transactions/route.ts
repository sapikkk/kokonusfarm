import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {}
    
    if (status) {
      where.status = status
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        journalLines: {
          include: {
            account: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { date, description, reference, status, journalLines } = body

    // Validate journal lines balance
    const totalDebit = journalLines.reduce((sum: number, line: any) => 
      sum + parseFloat(line.debit), 0
    )
    const totalCredit = journalLines.reduce((sum: number, line: any) => 
      sum + parseFloat(line.credit), 0
    )

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: "Journal lines must balance (debit = credit)" },
        { status: 400 }
      )
    }

    // Create transaction with journal lines
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        reference,
        status: status || "DRAFT",
        userId: session.user.id,
        journalLines: {
          create: journalLines.map((line: any) => ({
            accountId: line.accountId,
            debit: parseFloat(line.debit),
            credit: parseFloat(line.credit),
            notes: line.notes,
          })),
        },
      },
      include: {
        journalLines: {
          include: {
            account: true,
          },
        },
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
