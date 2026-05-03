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
    const phase = searchParams.get("phase")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {}
    
    if (phase) {
      where.phase = phase
    }

    const cycles = await prisma.productionCycle.findMany({
      where,
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    })

    return NextResponse.json(cycles)
  } catch (error) {
    console.error("Error fetching production cycles:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - No valid user session found" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      batchCode,
      plantType,
      phase,
      initialQuantity,
      notes,
      installationId,
      activeSeedPackId,
      activeMediaPackId,
      fixedCostSeed,
      fixedCostMedia,
    } = body

    const cycle = await prisma.productionCycle.create({
      data: {
        batchCode,
        plantType,
        phase: phase || "SEMAI",
        initialQuantity: parseInt(initialQuantity),
        currentQuantity: parseInt(initialQuantity),
        rejectedCount: 0,
        startDate: new Date(),
        notes,
        // ABC Costing — lokasi & biaya batch
        installationId: installationId ?? null,
        activeSeedPackId: activeSeedPackId ?? null,
        activeMediaPackId: activeMediaPackId ?? null,
        fixedCostSeed: fixedCostSeed ?? 0,
        fixedCostMedia: fixedCostMedia ?? 0,
      },
    })

    // Create initial production log
    await prisma.productionLog.create({
      data: {
        cycleId: cycle.id,
        action: "PHASE_CHANGE",
        toPhase: cycle.phase,
        notes: `Batch ${batchCode} dimulai`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(cycle, { status: 201 })
  } catch (error: any) {
    console.error("Error creating production cycle:", error)
    
    // Check for Prisma unique constraint violation (P2002)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Kode batch ini sudah digunakan. Silakan gunakan kode batch yang berbeda." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat membuat batch." },
      { status: 500 }
    )
  }
}
