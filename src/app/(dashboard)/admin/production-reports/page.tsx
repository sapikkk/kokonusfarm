import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReviewHarvestDialog } from "@/components/production/review-harvest-dialog"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ClipboardCheck, Clock, CheckCircle, XCircle, Leaf } from "lucide-react"

async function getHarvestReports() {
  return prisma.harvestReport.findMany({
    include: {
      cycle: { select: { batchCode: true, plantType: true, startDate: true } },
      submittedBy: { select: { name: true } },
      reviewedBy: { select: { name: true } },
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  })
}

type ReportItem = Awaited<ReturnType<typeof getHarvestReports>>[number]

export default async function ProductionReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const rawReports = await getHarvestReports()

  // Serialize Decimal → number so Client Components don't receive non-plain objects
  const reports = rawReports.map(r => ({
    ...r,
    harvestQuantity: Number(r.harvestQuantity),
    hppPerUnit: r.hppPerUnit !== null ? Number(r.hppPerUnit) : null,
    costSeed: r.costSeed !== null ? Number(r.costSeed) : null,
    costMedia: r.costMedia !== null ? Number(r.costMedia) : null,
    costNutrient: r.costNutrient !== null ? Number(r.costNutrient) : null,
    costElectricity: r.costElectricity !== null ? Number(r.costElectricity) : null,
    costLabor: r.costLabor !== null ? Number(r.costLabor) : null,
    costOther: r.costOther !== null ? Number(r.costOther) : null,
  }))

  const pending = reports.filter((r) => r.status === "PENDING")
  const approved = reports.filter((r) => r.status === "APPROVED")
  const rejected = reports.filter((r) => r.status === "REJECTED")

  const formatRp = (n: number | null | undefined) =>
    n ? `Rp ${Number(n).toLocaleString("id-ID")}` : "—"

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Laporan Panen</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Review laporan panen pekerja dan tetapkan HPP untuk rekap keuangan
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,210,63,0.1)', border: '1px solid rgba(255,210,63,0.25)' }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,210,63,0.2)' }}>
            <Clock className="h-5 w-5" style={{ color: '#c8920a' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Menunggu Review</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(159,232,112,0.08)', border: '1px solid rgba(159,232,112,0.2)' }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(159,232,112,0.15)' }}>
            <CheckCircle className="h-5 w-5" style={{ color: '#2a7015' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{approved.length}</p>
            <p className="text-xs text-muted-foreground">Disetujui</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,95,95,0.08)', border: '1px solid rgba(255,95,95,0.2)' }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,95,95,0.15)' }}>
            <XCircle className="h-5 w-5" style={{ color: '#FF5F5F' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{rejected.length}</p>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </div>
        </div>
      </div>

      {/* Pending Reports — prioritas */}
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,210,63,0.2)' }}>
                <Clock className="h-4 w-4" style={{ color: '#c8920a' }} />
              </div>
              <div>
                <CardTitle className="text-base">Menunggu Review</CardTitle>
                <CardDescription>{pending.length} laporan perlu ditetapkan HPP-nya</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(255,210,63,0.06)', border: '1px solid rgba(255,210,63,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(159,232,112,0.15)' }}>
                    <Leaf className="h-4 w-4" style={{ color: '#2a7015' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{report.cycle.plantType}</p>
                      <Badge variant="outline" className="text-[10px] h-4">{report.cycle.batchCode}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {parseFloat(report.harvestQuantity.toString()).toLocaleString("id-ID")} {report.harvestUnit}
                      &nbsp;·&nbsp;Oleh {report.submittedBy.name}
                      &nbsp;·&nbsp;{format(new Date(report.createdAt), "dd MMM, HH:mm", { locale: localeId })}
                    </p>
                    {report.workerNotes && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">&ldquo;{report.workerNotes}&rdquo;</p>
                    )}
                  </div>
                </div>
                <ReviewHarvestDialog report={report} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[#062F28]/10 dark:bg-[#9FE870]/15">
              <ClipboardCheck className="h-4 w-4 text-[#062F28] dark:text-[#9FE870]" />
            </div>
            <div>
              <CardTitle className="text-base">Semua Laporan</CardTitle>
              <CardDescription>Riwayat seluruh laporan panen</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground text-sm">Belum ada laporan panen</p>
              <p className="text-muted-foreground text-xs">Laporan akan muncul setelah pekerja mengirimkan hasil panen</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-black/[0.06] dark:border-white/[0.06] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                      <p className="font-semibold text-sm text-foreground">{report.cycle.plantType}</p>
                      <p className="text-xs text-muted-foreground">{report.cycle.batchCode}</p>
                    </div>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          {parseFloat(report.harvestQuantity.toString()).toLocaleString("id-ID")} {report.harvestUnit}
                        </span>
                        <span className="text-muted-foreground"> · {report.submittedBy.name}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {report.hppPerUnit && (
                          <span className="text-xs font-semibold" style={{ color: '#9FE870' }}>
                            HPP: {formatRp(Number(report.hppPerUnit))}/{report.harvestUnit}
                          </span>
                        )}
                        {report.hppPerUnit && (
                          <span className="text-xs text-muted-foreground">
                            Total: {formatRp(Number(report.hppPerUnit) * parseFloat(report.harvestQuantity.toString()))}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(report.createdAt), "dd MMM yyyy", { locale: localeId })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      report.status === "APPROVED" ? "success" :
                        report.status === "REJECTED" ? "destructive" : "warning"
                    }>
                      {report.status === "APPROVED" ? "Disetujui" :
                        report.status === "REJECTED" ? "Ditolak" : "Pending"}
                    </Badge>
                    <ReviewHarvestDialog report={report} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
