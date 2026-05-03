"use client"

import { useState, useEffect } from "react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPhaseColor, getPhaseLabel, formatDate } from "@/lib/utils"
import { AlertCircle, Sprout, TrendingDown, TrendingUp, Calendar, User } from "lucide-react"

interface DetailBatchDialogProps {
  cycleId: string
  batchCode: string
}

export function DetailBatchDialog({ cycleId, batchCode }: DetailBatchDialogProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    if (data) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/production/${cycleId}`)
        if (!res.ok) throw new Error("Gagal mengambil data")
        const result = await res.json()
        if (!cancelled) setData(result)
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const renderContent = () => {
    if (loading || !data) {
      return <div className="py-12 text-center text-muted-foreground">Memuat data...</div>
    }

    const { initialQuantity, currentQuantity, rejectedCount, phase, productionLogs, plantType } = data
    
    // Calculate yields
    const currentYield = ((currentQuantity / initialQuantity) * 100).toFixed(1)
    const lossValue = initialQuantity - currentQuantity // or rejectedCount

    // Separate Harvest info
    const harvestLog = productionLogs.find((log: any) => log.action === "HARVEST")
    const isHarvested = phase === "PANEN"

    return (
      <div className="space-y-6">
        {/* Yield Efficiency Analysis */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Analisis Efisiensi Produksi</h3>
            <Badge className={getPhaseColor(phase)}>{getPhaseLabel(phase)}</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-1 rounded-md bg-green-50 dark:bg-green-950/20 p-3">
              <span className="text-xs text-muted-foreground">Target Awal</span>
              <div className="text-2xl font-bold">{initialQuantity}</div>
            </div>
            <div className="space-y-1 rounded-md p-3" style={{ background: 'rgba(255,95,95,0.07)' }}>
              <span className="text-xs text-muted-foreground">Unit Hilang (Reject)</span>
              <div className="text-2xl font-bold flex items-center" style={{ color: '#FF5F5F' }}>
                <TrendingDown className="mr-1 h-4 w-4" />
                {rejectedCount}
              </div>
            </div>
            <div className="space-y-1 rounded-md bg-botanical-50 dark:bg-botanical-950/20 p-3">
              <span className="text-xs text-muted-foreground">Hasil Akhir / Sisa</span>
              <div className="text-2xl font-bold flex items-center text-botanical-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                {isHarvested ? harvestLog?.quantity || currentQuantity : currentQuantity}
              </div>
            </div>
          </div>

          <div className="rounded-md bg-accent/50 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Tingkat Keberhasilan</p>
              <p className="text-xs text-muted-foreground">
                (Sisa Baik / Target Awal)
              </p>
            </div>
            <div className="text-3xl font-bold text-botanical-700 dark:text-botanical-400">
              {currentYield}%
            </div>
          </div>
        </div>

        {/* Timeline Log Activities */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Timeline Produksi</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Tanggal</TableHead>
                  <TableHead>Tindakan</TableHead>
                  <TableHead>Perubahan</TableHead>
                  <TableHead>Catatan / Petugas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionLogs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">
                      {formatDate(log.createdAt, "dd MMM yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {log.action === "NOTE" && <Badge variant="outline">Catatan</Badge>}
                      {log.action === "PHASE_CHANGE" && <Badge className="bg-blue-500">Pindah Fase</Badge>}
                      {log.action === "REJECT" && <Badge variant="destructive">Reject / Wafat</Badge>}
                      {log.action === "HARVEST" && <Badge className="bg-botanical-500">Panen</Badge>}
                      {log.action === "QUANTITY_UPDATE" && <Badge variant="outline">Koreksi Data</Badge>}
                      {!log.action && <Badge variant="outline">Log</Badge>}
                    </TableCell>
                    <TableCell>
                      {log.action === "PHASE_CHANGE" && (
                        <span className="text-xs">
                          {getPhaseLabel(log.fromPhase)} → <strong className="text-blue-600">{getPhaseLabel(log.toPhase)}</strong>
                        </span>
                      )}
                      {log.action === "REJECT" && (
                          <span className="text-xs font-medium" style={{ color: '#FF5F5F' }}>-{log.quantity} unit</span>
                      )}
                      {log.action === "HARVEST" && (
                        <span className="text-xs text-botanical-600 font-medium">{log.quantity} unit layak jual</span>
                      )}
                      {log.action === "QUANTITY_UPDATE" && (
                        <span className="text-xs text-muted-foreground">Menjadi {log.quantity} unit</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{log.notes || "-"}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center">
                        <User className="mr-1 h-3 w-3" /> {log.user?.name}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Entry for Batch Creation */}
                <TableRow>
                  <TableCell className="text-xs">{formatDate(data.startDate, "dd MMM yyyy HH:mm")}</TableCell>
                  <TableCell><Badge className="bg-green-600">Awal Semai</Badge></TableCell>
                  <TableCell>
                    <span className="text-xs text-green-600 font-medium">+{initialQuantity} unit</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-[10px] text-muted-foreground">Sistem (Pembuatan Batch Baru)</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 dark:bg-slate-950 border-botanical-200">
          <AlertCircle className="mr-1 h-3 w-3 text-botanical-600" />
          Detail Analisis Efisiensi
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-[700px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Detail Analisis Batch: {batchCode}</SheetTitle>
          <SheetDescription>
            Rincian data mortalitas, perubahan fase, dan hasil akhir panen.
          </SheetDescription>
        </SheetHeader>
        
        {renderContent()}

      </SheetContent>
    </Sheet>
  )
}
