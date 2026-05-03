import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/accounts/[id] - Get single account detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.account.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        journalLines: {
          include: { transaction: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error fetching account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/accounts/[id] - Update account
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code, name, type, description, parentId, isActive } = body

    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
        ...(code !== undefined && { code }),
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(parentId !== undefined && { parentId }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(account)
  } catch (error: any) {
    console.error("Error updating account:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/accounts/[id] - Soft delete (deactivate) account
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if account has journal lines
    const journalCount = await prisma.journalLine.count({
      where: { accountId: params.id },
    })

    if (journalCount > 0) {
      // Soft delete: deactivate instead of hard delete to preserve data integrity
      const account = await prisma.account.update({
        where: { id: params.id },
        data: { isActive: false },
      })
      return NextResponse.json({
        message: "Account deactivated (has journal history)",
        account,
      })
    }

    // Hard delete if no journal lines exist
    await prisma.account.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting account:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
