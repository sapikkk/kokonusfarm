"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  CheckCircle,
  XCircle,
  Calculator,
  Leaf,
  Tent,
  LayoutGrid,
  Zap,
  Sprout,
  Beaker,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface HarvestReport {
  id: string
  harvestQuantity: number
  harvestUnit: string
  workerNotes?: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  cycle: { batchCode: string; plantType: string; startDate: Date | string }
  submittedBy: { name: string }
  createdAt: Date | string
}

interface ReviewHarvestDialogProps {
  report: HarvestReport
}

const emptyForm = {
  hppPerUnit: "",
  hppNotes: "",
  costSeed: "",
  costMedia: "",
  costNutrient: "",
  costElectricity: "",
  costLabor: "",
  costOther: "",
}

type AbcChain = {
  hasInstallation: boolean
  hasGreenhouse: boolean
  installationName: string | null
  greenhouseName: string | null
  abcLayersUsed: string[]
}

type EstimateSources = {
  seedSource: string
  mediaSource: string
  nutrientSource: string
  electricitySource: string
  abcNote: string
  baseQty: number
}

export function ReviewHarvestDialog({ report }: ReviewHarvestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [abcChain, setAbcChain] = useState<AbcChain | null>(null)
  const [sources, setSources] = useState<EstimateSources | null>(null)
  const router = useRouter()

  const qty = parseFloat(String(report.harvestQuantity))
  const hppPerUnit = parseFloat(form.hppPerUnit || "0")
  const totalHPP = hppPerUnit * qty

  const totalBiaya = [
    form.costSeed,
    form.costMedia,
    form.costNutrient,
    form.costElectricity,
    form.costLabor,
    form.costOther,
  ].reduce((sum, v) => sum + parseFloat(v || "0"), 0)

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const formatRp = (n: number) =>
    n > 0 ? `Rp ${n.toLocaleString("id-ID")}` : "—"

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE" && (!form.hppPerUnit || parseFloat(form.hppPerUnit) <= 0)) {
      setError("HPP per unit wajib diisi dan lebih dari 0")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const body: Record<string, unknown> = { action }
      if (action === "APPROVE") {
        body.hppPerUnit = parseFloat(form.hppPerUnit)
        body.hppNotes = form.hppNotes || undefined
        body.costSeed = form.costSeed ? parseFloat(form.costSeed) : null
        body.costMedia = form.costMedia ? parseFloat(form.costMedia) : null
        body.costNutrient = form.costNutrient ? parseFloat(form.costNutrient) : null
        body.costElectricity = form.costElectricity ? parseFloat(form.costElectricity) : null
        body.costLabor = form.costLabor ? parseFloat(form.costLabor) : null
        body.costOther = form.costOther ? parseFloat(form.costOther) : null
      } else {
        body.hppNotes = form.hppNotes || "Ditolak oleh admin"
      }

      const res = await fetch(`/api/harvest-reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Terjadi kesalahan")
      }

      setOpen(false)
      setForm(emptyForm)
      setAbcChain(null)
      setSources(null)
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleAutoCalculate = async () => {
    setIsEstimating(true)
    setError(null)
    setAbcChain(null)
    setSources(null)
    try {
      const res = await fetch(`/api/harvest-reports/${report.id}/estimate`)
      if (!res.ok) throw new Error("Gagal mengambil data ABC")

      const data = await res.json()
      const { estimatedCosts, hppPerUnitSuggestion, abcChain: chain, sources: src } = data

      setAbcChain(chain)
      setSources(src)

      setForm((prev) => ({
        ...prev,
        costSeed: estimatedCosts.costSeed > 0 ? estimatedCosts.costSeed.toString() : "",
        costMedia: estimatedCosts.costMedia > 0 ? estimatedCosts.costMedia.toString() : "",
        costNutrient: estimatedCosts.costNutrient > 0 ? estimatedCosts.costNutrient.toString() : "",
        costElectricity: estimatedCosts.costElectricity > 0 ? estimatedCosts.costElectricity.toString() : "",
        costLabor: "0",
        costOther: "0",
        hppPerUnit: hppPerUnitSuggestion > 0 ? hppPerUnitSuggestion.toString() : prev.hppPerUnit,
        hppNotes: src.abcNote,
      }))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal tarik data")
    } finally {
      setIsEstimating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Calculator className="h-3.5 w-3.5" />
          {report.status === "PENDING" ? "Review & HPP" : "Detail HPP"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#9FE870]/20">
              <Leaf className="h-4 w-4 text-[#2a7015]" />
            </div>
            <div>
              <DialogTitle className="text-base">Review Laporan Panen</DialogTitle>
              <DialogDescription className="text-xs">
                {report.cycle.batchCode} · {report.cycle.plantType}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div
            className="p-3 text-sm rounded-lg mt-2 flex items-start gap-2"
            style={{ background: "rgba(255,95,95,0.1)", color: "#FF5F5F" }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Info Laporan */}
        <div
          className="rounded-xl p-4 space-y-3 mt-2"
          style={{ background: "rgba(159,232,112,0.06)", border: "1px solid rgba(159,232,112,0.15)" }}
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Dari Pekerja</p>
              <p className="font-semibold text-foreground">{report.submittedBy.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Tanggal Submit</p>
              <p className="font-semibold text-foreground">
                {format(new Date(report.createdAt), "dd MMM yyyy, HH:mm", { locale: localeId })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Hasil Panen</p>
              <p className="text-2xl font-bold" style={{ color: "#9FE870" }}>
                {qty.toLocaleString("id-ID")}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {report.harvestUnit}
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Status</p>
              <Badge
                variant={
                  report.status === "APPROVED"
                    ? "success"
                    : report.status === "REJECTED"
                    ? "destructive"
                    : "warning"
                }
              >
                {report.status === "APPROVED"
                  ? "Disetujui"
                  : report.status === "REJECTED"
                  ? "Ditolak"
                  : "Pending"}
              </Badge>
            </div>
          </div>
          {report.workerNotes && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs mb-1">Catatan Pekerja</p>
                <p className="text-sm text-foreground italic">&ldquo;{report.workerNotes}&rdquo;</p>
              </div>
            </>
          )}
        </div>

        {/* Form HPP — hanya PENDING */}
        {report.status === "PENDING" && (
          <div className="space-y-4 mt-2">
            {/* Header Penetapan HPP + Tombol Tarik */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#9FE870]" />
                Penetapan HPP (ABC Costing)
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoCalculate}
                disabled={isEstimating}
                className="h-8 text-[11px] gap-1.5"
              >
                <Leaf className="h-3 w-3" style={{ color: "#2a7015" }} />
                {isEstimating ? "Menarik data ABC..." : "⚡ Tarik Data ABC"}
              </Button>
            </div>

            {/* Panel info ABC chain setelah tarik data */}
            {abcChain && (
              <div
                className="rounded-xl p-3 space-y-2 text-[12px]"
                style={{ background: "rgba(6,47,40,0.04)", border: "1px solid rgba(6,47,40,0.1)" }}
              >
                <p className="font-semibold text-[--c-secondary] flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" /> Jalur ABC yang ditarik:
                </p>

                {/* Layer 1 — Batch */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 rounded px-2 py-0.5"
                    style={{ background: "rgba(99,102,241,0.1)" }}
                  >
                    <Sprout className="w-3 h-3" style={{ color: "#6366f1" }} />
                    <span className="font-medium">Batch Semai</span>
                  </div>
                  <span className="text-[--c-tertiary]">{sources?.seedSource}</span>
                </div>

                {/* Layer 2 — Instalasi */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 rounded px-2 py-0.5"
                    style={{
                      background: abcChain.hasInstallation
                        ? "rgba(159,232,112,0.12)"
                        : "rgba(255,95,95,0.08)",
                    }}
                  >
                    <LayoutGrid className="w-3 h-3" style={{ color: abcChain.hasInstallation ? "#2a7015" : "#FF5F5F" }} />
                    <span className="font-medium">Instalasi</span>
                  </div>
                  <span className="text-[--c-tertiary]">
                    {abcChain.hasInstallation
                      ? abcChain.installationName
                      : "⚠ Batch belum dikaitkan instalasi"}
                  </span>
                </div>

                {/* Layer 3 — Greenhouse */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 rounded px-2 py-0.5"
                    style={{
                      background: abcChain.hasGreenhouse
                        ? "rgba(255,210,63,0.12)"
                        : "rgba(255,95,95,0.08)",
                    }}
                  >
                    <Tent className="w-3 h-3" style={{ color: abcChain.hasGreenhouse ? "#c8920a" : "#FF5F5F" }} />
                    <span className="font-medium">Greenhouse</span>
                  </div>
                  <span className="text-[--c-tertiary]">
                    {abcChain.hasGreenhouse
                      ? abcChain.greenhouseName
                      : "⚠ Tidak ada data greenhouse"}
                  </span>
                </div>
              </div>
            )}

            {/* Breakdown biaya — 3 Layer */}
            <div className="space-y-2.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Breakdown Biaya per Layer (Dapat diedit)
              </p>

              {/* Layer 1 — Batch */}
              <div
                className="rounded-lg p-3 space-y-2"
                style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.15)" }}
              >
                <p className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: "#6366f1" }}>
                  <Sprout className="w-3 h-3" /> Layer 1 · Batch Semai
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="costSeed" className="text-xs">Biaya Benih (Rp)</Label>
                    <Input id="costSeed" type="number" min="0" step="100" placeholder="0"
                      value={form.costSeed} onChange={set("costSeed")} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="costMedia" className="text-xs">Biaya Rockwool / Media (Rp)</Label>
                    <Input id="costMedia" type="number" min="0" step="100" placeholder="0"
                      value={form.costMedia} onChange={set("costMedia")} className="h-9 text-sm" />
                  </div>
                </div>
              </div>

              {/* Layer 2 — Instalasi */}
              <div
                className="rounded-lg p-3 space-y-2"
                style={{ background: "rgba(159,232,112,0.04)", border: "1px solid rgba(159,232,112,0.18)" }}
              >
                <p className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: "#2a7015" }}>
                  <Beaker className="w-3 h-3" /> Layer 2 · Instalasi (Nutrisi Tandon)
                </p>
                <div className="space-y-1">
                  <Label htmlFor="costNutrient" className="text-xs">Biaya Nutrisi (Rp)</Label>
                  <Input id="costNutrient" type="number" min="0" step="100" placeholder="0"
                    value={form.costNutrient} onChange={set("costNutrient")} className="h-9 text-sm" />
                </div>
              </div>

              {/* Layer 3 — Greenhouse */}
              <div
                className="rounded-lg p-3 space-y-2"
                style={{ background: "rgba(255,210,63,0.04)", border: "1px solid rgba(255,210,63,0.2)" }}
              >
                <p className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: "#c8920a" }}>
                  <Zap className="w-3 h-3" /> Layer 3 · Greenhouse (Listrik)
                </p>
                <div className="space-y-1">
                  <Label htmlFor="costElectricity" className="text-xs">Biaya Listrik (Rp)</Label>
                  <Input id="costElectricity" type="number" min="0" step="100" placeholder="0"
                    value={form.costElectricity} onChange={set("costElectricity")} className="h-9 text-sm" />
                </div>
              </div>

              {/* Extra */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="costLabor" className="text-xs">Biaya Tenaga Kerja (Rp)</Label>
                  <Input id="costLabor" type="number" min="0" step="100" placeholder="0"
                    value={form.costLabor} onChange={set("costLabor")} className="h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="costOther" className="text-xs">Biaya Lain-lain (Rp)</Label>
                  <Input id="costOther" type="number" min="0" step="100" placeholder="0"
                    value={form.costOther} onChange={set("costOther")} className="h-9 text-sm" />
                </div>
              </div>

              {/* Total */}
              {totalBiaya > 0 && (
                <div
                  className="p-2.5 rounded-lg text-xs flex justify-between font-medium"
                  style={{ background: "rgba(6,47,40,0.05)" }}
                >
                  <span className="text-muted-foreground">Total Semua Biaya</span>
                  <span className="font-bold text-foreground">{formatRp(totalBiaya)}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* HPP per unit */}
            <div className="space-y-2">
              <Label htmlFor="hppPerUnit" className="font-semibold">
                HPP per Unit (Rp/{report.harvestUnit}) *
              </Label>
              <Input
                id="hppPerUnit"
                type="number"
                min="1"
                step="100"
                placeholder="Contoh: 15000"
                value={form.hppPerUnit}
                onChange={(e) => { set("hppPerUnit")(e); setError(null) }}
              />
              {hppPerUnit > 0 && (
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "rgba(159,232,112,0.1)", border: "1px solid rgba(159,232,112,0.25)" }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {qty} {report.harvestUnit} × {formatRp(hppPerUnit)}
                    </span>
                    <span className="font-bold" style={{ color: "#2a7015" }}>
                      = {formatRp(totalHPP)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total HPP yang akan dijurnal otomatis
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hppNotes">Keterangan (opsional)</Label>
              <Textarea
                id="hppNotes"
                placeholder="Dasar penetapan HPP, asumsi biaya, dll..."
                rows={2}
                value={form.hppNotes}
                onChange={set("hppNotes")}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="gap-1.5"
                disabled={loading}
                onClick={() => handleAction("REJECT")}
              >
                <XCircle className="h-3.5 w-3.5" /> Tolak
              </Button>
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Tutup
              </Button>
              <Button
                type="button"
                disabled={loading}
                className="gap-1.5"
                onClick={() => handleAction("APPROVE")}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {loading ? "Menyimpan..." : "Setujui & Catat HPP"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {report.status !== "PENDING" && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
