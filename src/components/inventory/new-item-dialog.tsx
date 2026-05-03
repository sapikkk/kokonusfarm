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
import { Plus, Loader2 } from "lucide-react"

export function NewItemDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "NUTRISI",
    unit: "",
    currentStock: "0",
    minStock: "0",
    unitPrice: "0",
    description: "",
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Gagal menambahkan item")
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="botanical">
          <Plus className="mr-2 h-4 w-4" />
          Katalog Baru / Barang Masuk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail barang inventaris baru ke dalam sistem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Item</Label>
              <Input
                id="code"
                placeholder="Ex: MED-002"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUTRISI">Nutrisi</SelectItem>
                  <SelectItem value="MEDIA">Media Tanam</SelectItem>
                  <SelectItem value="BENIH">Benih</SelectItem>
                  <SelectItem value="KEMASAN">Kemasan</SelectItem>
                  <SelectItem value="ALAT">Alat</SelectItem>
                  <SelectItem value="LAINNYA">Lain-lain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Item</Label>
            <Input
              id="name"
              placeholder="Ex: Rockwool Cultilene"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                placeholder="kg, pack, slab"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Harga Satuan (Rp)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                required
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Stok Awal</Label>
              <Input
                id="currentStock"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Batas Minimum</Label>
              <Input
                id="minStock"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Catatan (Boleh Kosong)</Label>
            <Textarea
              id="description"
              placeholder="Informasi tambahan terkait item ini..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-botanical-600 hover:bg-botanical-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
