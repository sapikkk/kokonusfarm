import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sprout, Activity, ArrowRight, Tent, LayoutGrid, AlertCircle } from "lucide-react"
import { getPhaseColor, getPhaseLabel, formatDate } from "@/lib/utils"
import { NewBatchDialog } from "@/components/production/new-batch-dialog"

async function getActiveProduction() {
  return prisma.productionCycle.findMany({
    where: {
      phase: { in: ["SEMAI", "BIBIT", "TANAM"] },
    },
    orderBy: { startDate: "desc" },
    include: {
      // ABC Costing chain
      installation: {
        select: {
          id: true,
          code: true,
          name: true,
          type: true,
          fixedCostNutrient: true,
          greenhouse: {
            select: {
              id: true,
              code: true,
              name: true,
              fixedCostElectricity: true,
            },
          },
        },
      },
      productionLogs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })
}

export default async function ActiveProductionPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const activeCycles = await getActiveProduction()

  const semai = activeCycles.filter((c) => c.phase === "SEMAI").reduce((a, c) => a + c.currentQuantity, 0)
  const bibit = activeCycles.filter((c) => c.phase === "BIBIT").reduce((a, c) => a + c.currentQuantity, 0)
  const tanam = activeCycles.filter((c) => c.phase === "TANAM").reduce((a, c) => a + c.currentQuantity, 0)

  // Batch tanpa instalasi → perlu perhatian
  const unassigned = activeCycles.filter((c) => !c.installationId).length

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Produksi Berjalan</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Pantau seluruh batch aktif — Greenhouse → Instalasi → Batch
          </p>
        </div>
        <NewBatchDialog />
      </div>

      {/* Alert: batch tanpa lokasi */}
      {unassigned > 0 && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,210,63,0.08)", border: "1px solid rgba(255,210,63,0.3)" }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#c8920a" }} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#c8920a" }}>
              {unassigned} batch belum dikaitkan ke instalasi
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Batch tanpa instalasi tidak bisa dihitung HPP-nya secara otomatis. Edit batch untuk menambahkan lokasi.
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(159,232,112,0.05)", border: "1px solid rgba(159,232,112,0.15)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-card">
            <p className="font-bold text-lg">{semai}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Fase Semai</p>
            <p className="text-xs text-muted-foreground">Bibit disemai</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(159,232,112,0.1)", border: "1px solid rgba(159,232,112,0.3)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-card">
            <p className="font-bold text-lg">{bibit}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Fase Bibit</p>
            <p className="text-xs text-muted-foreground">Sudah berkecambah</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(159,232,112,0.2)", border: "1px solid rgba(159,232,112,0.4)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-card">
            <p className="font-bold text-lg" style={{ color: "#2a7015" }}>{tanam}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Fase Tanam</p>
            <p className="text-xs text-muted-foreground">Di instalasi</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[#062F28]/10 dark:bg-[#9FE870]/15">
              <Activity className="h-4 w-4 text-[#062F28] dark:text-[#9FE870]" />
            </div>
            <div>
              <CardTitle className="text-base">Detail Batch Aktif</CardTitle>
              <CardDescription>
                {activeCycles.length} batch berjalan · terurut GH → Instalasi → Batch
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Batch</TableHead>
                <TableHead>Tanaman</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1">
                    <Tent className="w-3.5 h-3.5" /> Greenhouse
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1">
                    <LayoutGrid className="w-3.5 h-3.5" /> Instalasi
                  </span>
                </TableHead>
                <TableHead>Qty (Hidup / Awal)</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Aktivitas Terakhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Tidak ada produksi yang sedang berjalan</p>
                  </TableCell>
                </TableRow>
              ) : (
                activeCycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-mono font-semibold text-[12px]">
                      {cycle.batchCode}
                    </TableCell>
                    <TableCell className="font-semibold text-[13px]">
                      {cycle.plantType}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPhaseColor(cycle.phase)}>
                        {getPhaseLabel(cycle.phase)}
                      </Badge>
                    </TableCell>

                    {/* Greenhouse */}
                    <TableCell>
                      {cycle.installation ? (
                        <div className="text-[13px]">
                          <p className="font-semibold text-[--c-primary]">
                            {cycle.installation.greenhouse.code}
                          </p>
                          <p className="text-[11px] text-[--c-tertiary]">
                            {cycle.installation.greenhouse.name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[--c-tertiary] italic flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-500" /> Belum diset
                        </span>
                      )}
                    </TableCell>

                    {/* Instalasi */}
                    <TableCell>
                      {cycle.installation ? (
                        <div className="text-[13px]">
                          <p className="font-semibold text-[--c-primary]">
                            {cycle.installation.code}
                          </p>
                          <p className="text-[11px] text-[--c-tertiary]">
                            {cycle.installation.name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[--c-tertiary] italic">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-[13px]">
                          {cycle.currentQuantity}{" "}
                          <span className="text-muted-foreground text-xs font-normal">
                            / {cycle.initialQuantity}
                          </span>
                        </span>
                        {cycle.rejectedCount > 0 && (
                          <span className="text-[10px] font-medium" style={{ color: "#FF5F5F" }}>
                            {cycle.rejectedCount} mati/ditolak
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(cycle.startDate, "dd MMM yyyy")}
                    </TableCell>

                    <TableCell>
                      {cycle.productionLogs?.[0] ? (
                        <div className="text-xs text-muted-foreground">
                          {cycle.productionLogs[0].action === "PHASE_CHANGE" ? (
                            <span className="flex items-center gap-1">
                              Fase diubah{" "}
                              <ArrowRight className="w-3 h-3" />{" "}
                              {getPhaseLabel(cycle.productionLogs[0].toPhase || cycle.phase)}
                            </span>
                          ) : cycle.productionLogs[0].action === "QUANTITY_UPDATE" ? (
                            <span>Kuantitas disesuaikan</span>
                          ) : (
                            <span>Batch dibuat</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Baru dibuat</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
