"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Tent, LayoutGrid, Loader2, Sprout, Beaker } from "lucide-react"
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Tipe dari API Instalasi
type InstallationOption = {
  id: string
  code: string
  name: string
  type: string
  fixedCostNutrient: number
  greenhouse: {
    id: string
    code: string
    name: string
    fixedCostElectricity: number
  }
}

// Tipe dari API Seed Pack
type ActivePackOption = {
  id: string
  itemId: string
  itemName: string
  category: string
  packPrice: number
  openedAt: string
}

// Grouping instalasi per greenhouse
type GreenhouseGroup = {
  greenhouseId: string
  greenhouseCode: string
  greenhouseName: string
  installations: InstallationOption[]
}

function groupByGreenhouse(data: InstallationOption[]): GreenhouseGroup[] {
  const map = new Map<string, GreenhouseGroup>()
  for (const inst of data) {
    const ghId = inst.greenhouse.id
    if (!map.has(ghId)) {
      map.set(ghId, {
        greenhouseId: ghId,
        greenhouseCode: inst.greenhouse.code,
        greenhouseName: inst.greenhouse.name,
        installations: [],
      })
    }
    map.get(ghId)!.installations.push(inst)
  }
  return Array.from(map.values())
}

export function NewBatchDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Instalasi dari API
  const [installations, setInstallations] = useState<InstallationOption[]>([])
  const [loadingInst, setLoadingInst] = useState(false)

  // Seed Packs dari API
  const [activePacks, setActivePacks] = useState<ActivePackOption[]>([])
  const [loadingPacks, setLoadingPacks] = useState(false)

  // Form state
  const [batchCode, setBatchCode] = useState("")
  const [plantType, setPlantType] = useState("")
  const [initialQuantity, setInitialQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [installationId, setInstallationId] = useState("")
  const [activeSeedPackId, setActiveSeedPackId] = useState("none")
  const [activeMediaPackId, setActiveMediaPackId] = useState("none")
  const [costSeed, setCostSeed] = useState("")
  const [costMedia, setCostMedia] = useState("")

  // Info instalasi yang dipilih (untuk preview cost)
  const selectedInst = installations.find((i) => i.id === installationId)

  useEffect(() => {
    if (!open) return
    setLoadingInst(true)
    fetch("/api/installations")
      .then((r) => r.json())
      .then((data) => setInstallations(Array.isArray(data) ? data : []))
      .catch(() => setInstallations([]))
      .finally(() => setLoadingInst(false))

    setLoadingPacks(true)
    fetch("/api/active-packs")
      .then((r) => r.json())
      .then((data) => setActivePacks(Array.isArray(data) ? data : []))
      .catch(() => setActivePacks([]))
      .finally(() => setLoadingPacks(false))
  }, [open])

  function handleClose(val: boolean) {
    if (!val) {
      setBatchCode(""); setPlantType(""); setInitialQuantity("")
      setNotes(""); setInstallationId(""); setCostSeed(""); setCostMedia(""); 
      setActiveSeedPackId("none"); setActiveMediaPackId("none");
    }
    setOpen(val)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchCode,
          plantType,
          initialQuantity,
          phase: "SEMAI",
          notes,
          installationId: installationId || null,
          activeSeedPackId: activeSeedPackId !== "none" ? activeSeedPackId : null,
          activeMediaPackId: activeMediaPackId !== "none" ? activeMediaPackId : null,
          fixedCostSeed: costSeed && activeSeedPackId === "none" ? parseFloat(costSeed) : 0,
          fixedCostMedia: costMedia && activeMediaPackId === "none" ? parseFloat(costMedia) : 0,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Gagal membuat batch")
      }
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert(`Terjadi kesalahan: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const grouped = groupByGreenhouse(installations)
  
  const seedPacks = activePacks.filter(p => p.category === "BENIH")
  const mediaPacks = activePacks.filter(p => p.category === "MEDIA")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="botanical">
          <Plus className="mr-2 h-4 w-4" />
          Batch Baru
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mulai Masa Semai Baru</DialogTitle>
          <DialogDescription>
            Pilih instalasi (kolam/rak) tempat batch ini akan ditanam agar
            sistem bisa menghitung HPP secara otomatis saat panen.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-1">
          {/* Kode & Jenis */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="batchCode">Kode Batch *</Label>
              <Input
                id="batchCode"
                placeholder="BATCH-2024-001"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="initialQuantity">Jumlah Bibit *</Label>
              <Input
                id="initialQuantity"
                type="number"
                min="1"
                placeholder="500"
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plantType">Jenis Tanaman *</Label>
            <Input
              id="plantType"
              placeholder="Selada Hijau, Kangkung, dll"
              value={plantType}
              onChange={(e) => setPlantType(e.target.value)}
              required
            />
          </div>

          {/* Lokasi: Greenhouse → Instalasi */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background: "rgba(159,232,112,0.05)",
              border: "1px solid rgba(159,232,112,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <Tent className="w-4 h-4 opacity-60" />
              <span className="text-[13px] font-semibold text-[--c-primary]">
                Lokasi Penanaman
              </span>
              <span className="text-[11px] text-[--c-tertiary] ml-auto">
                Opsional — tapi wajib untuk HPP otomatis
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="installationId" className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 opacity-60" />
                Instalasi (Kolam / Rak)
              </Label>

              {loadingInst ? (
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[--border-ui] text-[13px] text-[--c-tertiary]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat instalasi...
                </div>
              ) : (
                <Select value={installationId} onValueChange={setInstallationId}>
                  <SelectTrigger id="installationId">
                    <SelectValue placeholder="Pilih greenhouse → instalasi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {grouped.length === 0 ? (
                      <div className="py-4 text-center text-[13px] text-[--c-tertiary]">
                        Belum ada instalasi. Tambah di menu &quot;Instalasi Rak&quot;.
                      </div>
                    ) : (
                      grouped.map((gh) => (
                        <SelectGroup key={gh.greenhouseId}>
                          <SelectLabel className="flex items-center gap-1.5">
                            <Tent className="w-3 h-3" />
                            {gh.greenhouseCode} · {gh.greenhouseName}
                          </SelectLabel>
                          {gh.installations.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                              <span className="font-medium">{inst.code}</span>
                              {" — "}
                              {inst.name}
                              <span className="text-[--c-tertiary] ml-1">
                                ({inst.type})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Preview cost jika instalasi dipilih */}
            {selectedInst && (
              <div className="rounded-lg px-3 py-2.5 text-[12px] space-y-1" style={{ background: "rgba(0,0,0,0.04)" }}>
                <p className="font-semibold text-[--c-secondary] mb-1">Preview ABC Cost yang akan ditarik:</p>
                <div className="flex justify-between">
                  <span className="text-[--c-tertiary] flex items-center gap-1">
                    <LayoutGrid className="w-3 h-3" /> Nutrisi (dari Instalasi)
                  </span>
                  <span className="font-medium" style={{ color: "#2a7015" }}>
                    Rp {selectedInst.fixedCostNutrient.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[--c-tertiary] flex items-center gap-1">
                    <Tent className="w-3 h-3" /> Listrik (dari Greenhouse)
                  </span>
                  <span className="font-medium" style={{ color: "#c8920a" }}>
                    Rp {selectedInst.greenhouse.fixedCostElectricity.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Cost Batch: Benih & Rockwool */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 opacity-60" style={{ color: "#6366f1" }} />
              <span className="text-[13px] font-semibold text-[--c-primary]">
                Fixed Cost Batch Semai
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="activeSeedPack" className="flex items-center gap-1.5">
                  <Sprout className="w-3 h-3 opacity-60" /> Sumber Benih
                </Label>
                {loadingPacks ? (
                  <div className="h-9 px-3 flex items-center text-[12px] border rounded-md"><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Memuat...</div>
                ) : (
                  <Select value={activeSeedPackId} onValueChange={setActiveSeedPackId}>
                    <SelectTrigger id="activeSeedPack">
                      <SelectValue placeholder="Pilih sumber benih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Isi Manual (Rp)</SelectItem>
                      {seedPacks.length > 0 && (
                        <SelectGroup>
                          <SelectLabel className="bg-muted/50">Pack Sedang Dibuka</SelectLabel>
                          {seedPacks.map(pack => (
                            <SelectItem key={pack.id} value={pack.id}>
                              📦 {pack.itemName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="activeMediaPack" className="flex items-center gap-1.5">
                  <Beaker className="w-3 h-3 opacity-60" /> Sumber Media (Rockwool)
                </Label>
                {loadingPacks ? (
                  <div className="h-9 px-3 flex items-center text-[12px] border rounded-md"><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Memuat...</div>
                ) : (
                  <Select value={activeMediaPackId} onValueChange={setActiveMediaPackId}>
                    <SelectTrigger id="activeMediaPack">
                      <SelectValue placeholder="Pilih sumber media" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Isi Manual (Rp)</SelectItem>
                      {mediaPacks.length > 0 && (
                        <SelectGroup>
                          <SelectLabel className="bg-muted/50">Media Sedang Dibuka</SelectLabel>
                          {mediaPacks.map(pack => (
                            <SelectItem key={pack.id} value={pack.id}>
                              📦 {pack.itemName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {activeSeedPackId === "none" && (
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <Label htmlFor="costSeed" className="flex items-center gap-1.5 text-muted-foreground">
                     Biaya Benih Manual (Rp)
                  </Label>
                  <Input
                    id="costSeed"
                    type="number"
                    placeholder="0"
                    value={costSeed}
                    onChange={(e) => setCostSeed(e.target.value)}
                  />
                </div>
              )}
              
              {activeMediaPackId === "none" && (
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <Label htmlFor="costMedia" className="flex items-center gap-1.5 text-muted-foreground">
                    Biaya Rockwool Manual (Rp)
                  </Label>
                  <Input
                    id="costMedia"
                    type="number"
                    placeholder="0"
                    value={costMedia}
                    onChange={(e) => setCostMedia(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Catatan khusus batch ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="botanical" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan Batch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
