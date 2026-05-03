"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── GREENHOUSE ACTIONS ───────────────────────────────────────────────────────

export async function createGreenhouse(data: {
  code: string;
  name: string;
  location?: string;
  area?: number | null;
  fixedCostElectricity: number;
  electricityNotes?: string;
}) {
  await prisma.greenhouse.create({
    data: {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      location: data.location?.trim() || null,
      area: data.area ?? null,
      fixedCostElectricity: data.fixedCostElectricity,
      electricityNotes: data.electricityNotes?.trim() || null,
    },
  });
  revalidatePath("/admin/greenhouse");
}

export async function updateGreenhouse(
  id: string,
  data: {
    code: string;
    name: string;
    location?: string;
    area?: number | null;
    fixedCostElectricity: number;
    electricityNotes?: string;
    isActive: boolean;
  }
) {
  await prisma.greenhouse.update({
    where: { id },
    data: {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      location: data.location?.trim() || null,
      area: data.area ?? null,
      fixedCostElectricity: data.fixedCostElectricity,
      electricityNotes: data.electricityNotes?.trim() || null,
      isActive: data.isActive,
    },
  });
  revalidatePath("/admin/greenhouse");
}

// ── INSTALLATION ACTIONS ─────────────────────────────────────────────────────

export type InstallationType =
  | "SEMAI_TRAY"
  | "DFT"
  | "NFT"
  | "DWC"
  | "WICK";

export async function createInstallation(data: {
  code: string;
  name: string;
  type: InstallationType;
  greenhouseId: string;
  totalSlots?: number | null;
  fixedCostNutrient: number;
  nutrientNotes?: string;
}) {
  await prisma.installation.create({
    data: {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      type: data.type,
      greenhouseId: data.greenhouseId,
      totalSlots: data.totalSlots ?? null,
      fixedCostNutrient: data.fixedCostNutrient,
      nutrientNotes: data.nutrientNotes?.trim() || null,
    },
  });
  revalidatePath("/admin/instalasi");
}

export async function updateInstallation(
  id: string,
  data: {
    code: string;
    name: string;
    type: InstallationType;
    greenhouseId: string;
    totalSlots?: number | null;
    fixedCostNutrient: number;
    nutrientNotes?: string;
    isActive: boolean;
  }
) {
  await prisma.installation.update({
    where: { id },
    data: {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      type: data.type,
      greenhouseId: data.greenhouseId,
      totalSlots: data.totalSlots ?? null,
      fixedCostNutrient: data.fixedCostNutrient,
      nutrientNotes: data.nutrientNotes?.trim() || null,
      isActive: data.isActive,
    },
  });
  revalidatePath("/admin/instalasi");
}
