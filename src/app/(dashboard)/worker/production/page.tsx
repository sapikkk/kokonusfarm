import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Sprout, TrendingUp, History } from "lucide-react"
import Link from "next/link"
import { getPhaseColor, getPhaseLabel, formatDate, calculateYieldEfficiency } from "@/lib/utils"
import { NewBatchDialog } from "@/components/production/new-batch-dialog"
import { UpdateBatchDialog } from "@/components/production/update-batch-dialog"
import { DetailBatchDialog } from "@/components/production/detail-batch-dialog"
import { SubmitHarvestDialog } from "@/components/production/submit-harvest-dialog"

async function getProductionData() {
  const cycles = await prisma.productionCycle.findMany({
    orderBy: {
      startDate: "desc",
    },
    include: {
      harvestReports: {
        select: { id: true }
      }
    },
    take: 50,
  })

  const activeCycles = cycles.filter(c => 
    ["SEMAI", "BIBIT", "TANAM"].includes(c.phase) || 
    (c.phase === "PANEN" && c.harvestReports.length === 0)
  )

  const harvestedCycles = cycles.filter(c => c.phase === "PANEN")

  return { cycles, activeCycles, harvestedCycles }
}

export default async function WorkerProductionPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }

  const data = await getProductionData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Produksi</h2>
          <p className="text-muted-foreground">
            Pantau dan kelola siklus produksi tanaman hidroponik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/worker/production/history">
            <Button variant="outline" className="bg-white hover:bg-slate-50 dark:bg-slate-950">
              <History className="mr-2 h-4 w-4" />
              Riwayat Panen
            </Button>
          </Link>
          <NewBatchDialog />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Batch Aktif</CardDescription>
            <CardTitle className="text-4xl">{data.activeCycles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Sedang dalam proses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Dipanen</CardDescription>
            <CardTitle className="text-4xl">{data.harvestedCycles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Batch yang sudah selesai
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Efisiensi Rata-rata</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              {data.activeCycles.length > 0 
                ? Math.round(
                    data.activeCycles.reduce((sum, c) => 
                      sum + calculateYieldEfficiency(c.initialQuantity, c.currentQuantity), 0
                    ) / data.activeCycles.length
                  ) 
                : 0}%
              <TrendingUp className="h-6 w-6 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Tingkat keberhasilan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Aktif</CardTitle>
          <CardDescription>
            Siklus produksi yang sedang berjalan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Batch</TableHead>
                <TableHead>Jenis Tanaman</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Efisiensi</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.activeCycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada batch aktif</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.activeCycles.map((cycle) => {
                  const efficiency = calculateYieldEfficiency(
                    cycle.initialQuantity,
                    cycle.currentQuantity
                  )
                  
                  return (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium">
                        {cycle.batchCode}
                      </TableCell>
                      <TableCell>{cycle.plantType}</TableCell>
                      <TableCell>
                        <Badge className={getPhaseColor(cycle.phase)}>
                          {getPhaseLabel(cycle.phase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {cycle.currentQuantity} / {cycle.initialQuantity}
                          </span>
                          {cycle.rejectedCount > 0 && (
                            <span className="text-xs font-medium" style={{ color: '#FF5F5F' }}>
                              {cycle.rejectedCount} ditolak
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                             <div 
                               className="h-full"
                               style={{ width: `${efficiency}%`, background: '#9FE870' }}
                             />
                          </div>
                          <span className="text-sm font-medium">
                            {efficiency.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(cycle.startDate, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          <DetailBatchDialog
                            cycleId={cycle.id}
                            batchCode={cycle.batchCode}
                          />
                          <UpdateBatchDialog
                            cycleId={cycle.id}
                            currentPhase={cycle.phase}
                            currentQuantity={cycle.currentQuantity}
                            batchCode={cycle.batchCode}
                          />
                          {cycle.phase === "PANEN" && (
                            <SubmitHarvestDialog
                              cycleId={cycle.id}
                              batchCode={cycle.batchCode}
                              plantType={cycle.plantType}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
