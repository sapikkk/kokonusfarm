"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ArrowRight, Save, Receipt } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  unit: string
  currentStock: string | number
  unitPrice: string | number
}

interface GoodsReceiptDialogProps {
  item: InventoryItem
}

export function GoodsReceiptDialog({ item }: GoodsReceiptDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [buyQuantity, setBuyQuantity] = useState("1")
  const [totalPrice, setTotalPrice] = useState("")
  const [multiplier, setMultiplier] = useState("1")

  const parsedQty = parseFloat(buyQuantity || "0")
  const parsedPrice = parseFloat(totalPrice || "0")
  const parsedMultiplier = parseFloat(multiplier || "1")

  const baseQtyIn = parsedQty * parsedMultiplier
  const estimatedUnitPrice = baseQtyIn > 0 ? (parsedPrice / baseQtyIn) : 0

  const handleSave = async () => {
    if (parsedQty <= 0 || parsedPrice <= 0 || parsedMultiplier <= 0) {
      setError("Semua field angka wajib diisi lebih dari 0")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/inventory/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          buyQuantity: parsedQty,
          totalPrice: parsedPrice,
          conversionMultiplier: parsedMultiplier
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal menyimpan barang masuk")
      }

      setOpen(false)
      setBuyQuantity("1")
      setTotalPrice("")
      setMultiplier("1")
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
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-[11px]">
          <Plus className="h-3.5 w-3.5" />
          Restock / Beli
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#9FE870]" />
            Catat Pembelian {item.name}
          </DialogTitle>
          <DialogDescription>
            Masukkan nominal pembelian dan pecahan konversi ke <b>{item.unit}</b>.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm rounded-lg bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Box 1: Pembelian Mentah */}
          <div className="space-y-3 rounded-lg p-3 bg-muted/50 border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data Pembelian (Nota)</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Jumlah Beli (Bal/Pack)</Label>
                <Input 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  value={buyQuantity}
                  onChange={e => { setBuyQuantity(e.target.value); setError(null) }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Harga Total (Rp)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Misal: 800000"
                  value={totalPrice}
                  onChange={e => { setTotalPrice(e.target.value); setError(null) }}
                />
              </div>
            </div>
          </div>

          {/* Box 2: Konversi ke Base Unit */}
          <div className="space-y-3 rounded-lg p-3" style={{ background: 'rgba(159,232,112,0.08)', border: '1px solid rgba(159,232,112,0.2)' }}>
             <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#2a7015' }}>Data Konversi ke Base Unit ({item.unit})</h4>
             
             <div className="space-y-1.5">
                <Label className="text-xs">Pecah Konversi (1 Bal/Pack = ... {item.unit})</Label>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Misal: 7200"
                  value={multiplier}
                  onChange={e => { setMultiplier(e.target.value); setError(null) }}
                />
             </div>

             {baseQtyIn > 0 && totalPrice !== "" && (
               <>
                 <Separator className="my-2 bg-[#9FE870]/30" />
                 <div className="space-y-1 text-sm">
                   <div className="flex justify-between items-center text-muted-foreground">
                      <span>Total Stok yang akan di-Input:</span>
                      <span className="font-semibold text-foreground">{baseQtyIn.toLocaleString('id-ID')} {item.unit}</span>
                   </div>
                   <div className="flex justify-between items-center text-muted-foreground">
                      <span>Estimasi Netto Rata-Rata (HPP Gudang):</span>
                      <span className="font-bold" style={{ color: '#2a7015' }}>Rp {Math.ceil(estimatedUnitPrice).toLocaleString('id-ID')} / {item.unit}</span>
                   </div>
                   <p className="text-[10px] italic text-muted-foreground mt-1">Sistem akan secara otomatis meleburnya (Moving Average) dengan stok lama jika masih ada sisa.</p>
                 </div>
               </>
             )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Batal</Button>
          <Button className="gap-2" onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Pembelian"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
