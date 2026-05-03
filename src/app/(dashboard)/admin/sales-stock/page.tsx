import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Leaf, PackageOpen, ShoppingCart, Sprout } from "lucide-react"

async function getStockData() {
  const cycles = await prisma.productionCycle.findMany()

  // Aggregate by plant type
  const stockSummary: Record<string, { ready: number, planted: number, seeds: number, activeBatches: number }> = {}

  for (const cycle of cycles) {
    if (!stockSummary[cycle.plantType]) {
      stockSummary[cycle.plantType] = { ready: 0, planted: 0, seeds: 0, activeBatches: 0 }
    }

    if (cycle.phase === "PANEN") {
      stockSummary[cycle.plantType].ready += cycle.currentQuantity
    } else if (cycle.phase === "TANAM") {
      stockSummary[cycle.plantType].planted += cycle.currentQuantity
      stockSummary[cycle.plantType].activeBatches += 1
    } else if (cycle.phase === "SEMAI" || cycle.phase === "BIBIT") {
      stockSummary[cycle.plantType].seeds += cycle.currentQuantity
      stockSummary[cycle.plantType].activeBatches += 1
    }
  }

  // Convert to array and filter out empty ones
  const commodities = Object.entries(stockSummary).map(([name, data]) => ({
    name,
    ...data,
  })).filter(c => c.ready > 0 || c.planted > 0 || c.seeds > 0)

  return commodities
}

export default async function AdminSalesStockPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const commodities = await getStockData()

  const totalReady = commodities.reduce((acc, curr) => acc + curr.ready, 0)
  const totalUpcoming = commodities.reduce((acc, curr) => acc + curr.planted, 0)

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stok Jual & Komoditas</h2>
        <p className="text-muted-foreground">
          Pantau ketersediaan panen siap jual dan proyeksi produksi yang sedang ditanam.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-botanical-50 dark:bg-botanical-950/20 border-botanical-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-botanical-700 dark:text-botanical-400">Total Siap Jual</CardTitle>
            <ShoppingCart className="h-5 w-5 text-botanical-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-botanical-900 dark:text-botanical-100">{totalReady}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unit komoditas dari semua jenis yang sudah dipanen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Proyeksi Panen (Ditanam)</CardTitle>
            <Leaf className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalUpcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unit komoditas dalam fase pembesaran
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-botanical-600" />
            <CardTitle>Rekapitulasi Komoditas</CardTitle>
          </div>
          <CardDescription>
            Rincian stok per jenis sayuran/tanaman
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Komoditas</TableHead>
                <TableHead className="text-right">Bibit / Semai</TableHead>
                <TableHead className="text-right">Sedang Ditanam</TableHead>
                <TableHead className="text-right">Siap Jual (Panen)</TableHead>
                <TableHead className="text-center">Status Gudang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commodities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada data komoditas yang tercatat di sistem.</p>
                  </TableCell>
                </TableRow>
              ) : (
                commodities.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-semibold text-base">
                      {item.name}
                      {item.activeBatches > 0 && (
                        <p className="text-[10px] font-normal text-muted-foreground">
                          {item.activeBatches} batch aktif
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.seeds.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-amber-600 dark:text-amber-400 font-medium">
                      {item.planted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-botanical-600 text-lg">
                      {item.ready.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ready > 100 ? (
                        <Badge className="bg-botanical-500">Stok Berlimpah</Badge>
                      ) : item.ready > 0 ? (
                        <Badge variant="outline" className="text-orange-500 border-orange-200">Stok Terbatas</Badge>
                      ) : item.planted > 0 ? (
                        <Badge variant="secondary">Menunggu Panen</Badge>
                      ) : (
                        <Badge variant="destructive">Kosong</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900 mt-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Informasi Sistem</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Angka <strong>Siap Jual</strong> diambil dari sisa unit tanaman yang ada di batch berstatus <strong>PANEN</strong>. 
          Sebaliknya, <strong>Sedang Ditanam</strong> berasal dari batch <strong>TANAM</strong> (Pembesaran).
        </p>
      </div>
    </div>
  )
}
