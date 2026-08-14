import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/harvest-reports/[id]/estimate
 *
 * Tarik data biaya HPP secara otomatis menggunakan 3-layer ABC Costing:
 *   Layer 1 — Batch Semai : fixedCostSeed + fixedCostMedia  (diisi saat buat batch)
 *   Layer 2 — Instalasi   : fixedCostNutrient               (dari installation terkait)
 *   Layer 3 — Greenhouse  : fixedCostElectricity            (dari greenhouse terkait)
 *
 * Fallback ke perkiraan inventory jika data batch/instalasi belum diset.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Ambil report + cycle + installation chain
    const report = await prisma.harvestReport.findUnique({
      where: { id: params.id },
      include: {
        cycle: {
          include: {
            installation: {
              include: {
                greenhouse: true,
              },
            },
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: "Report tidak ditemukan" }, { status: 404 })
    }

    const { cycle } = report
    const { initialQuantity, plantType, installation } = cycle

    // ── LAYER 1: Batch Semai (Benih + Rockwool) ──────────────────────────────
    let costSeed = Number(cycle.fixedCostSeed ?? 0)
    let costMedia = Number(cycle.fixedCostMedia ?? 0)
    let seedSource = "Data batch semai"
    let mediaSource = "Data batch semai"
    const abcUsed: string[] = []

    if (costSeed > 0 || costMedia > 0) {
      abcUsed.push("Layer 1 (Batch)")
    }

    // ── LAYER 2: Instalasi (Nutrisi) ─────────────────────────────────────────
    let costNutrient = 0
    let nutrientSource = "Tidak ada data instalasi"

    if (installation) {
      costNutrient = Number(installation.fixedCostNutrient ?? 0)
      nutrientSource = `${installation.code} · ${installation.name}`
      if (costNutrient > 0) abcUsed.push("Layer 2 (Instalasi)")
    }

    // ── LAYER 3: Greenhouse (Listrik) ─────────────────────────────────────────
    let costElectricity = 0
    let electricitySource = "Tidak ada data greenhouse"
    let greenhouseName = ""

    if (installation?.greenhouse) {
      costElectricity = Number(installation.greenhouse.fixedCostElectricity ?? 0)
      electricitySource = `${installation.greenhouse.code} · ${installation.greenhouse.name}`
      greenhouseName = installation.greenhouse.name
      if (costElectricity > 0) abcUsed.push("Layer 3 (Greenhouse)")
    }

    // ── FALLBACK: jika Layer 1 kosong, estimasi dari inventory ──────────────
    if (costSeed === 0) {
      let seedItem = await prisma.inventoryItem.findFirst({
        where: { category: "BENIH", name: { contains: plantType, mode: "insensitive" } },
      })
      if (!seedItem) {
        seedItem = await prisma.inventoryItem.findFirst({ where: { category: "BENIH" } })
      }
      if (seedItem && Number(seedItem.unitPrice) > 0) {
        costSeed = Math.round((Number(seedItem.unitPrice) / 5000) * initialQuantity)
        seedSource = `Estimasi Gudang · ${seedItem.name} (Rp${Number(seedItem.unitPrice).toLocaleString("id-ID")}/pack ÷ 5000 biji × ${initialQuantity})`
      } else {
        seedSource = "Tidak ada data benih di gudang"
      }
    }

    if (costMedia === 0) {
      const mediaItem = await prisma.inventoryItem.findFirst({
        where: { category: "MEDIA", name: { contains: "Rockwool", mode: "insensitive" } },
      })
      if (mediaItem && Number(mediaItem.unitPrice) > 0) {
        costMedia = Math.round((Number(mediaItem.unitPrice) / 720) * initialQuantity)
        mediaSource = `Estimasi Gudang · ${mediaItem.name} (Rp${Number(mediaItem.unitPrice).toLocaleString("id-ID")}/slab ÷ 720 dadu × ${initialQuantity})`
      } else {
        mediaSource = "Tidak ada data rockwool di gudang"
      }
    }

    // Nutrisi fallback jika tidak ada instalasi
    if (costNutrient === 0 && !installation) {
      const nutrientItem = await prisma.inventoryItem.findFirst({ where: { category: "NUTRISI" } })
      if (nutrientItem && Number(nutrientItem.unitPrice) > 0) {
        costNutrient = Math.round(Number(nutrientItem.unitPrice) * initialQuantity * 0.05)
        nutrientSource = `Estimasi Gudang · ${nutrientItem.name} (5% dari harga × ${initialQuantity})`
      }
    }

    const totalEstimated = costSeed + costMedia + costNutrient + costElectricity
    const hppPerUnitSuggestion = report.harvestQuantity && Number(report.harvestQuantity) > 0
      ? Math.ceil(totalEstimated / Number(report.harvestQuantity))
      : 0

    const abcNote = abcUsed.length > 0
      ? `Data ABC: ${abcUsed.join(" + ")}`
      : "Estimasi gudang (batch belum dikaitkan instalasi)"

    return NextResponse.json({
      estimatedCosts: {
        costSeed: Math.round(costSeed),
        costMedia: Math.round(costMedia),
        costNutrient: Math.round(costNutrient),
        costElectricity: Math.round(costElectricity),
        costLabor: 0,
        costOther: 0,
      },
      hppPerUnitSuggestion,
      abcChain: {
        hasInstallation: !!installation,
        hasGreenhouse: !!installation?.greenhouse,
        installationName: installation ? `${installation.code} · ${installation.name}` : null,
        greenhouseName: greenhouseName || null,
        abcLayersUsed: abcUsed,
      },
      sources: {
        seedSource,
        mediaSource,
        nutrientSource,
        electricitySource,
        abcNote,
        baseQty: initialQuantity,
      },
    })
  } catch (error) {
    console.error("HPP Estimate Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
