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
import { ArrowLeft, History, Sprout } from "lucide-react"
import { getPhaseColor, getPhaseLabel, formatDate, calculateYieldEfficiency } from "@/lib/utils"
import { DetailBatchDialog } from "@/components/production/detail-batch-dialog"
import Link from "next/link"

async function getHarvestedData() {
  const cycles = await prisma.productionCycle.findMany({
    where: {
      phase: "PANEN"
    },
    orderBy: {
      harvestDate: "desc",
    },
    take: 100, // Show last 100 harvested batches
  })

  return cycles
}

export default async function WorkerProductionHistoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }

  const harvestedCycles = await getHarvestedData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/worker/production">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Riwayat Panen</h2>
          </div>
          <p className="text-muted-foreground ml-10">
            Daftar seluruh siklus produksi tanaman yang telah selesai dipanen.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-botanical-600" />
            <CardTitle>Arsip Batch Selesai</CardTitle>
          </div>
          <CardDescription>
            Riwayat batch produksi yang telah berhasil diselesaikan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Batch</TableHead>
                <TableHead>Jenis Tanaman</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hasil Panen</TableHead>
                <TableHead>Tingkat Keberhasilan</TableHead>
                <TableHead>Tanggal Panen</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {harvestedCycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada riwayat panen</p>
                  </TableCell>
                </TableRow>
              ) : (
                harvestedCycles.map((cycle) => {
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
                          <span className="font-medium text-botanical-600">
                            {cycle.currentQuantity} / {cycle.initialQuantity}
                          </span>
                          {cycle.rejectedCount > 0 && (
                            <span className="text-xs text-red-600">
                              {cycle.rejectedCount} afkir/mati
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-botanical-600"
                              style={{ width: `${efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {efficiency.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cycle.harvestDate ? formatDate(cycle.harvestDate, "dd MMM yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <DetailBatchDialog
                          cycleId={cycle.id}
                          batchCode={cycle.batchCode}
                        />
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
