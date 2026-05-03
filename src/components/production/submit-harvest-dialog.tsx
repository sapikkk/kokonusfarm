"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, Leaf } from "lucide-react"

interface SubmitHarvestDialogProps {
  cycleId: string
  batchCode: string
  plantType: string
}

export function SubmitHarvestDialog({ cycleId, batchCode, plantType }: SubmitHarvestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [harvestQuantity, setHarvestQuantity] = useState("")
  const [harvestUnit, setHarvestUnit] = useState("kg")
  const [workerNotes, setWorkerNotes] = useState("")
  const [validationError, setValidationError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (!harvestQuantity || parseFloat(harvestQuantity) <= 0) {
      setValidationError("Jumlah panen wajib diisi dan lebih dari 0")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/harvest-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycleId,
          harvestQuantity: parseFloat(harvestQuantity),
          harvestUnit,
          workerNotes: workerNotes || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Gagal mengirim laporan")
      }
      // Reset
      setHarvestQuantity("")
      setHarvestUnit("kg")
      setWorkerNotes("")
      setOpen(false)
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Send className="h-3.5 w-3.5" />
          Kirim Laporan Panen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#9FE870]/20">
              <Leaf className="h-4 w-4 text-[#2a7015]" />
            </div>
            <div>
              <DialogTitle className="text-base">Laporan Hasil Panen</DialogTitle>
              <DialogDescription className="text-xs">
                {batchCode} · {plantType}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 text-sm rounded-lg" style={{ background: 'rgba(255,95,95,0.1)', color: '#FF5F5F' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="harvestQuantity">Jumlah Panen *</Label>
              <Input
                id="harvestQuantity"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0"
                value={harvestQuantity}
                onChange={(e) => {
                  setHarvestQuantity(e.target.value)
                  setValidationError("")
                }}
              />
              {validationError && (
                <p className="text-xs" style={{ color: '#FF5F5F' }}>{validationError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="harvestUnit">Satuan *</Label>
              <Select value={harvestUnit} onValueChange={setHarvestUnit}>
                <SelectTrigger id="harvestUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="pack">pack</SelectItem>
                  <SelectItem value="ikat">ikat</SelectItem>
                  <SelectItem value="gram">gram</SelectItem>
                  <SelectItem value="batang">batang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workerNotes">Catatan (opsional)</Label>
            <Textarea
              id="workerNotes"
              placeholder="Kondisi panen, kualitas hasil, catatan penting..."
              rows={3}
              value={workerNotes}
              onChange={(e) => setWorkerNotes(e.target.value)}
            />
          </div>

          <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'rgba(159,232,112,0.08)', border: '1px solid rgba(159,232,112,0.2)' }}>
            <p className="font-semibold" style={{ color: '#2a7015' }}>Setelah laporan dikirim:</p>
            <p className="text-muted-foreground">Admin akan mereview dan menetapkan HPP (Harga Pokok Produksi) untuk keperluan rekap keuangan.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Send className="h-3.5 w-3.5" />
              {loading ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
