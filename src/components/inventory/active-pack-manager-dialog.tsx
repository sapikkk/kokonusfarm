"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PackageOpen, XCircle, CheckCircle, Loader2, Leaf, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ActivePack {
  id: string
  itemId: string
  itemName: string
  itemCode: string
  category: string
  packPrice: number
  openedAt: string
  usedUnits: number
  batchCount: number
}

interface ActivePackManagerDialogProps {
  itemId: string
  itemName: string
  currentStock: number
  category?: string
}

export function ActivePackManagerDialog({ itemId, itemName, currentStock, category = "BENIH" }: ActivePackManagerDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activePacks, setActivePacks] = useState<ActivePack[]>([])

  const fetchPacks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/active-packs")
      const data = await res.json()
      // Filter hanya pack untuk item ini
      setActivePacks(data.filter((p: ActivePack) => p.itemId === itemId))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [itemId])

  useEffect(() => {
    if (open) {
      fetchPacks()
    }
  }, [open, fetchPacks])

  async function handleOpenPack() {
    if (currentStock < 1) return alert("Stok di gudang habis!")
    
    setLoading(true)
    try {
      const res = await fetch("/api/active-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) throw new Error("Gagal buka pack")
      
      await fetchPacks()
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDepletePack(packId: string, usedUnits: number) {
    if (usedUnits === 0) {
      const ok = confirm("Pack ini belum pernah dipakai untuk batch semai manapun. Yakin ingin menutupnya? (Cost per satuan = Rp 0)")
      if (!ok) return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/active-packs/${packId}`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error("Gagal menyelesaikan pack")
      
      await fetchPacks()
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
          <PackageOpen className="w-3.5 h-3.5" /> Lifecycle Pack
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#9FE870]/20">
              <Leaf className="h-4 w-4 text-[#2a7015]" />
            </div>
            <div>
              <DialogTitle className="text-base">Lifecycle Pack {category === "BENIH" ? "Benih" : "Media"}</DialogTitle>
              <DialogDescription className="text-xs">
                {itemName} (Stok Gudang: {currentStock} pack)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="rounded-xl p-4 text-[13px] space-y-2" style={{ background: "rgba(159,232,112,0.06)", border: "1px solid rgba(159,232,112,0.15)" }}>
            <p className="font-semibold flex items-center gap-1.5">
               <AlertCircle className="w-4 h-4 text-[#2a7015]" /> Cara Kerja
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
              <li>Klik <strong>Buka Pack Baru</strong> (mengurangi stok gudang 1 pack).</li>
              <li>Pilih pack yang terbuka saat membuat <strong>Batch Semai</strong> baru.</li>
              <li>Setelah fisik barang habis, klik <strong>Nyatakan Habis</strong>.</li>
              <li>Sistem otomatis menghitung harga satuan dan menyuntikkannya ke HPP batch!</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Pack Sedang Dibuka</h4>
              <Button size="sm" onClick={handleOpenPack} disabled={loading || currentStock < 1} className="h-7 text-xs bg-[#2a7015] hover:bg-[#1e500f] text-white">
                {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <PackageOpen className="w-3 h-3 mr-1" />}
                Buka Pack Baru
              </Button>
            </div>

            {activePacks.length === 0 ? (
              <div className="p-4 text-center border border-dashed rounded-lg text-sm text-muted-foreground">
                Belum ada pack yang sedang dibuka.
              </div>
            ) : (
              <div className="space-y-2">
                {activePacks.map(pack => (
                  <div key={pack.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Dibuka: {new Date(pack.openedAt).toLocaleDateString("id-ID")}</p>
                      <p className="text-sm font-medium">Rp {pack.packPrice.toLocaleString('id-ID')}</p>
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">
                        Dipakai di {pack.batchCount} batch ({pack.usedUnits} satuan)
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDepletePack(pack.id, pack.usedUnits)}
                      disabled={loading}
                      className="h-8 text-xs shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Nyatakan Habis
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
