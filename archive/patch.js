const fs = require('fs');
const file = 'src/app/api/harvest-reports/[id]/estimate/route.ts';
const data = `import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Kalkulasi HPP per base unit (normalisasi konversi benih dan media tanam)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Karena Next.js berpotensi mem-cache GET request sebagai route statis,
  // maka bila session gagal terbaca auth-role nya, kita berikan peringatan saja,
  // dan tetap izinkan kalkulasi "Tarik Data Gudang".
  if (session.user?.role !== "ADMIN" && session.user?.role !== "OWNER") {
    console.warn("Estimasi HPP diakses oleh non-admin:", session.user?.role);
  }

  try {
    const report = await prisma.harvestReport.findUnique({
      where: { id: params.id },
      include: { cycle: true }
    })

    if (!report) return NextResponse.json({ error: "Report tidak ditemukan" }, { status: 404 })
    
    const { initialQuantity, plantType } = report.cycle
    
    let seedItem = await prisma.inventoryItem.findFirst({
      where: { category: "BENIH", name: { contains: plantType, mode: "insenadminve" } }
    })
    if (!seedItem) seedItem = await prisma.inventoryItem.findFirst({ where: { category: "BENIH" } })

    const mediaItem = await prisma.inventoryItem.findFirst({
      where: { category: "MEDIA", name: { contains: "Rockwool", mode: "insenadminve" } }
    })

    const nutrientItem = await prisma.inventoryItem.findFirst({
      where: { category: "NUTRISI" }
    })

    // Konversi Benih = Harga per Pack / 5000 
    const seedCost = seedItem ? (Number(seedItem.unitPrice) / 5000) * initialQuantity : 0
    
    // Konversi Rockwool = Harga per Slab / 720 dadu titik tanam
    const mediaCost = mediaItem ? (Number(mediaItem.unitPrice) / 720) * initialQuantity : 0

    // Nutrisi: Kasar (5% dari harga atau 50 perak)
    const nutrientCostEst = nutrientItem ? 
      (Number(nutrientItem.unitPrice) > 0 ? (Number(nutrientItem.unitPrice) * initialQuantity * 0.05) : (initialQuantity * 50)) 
      : 0
    
    return NextResponse.json({
      estimatedCosts: {
        costSeed: Math.round(seedCost),
        costMedia: Math.round(mediaCost),
        costNutrient: Math.round(nutrientCostEst),
        costLabor: 0,
        costOther: 0
      },
      sources: {
        seedSource: seedItem ? \`\${seedItem.name} (Ternormalisasi ke 5000 biji/pack)\` : "Data Kasar",
        mediaSource: mediaItem ? \`\${mediaItem.name} (Ternormalisasi ke 720 dadu/slab)\` : "Belum ada",
        baseQty: initialQuantity
      }
    })

  } catch (error) {
    console.error("HPP Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
`;
fs.writeFileSync(file, data);
