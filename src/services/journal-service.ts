/**
 * @file src/services/journal-service.ts
 * @description Double-entry journal creation service.
 * Handles journal generation for harvest approvals, sales payments, and manual entries.
 */

import { prisma } from "@/lib/prisma";
import type { CreateTransactionPayload } from "@/types";

/**
 * Validates that a set of journal lines is balanced (total debit === total credit).
 * This is the fundamental rule of double-entry bookkeeping.
 *
 * @param lines - Array of journal lines with debit/credit amounts
 * @throws Error if lines are unbalanced
 */
export function validateDoubleEntry(
  lines: { debit: number; credit: number }[]
): void {
  const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);

  // Use tolerance for floating-point comparison
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(
      `Jurnal tidak seimbang! Total Debit: ${totalDebit}, Total Kredit: ${totalCredit}`
    );
  }
}

/**
 * Creates a new double-entry transaction with its journal lines atomically.
 * Uses a Prisma transaction to ensure all-or-nothing behavior.
 *
 * @param userId - ID of the user creating the transaction
 * @param payload - Transaction data including journal lines
 * @returns The created transaction with its journal lines
 */
export async function createDoubleEntryTransaction(
  userId: string,
  payload: CreateTransactionPayload
) {
  // Validate balance before any DB write
  validateDoubleEntry(payload.lines);

  return prisma.$transaction(async (tx) => {
    // Create the parent transaction record
    const transaction = await tx.transaction.create({
      data: {
        date: new Date(payload.date),
        description: payload.description,
        reference: payload.reference,
        status: "PENDING",
        userId,
      },
    });

    // Create all journal lines in bulk
    await tx.journalLine.createMany({
      data: payload.lines.map((line) => ({
        transactionId: transaction.id,
        accountId: line.accountId,
        debit: line.debit,
        credit: line.credit,
        notes: line.notes,
      })),
    });

    return tx.transaction.findUniqueOrThrow({
      where: { id: transaction.id },
      include: { journalLines: { include: { account: true } } },
    });
  });
}

/**
 * Automatically generates the accounting journal when a Harvest Report is approved.
 * Journal entry:
 *   DEBIT  → Persediaan Barang Jadi (Aset bertambah)
 *   CREDIT → Barang Dalam Proses / WIP (Aset berkurang / biaya diakui)
 *
 * Account codes are looked up by convention. Make sure these exist in your COA.
 *
 * @param reportId - The approved harvest report ID
 * @param userId - The admin user ID who approved
 */
export async function generateHarvestJournal(
  reportId: string,
  userId: string
): Promise<void> {
  const report = await prisma.harvestReport.findUniqueOrThrow({
    where: { id: reportId },
    include: { cycle: true },
  });

  if (!report.hppPerUnit || report.status !== "APPROVED") {
    throw new Error("Report belum diapprove atau HPP belum ditetapkan.");
  }

  const totalHpp =
    Number(report.hppPerUnit) * Number(report.harvestQuantity);

  // Look up required accounts by code (must exist in COA)
  const [persediaanAcc, wipAcc] = await Promise.all([
    prisma.account.findFirst({ where: { code: "1-1300" } }), // Persediaan Barang Jadi
    prisma.account.findFirst({ where: { code: "1-1200" } }), // Barang Dalam Proses
  ]);

  if (!persediaanAcc || !wipAcc) {
    throw new Error(
      "Akun COA 1-1300 (Persediaan) atau 1-1200 (WIP) tidak ditemukan. Pastikan COA sudah dibuat."
    );
  }

  const transaction = await createDoubleEntryTransaction(userId, {
    date: new Date().toISOString(),
    description: `Panen Batch ${report.cycle.batchCode} — ${report.harvestQuantity} ${report.harvestUnit}`,
    reference: `HARVEST-${reportId.slice(0, 8).toUpperCase()}`,
    lines: [
      { accountId: persediaanAcc.id, debit: totalHpp, credit: 0 },
      { accountId: wipAcc.id, debit: 0, credit: totalHpp },
    ],
  });

  // Link the generated journal back to the harvest report
  await prisma.harvestReport.update({
    where: { id: reportId },
    data: { journalTransactionId: transaction.id },
  });
}

/**
 * Generates journal entries when a Sales Order is marked as PAID.
 * Journal entry:
 *   DEBIT  → Kas / Piutang (Aset bertambah)
 *   CREDIT → Pendapatan Penjualan (Pendapatan bertambah)
 *
 * @param orderId - The Sales Order ID
 * @param userId - Admin user who recorded the payment
 */
export async function generateSalesJournal(
  orderId: string,
  userId: string
): Promise<void> {
  const order = await prisma.salesOrder.findUniqueOrThrow({
    where: { id: orderId },
    include: { customer: true },
  });

  const [kasAcc, pendapatanAcc] = await Promise.all([
    prisma.account.findFirst({ where: { code: "1-1000" } }), // Kas
    prisma.account.findFirst({ where: { code: "4-1000" } }), // Pendapatan Penjualan
  ]);

  if (!kasAcc || !pendapatanAcc) {
    throw new Error(
      "Akun COA 1-1000 (Kas) atau 4-1000 (Pendapatan) tidak ditemukan."
    );
  }

  const totalAmount = Number(order.totalAmount);

  const transaction = await createDoubleEntryTransaction(userId, {
    date: new Date().toISOString(),
    description: `Pembayaran Sales Order ${order.orderNumber} — ${order.customer?.name ?? "Umum"}`,
    reference: `SO-${order.orderNumber}`,
    lines: [
      { accountId: kasAcc.id, debit: totalAmount, credit: 0 },
      { accountId: pendapatanAcc.id, debit: 0, credit: totalAmount },
    ],
  });

  await prisma.salesOrder.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      paidAmount: totalAmount,
      transactionId: transaction.id,
    },
  });
}
