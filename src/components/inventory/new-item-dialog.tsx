"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { Plus, Loader2, Sparkles, Check, AlertCircle } from "lucide-react"

interface CategoryOption {
  id: string
  name: string
  code: string
}

export function NewItemDialog() {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Custom Category Mode states
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categorySubmitLoading, setCategorySubmitLoading] = useState(false)
  const [categoryStatusMsg, setCategoryStatusMsg] = useState<{
    text: string
    type: "success" | "info" | "error"
  } | null>(null)

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

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)
    try {
      const res = await fetch("/api/inventory/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
        // Set default category if available and not set
        if (data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0].code }))
        }
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error)
    } finally {
      setCategoriesLoading(false)
    }
  }, [formData.category])

  useEffect(() => {
    if (open) {
      loadCategories()
      setShowAddCategory(false)
      setNewCategoryName("")
      setCategoryStatusMsg(null)
    }
  }, [open, loadCategories])

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return

    setCategorySubmitLoading(true)
    setCategoryStatusMsg(null)
    try {
      const res = await fetch("/api/inventory/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName })
      })

      const data = await res.json()
      if (res.ok) {
        if (data.approved) {
          setCategoryStatusMsg({
            text: `Kategori "${newCategoryName}" berhasil ditambahkan!`,
            type: "success"
          })
          // Reload categories and select the newly created one
          const customCode = newCategoryName.trim().toUpperCase().replace(/\s+/g, "_")
          setFormData(prev => ({ ...prev, category: customCode }))
          await loadCategories()
          setNewCategoryName("")
          setShowAddCategory(false)
        } else {
          setCategoryStatusMsg({
            text: "Pengajuan kategori berhasil dikirim & menunggu persetujuan Owner/Admin.",
            type: "info"
          })
          setNewCategoryName("")
          setShowAddCategory(false)
        }
      } else {
        setCategoryStatusMsg({
          text: data.error || "Gagal memproses kategori kustom",
          type: "error"
        })
      }
    } catch (error) {
      console.error(error)
      setCategoryStatusMsg({
        text: "Terjadi kesalahan koneksi",
        type: "error"
      })
    } finally {
      setCategorySubmitLoading(false)
    }
  }

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

  const userRole = session?.user?.role || "PEKERJA"

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
              {categoriesLoading ? (
                <div className="h-10 rounded-md border border-input bg-background px-3 py-2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Memuat...</span>
                </div>
              ) : (
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id || cat.code} value={cat.code}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Custom Category Section */}
          <div className="border-t border-b py-3 my-2 border-slate-100 dark:border-slate-800 space-y-2">
            {!showAddCategory ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs flex items-center justify-center gap-1.5 text-botanical-600 dark:text-botanical-400 hover:text-botanical-700 dark:hover:text-botanical-300"
                onClick={() => setShowAddCategory(true)}
              >
                <Sparkles className="h-3 w.5-3.5" />
                {userRole === "OWNER" || userRole === "ADMIN" 
                  ? "+ Tambah Kategori Kustom Baru" 
                  : "+ Ajukan Kategori Kustom Baru"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Nama Kategori Baru</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Pupuk Organik"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 bg-botanical-600 hover:bg-botanical-700"
                    disabled={categorySubmitLoading}
                    onClick={handleAddCategory}
                  >
                    {categorySubmitLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Kirim"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {categoryStatusMsg && (
              <div className={`text-xs p-2 rounded flex items-start gap-1.5 ${
                categoryStatusMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-200" 
                  : categoryStatusMsg.type === "info"
                  ? "bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300 border border-blue-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300 border border-red-200"
              }`}>
                {categoryStatusMsg.type === "success" ? (
                  <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                )}
                <span>{categoryStatusMsg.text}</span>
              </div>
            )}
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
