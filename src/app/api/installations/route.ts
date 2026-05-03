import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const installations = await prisma.installation.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        totalSlots: true,
        fixedCostNutrient: true,
        greenhouse: {
          select: {
            id: true,
            code: true,
            name: true,
            fixedCostElectricity: true,
          },
        },
      },
      orderBy: [{ greenhouse: { code: "asc" } }, { code: "asc" }],
    })

    // Serialize Decimal → number
    const result = installations.map((i) => ({
      ...i,
      fixedCostNutrient: Number(i.fixedCostNutrient),
      greenhouse: {
        ...i.greenhouse,
        fixedCostElectricity: Number(i.greenhouse.fixedCostElectricity),
      },
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching installations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
