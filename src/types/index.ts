/**
 * @file src/types/index.ts
 * @description Central TypeScript type definitions for Kebun Hijau.
 * All types are derived from the Prisma schema to ensure consistency.
 */

import type {
  UserRole,
  AccountType,
  TransactionStatus,
  PlantPhase,
  ProductionAction,
  InventoryMovement,
  ActivePackStatus,
  HarvestReportStatus,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
  InstallationType,
} from "@prisma/client";

// ─────────────────────────────────────────────
// RE-EXPORT PRISMA ENUMS for convenience
// ─────────────────────────────────────────────
export type {
  UserRole,
  AccountType,
  TransactionStatus,
  PlantPhase,
  ProductionAction,
  InventoryMovement,
  ActivePackStatus,
  HarvestReportStatus,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
  InstallationType,
};

// ─────────────────────────────────────────────
// AUTH & SESSION
// ─────────────────────────────────────────────
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

// ─────────────────────────────────────────────
// ACCOUNTING
// ─────────────────────────────────────────────
export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  description?: string | null;
  isActive: boolean;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalLine {
  id: string;
  transactionId: string;
  accountId: string;
  account?: Account;
  debit: number;
  credit: number;
  notes?: string | null;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  reference?: string | null;
  status: TransactionStatus;
  userId: string;
  journalLines?: JournalLine[];
  createdAt: Date;
  updatedAt: Date;
}

/** Payload for creating a new double-entry transaction */
export interface CreateTransactionPayload {
  date: string;
  description: string;
  reference?: string;
  lines: {
    accountId: string;
    debit: number;
    credit: number;
    notes?: string;
  }[];
}

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLog {
  id: string;
  itemId: string;
  item?: Pick<InventoryItem, "id" | "name" | "code" | "unit">;
  movement: InventoryMovement;
  quantity: number;
  reference?: string | null;
  notes?: string | null;
  userId: string;
  createdAt: Date;
}

export interface ActivePack {
  id: string;
  itemId: string;
  item?: Pick<InventoryItem, "id" | "name" | "unit">;
  status: ActivePackStatus;
  openedQty?: number | null;
  currentQty?: number | null;
  openedAt: Date;
  depletedAt?: Date | null;
  packPrice: number;
  estimatedYield?: number | null;
  costPerUnit?: number | null;
  notes?: string | null;
}

// ─────────────────────────────────────────────
// INFRASTRUCTURE
// ─────────────────────────────────────────────
export interface Greenhouse {
  id: string;
  code: string;
  name: string;
  location?: string | null;
  area?: number | null;
  isActive: boolean;
  fixedCostElectricity: number;
  electricityNotes?: string | null;
  installations?: Installation[];
}

export interface Installation {
  id: string;
  code: string;
  name: string;
  type: InstallationType;
  totalSlots?: number | null;
  isActive: boolean;
  greenhouseId: string;
  greenhouse?: Pick<Greenhouse, "id" | "name" | "code">;
  fixedCostNutrient: number;
  nutrientNotes?: string | null;
}

// ─────────────────────────────────────────────
// PRODUCTION
// ─────────────────────────────────────────────
export interface ProductionCycle {
  id: string;
  batchCode: string;
  plantType: string;
  phase: PlantPhase;
  initialQuantity: number;
  currentQuantity: number;
  rejectedCount: number;
  startDate: Date;
  harvestDate?: Date | null;
  notes?: string | null;
  installationId?: string | null;
  installation?: Pick<Installation, "id" | "name" | "code"> | null;
  activeSeedPackId?: string | null;
  activeMediaPackId?: string | null;
  fixedCostSeed: number;
  fixedCostMedia: number;
}

export interface HarvestReport {
  id: string;
  cycleId: string;
  cycle?: Pick<ProductionCycle, "id" | "batchCode" | "plantType">;
  harvestQuantity: number;
  harvestUnit: string;
  workerNotes?: string | null;
  status: HarvestReportStatus;
  hppPerUnit?: number | null;
  hppNotes?: string | null;
  costSeed?: number | null;
  costMedia?: number | null;
  costNutrient?: number | null;
  costElectricity?: number | null;
  costLabor?: number | null;
  costOther?: number | null;
  submittedById: string;
  reviewedById?: string | null;
  reviewedAt?: Date | null;
  journalTransactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// SALES & DELIVERY
// ─────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesOrderItem {
  id: string;
  orderId: string;
  inventoryItemId: string;
  inventoryItem?: Pick<InventoryItem, "id" | "name" | "unit">;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  packagingItemId?: string | null;
  packagingQty?: number | null;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customer?: Pick<Customer, "id" | "name" | "phone"> | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  costPackaging: number;
  costDelivery: number;
  shippingAddress?: string | null;
  notes?: string | null;
  transactionId?: string | null;
  items?: SalesOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// API RESPONSE WRAPPERS
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
