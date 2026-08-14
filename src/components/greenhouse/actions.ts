"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// ── GREENHOUSE ACTIONS ───────────────────────────────────────────────────────

export async function createGreenhouse(data: {
  code: string;
  name: string;
  location?: string;
  area?: number | null;
  fixedCostElectricity: number;
  electricityNotes?: string;
}) {
  try {
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
    return { success: true };
  } catch (error: any) {
    console.error("Error creating greenhouse:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Kode greenhouse sudah digunakan." };
      }
    }
    return { success: false, error: "Gagal membuat greenhouse." };
  }
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
  try {
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
    return { success: true };
  } catch (error: any) {
    console.error("Error updating greenhouse:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Kode greenhouse sudah digunakan." };
      }
    }
    return { success: false, error: "Gagal menyimpan perubahan greenhouse." };
  }
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
  try {
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
    return { success: true };
  } catch (error: any) {
    console.error("Error creating installation:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Kode instalasi sudah digunakan." };
      }
    }
    return { success: false, error: "Gagal membuat instalasi." };
  }
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
  try {
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
    return { success: true };
  } catch (error: any) {
    console.error("Error updating installation:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Kode instalasi sudah digunakan." };
      }
    }
    return { success: false, error: "Gagal menyimpan perubahan instalasi." };
  }
}

export async function deleteGreenhouse(id: string) {
  try {
    // Check if greenhouse has installations
    const count = await prisma.installation.count({
      where: { greenhouseId: id },
    });
    if (count > 0) {
      return { success: false, error: "Tidak dapat menghapus greenhouse karena masih memiliki instalasi aktif." };
    }

    await prisma.greenhouse.delete({
      where: { id },
    });
    revalidatePath("/admin/greenhouse");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting greenhouse:", error);
    return { success: false, error: "Gagal menghapus greenhouse." };
  }
}
