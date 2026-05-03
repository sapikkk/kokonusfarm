"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPhaseLabel } from "@/lib/utils"

interface UpdateBatchDialogProps {
  cycleId: string
  currentPhase: string
  currentQuantity: number
  batchCode: string
}

export function UpdateBatchDialog({ cycleId, currentPhase, currentQuantity, batchCode }: UpdateBatchDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<string>("PHASE_CHANGE")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    // Base payload
    const payload: any = {
      action: actionType,
      notes: formData.get("notes"),
    }

    if (actionType === "PHASE_CHANGE") {
      payload.phase = formData.get("phase")
    } else if (actionType === "HARVEST" || actionType === "REJECT" || actionType === "QUANTITY_UPDATE") {
      payload.quantity = parseInt(formData.get("quantity") as string)
      if (actionType === "REJECT") {
        payload.sulamQuantity = parseInt(formData.get("sulamQuantity") as string || "0")
      }
      if (actionType === "HARVEST") {
        payload.rejectQuantity = parseInt(formData.get("rejectQuantity") as string || "0")
      }
    }

    try {
      const response = await fetch(`/api/production/${cycleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update batch")
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan saat menyimpan update.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Batch: {batchCode}</DialogTitle>
          <DialogDescription>
            Saat ini berada di fase {getPhaseLabel(currentPhase)} dengan {currentQuantity} tanaman hidup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            
            <div className="grid gap-2">
              <Label htmlFor="actionType">Tindakan Update</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tindakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHASE_CHANGE">Ubah Fase Tanam</SelectItem>
                  <SelectItem value="REJECT">Catat Tanaman Mati / Gagal</SelectItem>
                  <SelectItem value="HARVEST">Catat Panen</SelectItem>
                  <SelectItem value="QUANTITY_UPDATE">Koreksi Jumlah Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {actionType === "PHASE_CHANGE" && (
              <div className="grid gap-2">
                <Label htmlFor="phase">Fase Berikutnya</Label>
                <Select name="phase" defaultValue={currentPhase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMAI">Semai</SelectItem>
                    <SelectItem value="BIBIT">Bibit</SelectItem>
                    <SelectItem value="TANAM">Tanam (Pembesaran)</SelectItem>
                    <SelectItem value="PANEN">Panen Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(actionType === "HARVEST" || actionType === "REJECT" || actionType === "QUANTITY_UPDATE") && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">
                    {actionType === "HARVEST" ? "Jumlah Dipanen" : 
                     actionType === "REJECT" ? "Jumlah Tanaman Mati (Gugur)" : "Total Jumlah Baru"}
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={actionType === "QUANTITY_UPDATE" ? undefined : currentQuantity}
                    placeholder={`Maksimal ${currentQuantity}`}
                    required
                  />
                </div>

                {actionType === "REJECT" && (
                  <div className="grid gap-2 border-t pt-4">
                    <Label htmlFor="sulamQuantity" className="text-blue-600 dark:text-blue-400">
                      Jumlah Disulam (Ditanam Ulang)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Berapa dari tanaman mati tersebut yang akan segera diganti bibit baru? (Akan otomatis membuat antrian Batch Semai baru).
                    </p>
                    <Input
                      id="sulamQuantity"
                      name="sulamQuantity"
                      type="number"
                      min="0"
                      defaultValue="0"
                      placeholder="Misal: 10"
                    />
                  </div>
                )}

                {actionType === "HARVEST" && (
                  <div className="grid gap-2 border-t pt-4">
                    <Label htmlFor="rejectQuantity" className="text-red-600 dark:text-red-400">
                      Jumlah Afkir (Tidak Layak Jual)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Berapa banyak dari total panen yang cacat / tidak memenuhi standar pasar? (Akan dihitung sebagai reject).
                    </p>
                    <Input
                      id="rejectQuantity"
                      name="rejectQuantity"
                      type="number"
                      min="0"
                      defaultValue="0"
                      placeholder="Misal: 5"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Misal: Pindah rak, daun agak kuning, dll."
              />
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="botanical" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
