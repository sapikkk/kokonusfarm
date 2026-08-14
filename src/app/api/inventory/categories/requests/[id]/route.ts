import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body // APPROVED or REJECTED

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 })
    }

    const existingRequest = await prisma.categoryRequest.findUnique({
      where: { id: params.id }
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 })
    }

    if (existingRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Pengajuan sudah diproses sebelumnya" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Request Status
      const updatedRequest = await tx.categoryRequest.update({
        where: { id: params.id },
        data: { status }
      })

      // 2. If approved, add to CustomCategory
      if (status === "APPROVED") {
        await tx.customCategory.upsert({
          where: { name: existingRequest.name },
          update: {},
          create: { name: existingRequest.name }
        })
      }

      return updatedRequest
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing category request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
