import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_CATEGORIES = [
  { id: "NUTRISI", name: "Nutrisi", code: "NUTRISI" },
  { id: "MEDIA", name: "Media Tanam", code: "MEDIA" },
  { id: "BENIH", name: "Benih", code: "BENIH" },
  { id: "KEMASAN", name: "Kemasan", code: "KEMASAN" },
  { id: "ALAT", name: "Alat", code: "ALAT" },
  { id: "LAINNYA", name: "Lain-lain", code: "LAINNYA" },
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customCategories = await prisma.customCategory.findMany({
      orderBy: { name: "asc" }
    })

    const formattedCustom = customCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      code: cat.name.toUpperCase().replace(/\s+/g, "_")
    }))

    return NextResponse.json([...DEFAULT_CATEGORIES, ...formattedCustom])
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 })
    }

    const trimmedName = name.trim()
    const isDefault = DEFAULT_CATEGORIES.some(
      cat => cat.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (isDefault) {
      return NextResponse.json({ error: "Kategori bawaan sudah ada" }, { status: 400 })
    }

    // Check custom category duplication
    const existingCustom = await prisma.customCategory.findUnique({
      where: { name: trimmedName }
    })

    if (existingCustom) {
      return NextResponse.json({ error: "Kategori kustom sudah terdaftar" }, { status: 400 })
    }

    // Role-based behavior
    const role = session.user.role

    if (role === "OWNER" || role === "ADMIN") {
      const newCategory = await prisma.customCategory.create({
        data: { name: trimmedName }
      })
      return NextResponse.json({
        message: "Kategori berhasil ditambahkan langsung",
        category: newCategory,
        approved: true
      }, { status: 201 })
    } else {
      // Pekerja (Worker) -> create CategoryRequest
      // Check duplicate request
      const existingRequest = await prisma.categoryRequest.findUnique({
        where: { name: trimmedName }
      })

      if (existingRequest) {
        return NextResponse.json({ 
          error: `Pengajuan untuk kategori "${trimmedName}" sudah ada dan berstatus ${existingRequest.status}` 
        }, { status: 400 })
      }

      const newRequest = await prisma.categoryRequest.create({
        data: {
          name: trimmedName,
          requestedById: session.user.id,
          status: "PENDING"
        }
      })

      return NextResponse.json({
        message: "Pengajuan kategori berhasil terkirim dan menunggu persetujuan",
        request: newRequest,
        approved: false
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
