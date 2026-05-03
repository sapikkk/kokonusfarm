import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/inventory/[id] - Get single inventory item detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        inventoryLogs: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/inventory/[id] - Update inventory item or record stock movement
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
    const { 
      // Stock movement fields
      movement, quantity, notes, reference,
      // Item info update fields
      name, code, category, unit, minStock, unitPrice, description, isActive 
    } = body

    // If movement is provided, record a stock in/out/adjust
    if (movement && quantity !== undefined) {
      const item = await prisma.inventoryItem.findUnique({ where: { id: params.id } })
      if (!item) {
        return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
      }

      const qty = parseFloat(quantity)
      let newStock = parseFloat(item.currentStock.toString())

      if (movement === "IN") {
        newStock += qty
      } else if (movement === "OUT") {
        if (newStock < qty) {
          return NextResponse.json(
            { error: "Insufficient stock" },
            { status: 400 }
          )
        }
        newStock -= qty
      } else if (movement === "ADJUST") {
        newStock = qty // Direct adjustment sets absolute value
      }

      // Update stock and log movement in a single transaction
      const [updatedItem, log] = await prisma.$transaction([
        prisma.inventoryItem.update({
          where: { id: params.id },
          data: { currentStock: newStock },
        }),
        prisma.inventoryLog.create({
          data: {
            itemId: params.id,
            movement,
            quantity: qty,
            reference,
            notes,
            userId: session.user.id,
          },
        }),
      ])

      return NextResponse.json({ item: updatedItem, log })
    }

    // Otherwise, update item info
    const updatedItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(category !== undefined && { category }),
        ...(unit !== undefined && { unit }),
        ...(minStock !== undefined && { minStock: parseFloat(minStock) }),
        ...(unitPrice !== undefined && { unitPrice: parseFloat(unitPrice) }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error: any) {
    console.error("Error updating inventory item:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/inventory/[id] - Soft delete (deactivate) inventory item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === "PEKERJA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if item has inventory logs
    const logCount = await prisma.inventoryLog.count({
      where: { itemId: params.id },
    })

    if (logCount > 0) {
      // Soft delete to preserve history
      const item = await prisma.inventoryItem.update({
        where: { id: params.id },
        data: { isActive: false },
      })
      return NextResponse.json({
        message: "Item deactivated (has inventory history)",
        item,
      })
    }

    await prisma.inventoryItem.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Inventory item deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting inventory item:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
