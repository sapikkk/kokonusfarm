import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatter (IDR)
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Number formatter
export function formatNumber(num: number | string): string {
  const value = typeof num === 'string' ? parseFloat(num) : num
  return new Intl.NumberFormat('id-ID').format(value)
}

// Date formatter
export function formatDate(date: Date | string, formatStr: string = 'dd MMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: id })
}

// Relative time formatter
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) return formatDate(dateObj)
  if (days > 0) return `${days} hari lalu`
  if (hours > 0) return `${hours} jam lalu`
  if (minutes > 0) return `${minutes} menit lalu`
  return 'Baru saja'
}

// Percentage formatter
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Generate batch code
export function generateBatchCode(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BATCH-${year}${month}-${random}`
}

// Calculate yield efficiency
export function calculateYieldEfficiency(initial: number, current: number): number {
  if (initial === 0) return 0
  return ((current / initial) * 100)
}

// Calculate loss percentage
export function calculateLossPercentage(initial: number, rejected: number): number {
  if (initial === 0) return 0
  return ((rejected / initial) * 100)
}

// Validate transaction balance (for double-entry)
export function validateTransactionBalance(lines: Array<{ debit: number | string, credit: number | string }>): boolean {
  let totalDebit = 0
  let totalCredit = 0
  
  lines.forEach(line => {
    totalDebit += typeof line.debit === 'string' ? parseFloat(line.debit) : line.debit
    totalCredit += typeof line.credit === 'string' ? parseFloat(line.credit) : line.credit
  })
  
  // Check if debit equals credit (with tolerance for floating point)
  return Math.abs(totalDebit - totalCredit) < 0.01
}

// Get role label in Indonesian
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    OWNER: 'Pemilik',
    ADMIN: 'Admin',
    PEKERJA: 'Pekerja',
  }
  return labels[role] || role
}

// Get phase label in Indonesian
export function getPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    SEMAI: 'Semai',
    BIBIT: 'Bibit',
    TANAM: 'Tanam',
    PANEN: 'Panen',
    REJECTED: 'Ditolak',
  }
  return labels[phase] || phase
}

// Get phase color
export function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    SEMAI: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    BIBIT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    TANAM: 'bg-botanical-100 text-botanical-800 dark:bg-botanical-900 dark:text-botanical-300',
    PANEN: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[phase] || 'bg-gray-100 text-gray-800'
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Sleep function for demo/testing
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
