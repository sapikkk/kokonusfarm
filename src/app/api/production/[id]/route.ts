import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/production/[id] - Get single production cycle detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cycle = await prisma.productionCycle.findUnique({
      where: { id: params.id },
      include: {
        productionLogs: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!cycle) {
      return NextResponse.json({ error: "Production cycle not found" }, { status: 404 })
    }

    return NextResponse.json(cycle)
  } catch (error) {
    console.error("Error fetching production cycle:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/production/[id] - Update production cycle (phase change, harvest, quantity update)
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
    const { action, phase, quantity, rejectedCount, notes, plantType, sulamQuantity, rejectQuantity } = body

    const cycle = await prisma.productionCycle.findUnique({ where: { id: params.id } })
    if (!cycle) {
      return NextResponse.json({ error: "Production cycle not found" }, { status: 404 })
    }

    const updates: any = {}
    const logData: any = {
      cycleId: params.id,
      action: action || "NOTE",
      notes,
      userId: session.user.id,
    }

    // Phase change
    if (action === "PHASE_CHANGE" && phase) {
      logData.fromPhase = cycle.phase
      logData.toPhase = phase
      updates.phase = phase

      // Auto-set harvest date when moving to PANEN
      if (phase === "PANEN") {
        updates.harvestDate = new Date()
      }
    }

    // Harvest - split betweeen sellable and reject (unsellable)
    if (action === "HARVEST" && quantity !== undefined) {
      const harvestedGood = parseInt(quantity)
      const harvestedBad = parseInt(rejectQuantity || "0")
      const totalRemoved = harvestedGood + harvestedBad

      updates.currentQuantity = Math.max(0, cycle.currentQuantity - totalRemoved)
      updates.rejectedCount = cycle.rejectedCount + harvestedBad
      updates.phase = "PANEN"
      updates.harvestDate = new Date()
      
      logData.action = "HARVEST"
      logData.quantity = harvestedGood
      logData.toPhase = "PANEN"
      logData.fromPhase = cycle.phase
      logData.notes = `Panen Layak: ${harvestedGood}. Afkir: ${harvestedBad}. ${notes || ""}`.trim()
    }

    // Record rejected/dead plants
    if (action === "REJECT" && quantity !== undefined) {
      const rejectedQty = parseInt(quantity)
      updates.rejectedCount = cycle.rejectedCount + rejectedQty
      updates.currentQuantity = Math.max(0, cycle.currentQuantity - rejectedQty)
      logData.action = "REJECT"
      logData.quantity = rejectedQty
    }

    // Quantity update
    if (action === "QUANTITY_UPDATE" && quantity !== undefined) {
      updates.currentQuantity = parseInt(quantity)
      logData.action = "QUANTITY_UPDATE"
      logData.quantity = parseInt(quantity)
    }

    // Update rejected count separately (if provided without action=REJECT)
    if (rejectedCount !== undefined && action !== "REJECT") {
      updates.rejectedCount = parseInt(rejectedCount)
    }

    // Update notes or plant type
    if (notes && !action) updates.notes = notes
    if (plantType) updates.plantType = plantType

    const transactionOperations: any[] = [
      prisma.productionCycle.update({
        where: { id: params.id },
        data: updates,
      }),
      prisma.productionLog.create({ data: logData }),
    ]

    // Create a new SULAM (Replant) queue if requested during REJECT
    if (action === "REJECT" && sulamQuantity && parseInt(sulamQuantity) > 0) {
      const sulamQty = parseInt(sulamQuantity)
      transactionOperations.push(
        prisma.productionCycle.create({
          data: {
            batchCode: `${cycle.batchCode}-SUL-${Date.now().toString().slice(-4)}`,
            plantType: cycle.plantType,
            phase: "SEMAI",
            initialQuantity: sulamQty,
            currentQuantity: sulamQty,
            rejectedCount: 0,
            notes: `Antrian Sulam (tanam ulang) dari kegagalan batch ${cycle.batchCode}`,
          }
        })
      )
    }

    const results = await prisma.$transaction(transactionOperations)
    const updatedCycle = results[0]
    const log = results[1]

    return NextResponse.json({ cycle: updatedCycle, log })
  } catch (error: any) {
    console.error("Error updating production cycle:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Production cycle not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/production/[id] - Cancel/delete a production cycle
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === "PEKERJA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cycle = await prisma.productionCycle.findUnique({
      where: { id: params.id },
      include: { _count: { select: { productionLogs: true } } },
    })

    if (!cycle) {
      return NextResponse.json({ error: "Production cycle not found" }, { status: 404 })
    }

    // Cascading delete (productionLogs are deleted automatically via onDelete: Cascade in schema)
    await prisma.productionCycle.delete({ where: { id: params.id } })

    return NextResponse.json({ message: "Production cycle deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting production cycle:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Production cycle not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
