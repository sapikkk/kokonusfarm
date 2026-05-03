/**
 * @file src/services/hpp-service.ts
 * @description HPP (Harga Pokok Produksi) calculation service using Activity-Based Costing.
 * Separates business logic from API route handlers.
 */

import { prisma } from "@/lib/prisma";

export interface HppBreakdown {
  costSeed: number;       // Layer 1: Biaya benih dari batch semai
  costMedia: number;      // Layer 1: Biaya rockwool/media dari batch semai
  costNutrient: number;   // Layer 2: Biaya nutrisi dari instalasi
  costElectricity: number; // Layer 3: Biaya listrik dari greenhouse
  costLabor: number;      // Biaya tenaga kerja (diisi manual)
  costOther: number;      // Biaya lain-lain (diisi manual)
  totalCost: number;      // Total seluruh biaya
  hppPerUnit: number;     // HPP per unit (totalCost / harvestQty)
}

/**
 * Estimates HPP for a harvest report based on the production cycle.
 * This is called when admin opens the review dialog to get a pre-filled estimate.
 *
 * @param cycleId - The production cycle ID
 * @param harvestQuantity - Total harvest quantity (e.g. kg)
 * @returns Breakdown of all cost components
 */
export async function estimateHpp(
  cycleId: string,
  harvestQuantity: number
): Promise<HppBreakdown> {
  // Fetch the production cycle with all related cost data
  const cycle = await prisma.productionCycle.findUniqueOrThrow({
    where: { id: cycleId },
    include: {
      installation: {
        include: {
          greenhouse: true,
        },
      },
    },
  });

  // Layer 1: Fixed costs attached directly to the batch
  const costSeed = Number(cycle.fixedCostSeed) || 0;
  const costMedia = Number(cycle.fixedCostMedia) || 0;

  // Layer 2: Fixed nutrient cost from the installation (per cycle)
  const costNutrient = cycle.installation
    ? Number(cycle.installation.fixedCostNutrient) || 0
    : 0;

  // Layer 3: Fixed electricity cost from the greenhouse (per cycle)
  // TODO: Future improvement — prorate by installation slot count vs total slots
  const costElectricity = cycle.installation?.greenhouse
    ? Number(cycle.installation.greenhouse.fixedCostElectricity) || 0
    : 0;

  const costLabor = 0; // Admin will fill this in during review
  const costOther = 0; // Admin will fill this in during review

  const totalCost = costSeed + costMedia + costNutrient + costElectricity + costLabor + costOther;
  const hppPerUnit = harvestQuantity > 0 ? totalCost / harvestQuantity : 0;

  return {
    costSeed,
    costMedia,
    costNutrient,
    costElectricity,
    costLabor,
    costOther,
    totalCost,
    hppPerUnit,
  };
}

/**
 * Calculates and saves the final HPP when admin approves a harvest report.
 *
 * @param reportId - The harvest report ID to approve
 * @param breakdown - Cost breakdown provided/adjusted by admin
 * @param reviewedById - The admin user ID who is approving
 */
export async function approveAndSetHpp(
  reportId: string,
  breakdown: Omit<HppBreakdown, "totalCost" | "hppPerUnit">,
  reviewedById: string
): Promise<void> {
  const report = await prisma.harvestReport.findUniqueOrThrow({
    where: { id: reportId },
  });

  const totalCost =
    breakdown.costSeed +
    breakdown.costMedia +
    breakdown.costNutrient +
    breakdown.costElectricity +
    breakdown.costLabor +
    breakdown.costOther;

  const harvestQty = Number(report.harvestQuantity);
  const hppPerUnit = harvestQty > 0 ? totalCost / harvestQty : 0;

  await prisma.harvestReport.update({
    where: { id: reportId },
    data: {
      status: "APPROVED",
      reviewedById,
      reviewedAt: new Date(),
      hppPerUnit,
      ...breakdown,
    },
  });
}
