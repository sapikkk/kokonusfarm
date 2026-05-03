"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Loader2, ArrowDownToLine, ArrowUpFromLine, RefreshCcw, Trash2 } from "lucide-react"

export function UpdateItemDialog({ item }: { item: any }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Movement Form State
  const [movementForm, setMovementForm] = useState({
    movement: "IN",
    quantity: "",
    notes: "",
    reference: "",
  })

  // Edit Data State
  const [editForm, setEditForm] = useState({
    name: item.name,
    minStock: item.minStock,
    description: item.description || "",
  })

  // Rockwool helper
  const isRockwool = item.name?.toLowerCase().includes("rockwool")
  const [rockwoolUnit, setRockwoolUnit] = useState<"slab"|"keping"|"dadu"|"bal">("slab")

  async function onMovementSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let finalQty = movementForm.quantity
      if (isRockwool) {
        if (movementForm.movement === "OUT") {
          if (rockwoolUnit === "keping") finalQty = (parseFloat(finalQty) * 0.025).toString()
          else if (rockwoolUnit === "dadu") finalQty = (parseFloat(finalQty) / 720).toString()
        } else if (movementForm.movement === "IN") {
          if (rockwoolUnit === "bal") finalQty = (parseFloat(finalQty) * 16).toString()
        }
      }

      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...movementForm, quantity: finalQty }),
      })

      if (!res.ok) throw new Error("Gagal mengupdate stok")
      
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert(error)
    } finally {
      setLoading(false)
    }
  }

  async function onEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) throw new Error("Gagal menyimpan perubahan")

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm("Yakin ingin menonaktifkan item ini?")) return
    setLoading(true)

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Gagal menghapus")
      
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const effectiveOutQty = isRockwool && movementForm.movement === "OUT"
    ? (rockwoolUnit === "keping" ? parseFloat(movementForm.quantity || "0") * 0.025 
       : rockwoolUnit === "dadu" ? parseFloat(movementForm.quantity || "0") / 720 
       : parseFloat(movementForm.quantity || "0"))
    : parseFloat(movementForm.quantity || "0")

  const effectiveInQty = isRockwool && movementForm.movement === "IN"
    ? (rockwoolUnit === "bal" ? parseFloat(movementForm.quantity || "0") * 16
       : parseFloat(movementForm.quantity || "0"))
    : parseFloat(movementForm.quantity || "0")


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update {item.name}</DialogTitle>
          <DialogDescription>
            Catat pergerakan stok atau edit data barang.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stock" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stock">Mutasi Stok</TabsTrigger>
            <TabsTrigger value="edit">Edit Data</TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="space-y-4 py-4">
            <form onSubmit={onMovementSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Pergerakan</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={movementForm.movement === "IN" ? "default" : "outline"}
                    className={movementForm.movement === "IN" ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => setMovementForm({ ...movementForm, movement: "IN" })}
                  >
                    <ArrowDownToLine className="mr-1 h-4 w-4" /> Masuk
                  </Button>
                  <Button
                    type="button"
                    variant={movementForm.movement === "OUT" ? "default" : "outline"}
                    className={movementForm.movement === "OUT" ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => setMovementForm({ ...movementForm, movement: "OUT" })}
                  >
                    <ArrowUpFromLine className="mr-1 h-4 w-4" /> Keluar
                  </Button>
                  <Button
                    type="button"
                    variant={movementForm.movement === "ADJUST" ? "default" : "outline"}
                    onClick={() => setMovementForm({ ...movementForm, movement: "ADJUST" })}
                  >
                    <RefreshCcw className="mr-1 h-4 w-4" /> Opname
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="movement-qty">
                  Jumlah {movementForm.movement === "ADJUST" ? "Fisik Aktual" : ""}
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="movement-qty"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Contoh: 10"
                    required
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                  />
                  
                  {isRockwool && (movementForm.movement === "OUT" || movementForm.movement === "IN") ? (
                    <Select value={rockwoolUnit} onValueChange={(val: any) => setRockwoolUnit(val)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {movementForm.movement === "OUT" ? (
                          <>
                            <SelectItem value="slab">Slab</SelectItem>
                            <SelectItem value="keping">Keping</SelectItem>
                            <SelectItem value="dadu">Dadu</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="slab">Slab</SelectItem>
                            <SelectItem value="bal">Bal</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm font-medium w-[80px]">{item.unit !== "slab" && isRockwool ? "slab" : item.unit}</span>
                  )}
                </div>
                
                {movementForm.movement === "OUT" && (
                  <p className="text-xs text-muted-foreground mt-1 text-red-500">
                    Akan mengurangi stok menjadi {(parseFloat(item.currentStock) - effectiveOutQty).toFixed(4)} {isRockwool ? "slab" : item.unit}
                    {isRockwool && rockwoolUnit !== "slab" && ` (potongan setara ${effectiveOutQty} slab)`}
                  </p>
                )}
                {movementForm.movement === "IN" && (
                  <p className="text-xs text-muted-foreground mt-1 text-green-600">
                    Akan menambah stok menjadi {parseFloat(item.currentStock) + effectiveInQty} {isRockwool ? "slab" : item.unit}
                    {isRockwool && rockwoolUnit === "bal" && ` (tambahan setara ${effectiveInQty} slab)`}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="movement-notes">Catatan Tambahan (opsional)</Label>
                <Textarea
                  id="movement-notes"
                  placeholder="Keterangan pengeluaran / pemasukan..."
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Catat Transaksi Stok
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 py-4">
            <form onSubmit={onEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Item</Label>
                <Input
                  id="edit-name"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-minStock">Peringatan Batas Minimum ({item.unit})</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  step="0.01"
                  required
                  value={editForm.minStock}
                  onChange={(e) => setEditForm({ ...editForm, minStock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Keterangan</Label>
                <Textarea
                  id="edit-desc"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t">
                <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={loading}>
                  <Trash2 className="mr-2 h-4 w-4" /> Hapus Item
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
