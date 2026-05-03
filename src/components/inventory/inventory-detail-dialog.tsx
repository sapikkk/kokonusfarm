"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { formatNumber } from "@/lib/utils"
import { Package, Search, Info } from "lucide-react"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ArrowDownToLine, ArrowUpFromLine, RefreshCcw, Clock } from "lucide-react"

interface InventoryLog {
  id: string
  movement: "IN" | "OUT" | "ADJUST"
  quantity: any
  notes?: string | null
  createdAt: string | Date
  user: { name: string }
}

interface InventoryItem {
  id: string
  code: string
  name: string
  category: string
  unit: string
  currentStock: any
  minStock: any
  description?: string | null
  inventoryLogs?: InventoryLog[]
}

interface InventoryDetailDialogProps {
  item: InventoryItem
}

export function InventoryDetailDialog({ item }: InventoryDetailDialogProps) {
  const [open, setOpen] = useState(false)

  const current = parseFloat(item.currentStock.toString())
  const isRockwool = item.name.toLowerCase().includes("rockwool")

  // Rockwool Calculation Logic
  const fullSlabs = Math.floor(current)
  const remainderRatio = current - fullSlabs
  const percentage = Math.round(remainderRatio * 100 * 10) / 10

  const remainingKeping = Math.round(remainderRatio * 40)
  const remainingDadu = remainingKeping * 18

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 dark:bg-slate-950">
          <Search className="mr-1 h-3 w-3" />
          Detail
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-[480px] overflow-y-auto w-full">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>{item.name}</SheetTitle>
            <Badge variant="secondary">{item.code}</Badge>
          </div>
          <SheetDescription>
            Rincian stok untuk item inventaris ini.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-botanical-600" />
              <h3 className="font-semibold">Stok Utama</h3>
            </div>
            <div className="text-4xl font-bold mt-2">
              {formatNumber(current)} <span className="text-lg font-normal text-muted-foreground">{item.unit !== "slab" && isRockwool ? "slab" : item.unit}</span>
            </div>
          </div>

          {isRockwool && (
            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 overflow-hidden">
              <div className="bg-blue-100 dark:bg-blue-900/40 px-4 py-2 flex items-center justify-between">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center text-sm">
                  <Info className="h-4 w-4 mr-1" />
                  Informasi Kapasitas Rockwool
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-200">Slab Utuh (Panjang 100cm)</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                    {fullSlabs} <span className="text-sm font-normal">slab</span>
                  </div>
                </div>

                {percentage > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-800">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-200">Sisa Slab Terbuka</p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        {remainingKeping} keping x 18 dadu
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                        {percentage}%
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        ({remainingDadu} dadu)
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white/60 dark:bg-black/20 rounded p-3 text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-2 flex items-center gap-1">
                    Panduan Potongan:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li><strong>1 Slab</strong> mutlak berukuran 100 cm.</li>
                    <li><strong>1 Keping</strong> dipotong selebar 2,5 cm (Bisa dapat 40 Keping per Slab).</li>
                    <li><strong>1 Keping</strong> (3x6) mendapat <strong>18 Dadu</strong> semai (2,5x2,5x2,5 cm).</li>
                    <li>Satu kali memotong keping (18 dadu) akan mengurangi persentase stok sebesar <strong>2,5%</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Riwayat Mutasi Terakhir
            </h3>

            <div className="space-y-3">
              {!item.inventoryLogs || item.inventoryLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Belum ada riwayat tercatat</p>
              ) : (
                item.inventoryLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-sm p-3 border rounded-lg bg-card tranadminon-all">
                    <div
                      className="mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: log.movement === "IN" ? 'rgba(159,232,112,0.2)' :
                          log.movement === "OUT" ? 'rgba(255,95,95,0.15)' : 'rgba(123,123,123,0.12)',
                        color: log.movement === "IN" ? '#2a7015' :
                          log.movement === "OUT" ? '#FF5F5F' : '#7B7B7B'
                      }}
                    >
                      {log.movement === "IN" ? <ArrowDownToLine className="h-4 w-4" /> :
                        log.movement === "OUT" ? <ArrowUpFromLine className="h-4 w-4" /> :
                          <RefreshCcw className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">
                          {log.movement === "IN" ? "Barang Masuk" :
                            log.movement === "OUT" ? "Barang Keluar" :
                              "Koreksi (Opname)"}
                        </p>
                        <span
                          className="font-bold"
                          style={{ color: log.movement === "IN" ? '#9FE870' : log.movement === "OUT" ? '#FF5F5F' : '#7B7B7B' }}
                        >
                          {log.movement === "IN" ? "+" : log.movement === "OUT" ? "-" : ""}{parseFloat(log.quantity.toString())}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: localeId })} • Oleh {log.user.name}
                      </p>
                      {log.notes && (
                        <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          &ldquo;{log.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kategori</p>
              <p>{item.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Batas Minimum (Peringatan)</p>
              <p>{formatNumber(parseFloat(item.minStock.toString()))} {item.unit}</p>
            </div>
            {item.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Keterangan Tambahan</p>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
