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
    const type = searchParams.get("type")
    const active = searchParams.get("active")

    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (active === "true") {
      where.isActive = true
    }

    const accounts = await prisma.account.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        code: "asc",
      },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { code, name, type, description, parentId } = body

    const account = await prisma.account.create({
      data: {
        code,
        name,
        type,
        description,
        parentId,
        isActive: true,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
