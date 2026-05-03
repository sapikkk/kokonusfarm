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
    const category = searchParams.get("category")
    const lowStock = searchParams.get("lowStock")

    const where: any = { isActive: true }
    
    if (category) {
      where.category = category
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    // Filter low stock items if requested
    let filteredItems = items
    if (lowStock === "true") {
      filteredItems = items.filter(item => 
        parseFloat(item.currentStock.toString()) <= parseFloat(item.minStock.toString())
      )
    }

    return NextResponse.json(filteredItems)
  } catch (error) {
    console.error("Error fetching inventory items:", error)
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
    const { code, name, category, unit, currentStock, minStock, unitPrice, description } = body

    const item = await prisma.inventoryItem.create({
      data: {
        code,
        name,
        category,
        unit,
        currentStock: parseFloat(currentStock),
        minStock: parseFloat(minStock),
        unitPrice: parseFloat(unitPrice),
        description,
        isActive: true,
      },
    })

    // Create initial inventory log
    await prisma.inventoryLog.create({
      data: {
        itemId: item.id,
        movement: "IN",
        quantity: parseFloat(currentStock),
        notes: "Initial stock",
        userId: session.user.id,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
