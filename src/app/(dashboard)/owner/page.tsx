import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Leaf,
  Package,
  ClipboardList,
} from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/utils"

async function getDashboardData() {
  // ── Financial totals: aggregate dari SEMUA jurnal APPROVED ──────────────────
  // Pendapatan = total KREDIT pada akun bertipe REVENUE
  const revenueAgg = await prisma.journalLine.aggregate({
    _sum: { credit: true },
    where: {
      transaction: { status: "APPROVED" },
      account: { type: "REVENUE" },
    },
  })

  // Pengeluaran = total DEBIT pada akun bertipe EXPENSE
  const expenseAgg = await prisma.journalLine.aggregate({
    _sum: { debit: true },
    where: {
      transaction: { status: "APPROVED" },
      account: { type: "EXPENSE" },
    },
  })

  const totalRevenue = Number(revenueAgg._sum.credit ?? 0)
  const totalExpense = Number(expenseAgg._sum.debit ?? 0)
  const totalBalance = totalRevenue - totalExpense

  // ── Aktivitas terbaru (5 transaksi terakhir yang disetujui) ──────────────────
  const recentTransactions = await prisma.transaction.findMany({
    where: { status: "APPROVED" },
    orderBy: { date: "desc" },
    take: 5,
  })

  // ── Pending items ─────────────────────────────────────────────────────────────
  const pendingTransactionCount = await prisma.transaction.count({
    where: { status: "PENDING" },
  })

  const pendingHarvestCount = await prisma.harvestReport.count({
    where: { status: "PENDING" },
  })

  // ── Produksi aktif ────────────────────────────────────────────────────────────
  const productionCycles = await prisma.productionCycle.findMany({
    where: { phase: { in: ["TANAM", "BIBIT", "SEMAI"] } },
    orderBy: { startDate: "desc" },
  })

  const totalInitial = productionCycles.reduce((sum, c) => sum + c.initialQuantity, 0)
  const totalCurrent = productionCycles.reduce((sum, c) => sum + c.currentQuantity, 0)
  const efficiency = totalInitial > 0 ? (totalCurrent / totalInitial) * 100 : 0

  // ── Stok rendah ───────────────────────────────────────────────────────────────
  const allInventory = await prisma.inventoryItem.findMany({
    where: { isActive: true },
    select: { currentStock: true, minStock: true },
  })
  const lowStockCount = allInventory.filter(
    (i) => Number(i.currentStock) <= Number(i.minStock)
  ).length

  return {
    totalRevenue,
    totalExpense,
    totalBalance,
    pendingTransactionCount,
    pendingHarvestCount,
    lowStockCount,
    efficiency,
    activeCycles: productionCycles.length,
    recentActivities: recentTransactions.map((t) => ({
      id: t.id,
      type: "transaction" as const,
      title: t.description,
      description: t.reference || "Tanpa referensi",
      timestamp: t.date,
      status: t.status,
    })),
  }
}

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "OWNER") {
    redirect("/")
  }

  const data = await getDashboardData()

  const totalPending = data.pendingTransactionCount + data.pendingHarvestCount

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Owner</h2>
        <p className="text-muted-foreground">
          Ringkasan keuangan dan produksi Kebun Hijau
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Laba Bersih"
          value={formatCurrency(data.totalBalance)}
          description="Pendapatan dikurangi pengeluaran"
          icon={Wallet}
        />

        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(data.totalRevenue)}
          description="Akumulasi dari semua penjualan"
          icon={TrendingUp}
        />

        <StatCard
          title="Total Pengeluaran"
          value={formatCurrency(data.totalExpense)}
          description="Akumulasi semua beban operasional"
          icon={TrendingDown}
        />

        <StatCard
          title="Item Perlu Perhatian"
          value={totalPending}
          description={`${data.pendingTransactionCount} jurnal + ${data.pendingHarvestCount} laporan panen`}
          icon={AlertCircle}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Efisiensi Produksi"
          value={formatPercentage(data.efficiency)}
          description="Rata-rata tingkat keberhasilan batch aktif"
          icon={BarChart3}
        />

        <StatCard
          title="Batch Aktif"
          value={data.activeCycles}
          description="Siklus produksi yang sedang berjalan"
          icon={Leaf}
        />

        <StatCard
          title="Stok Rendah"
          value={data.lowStockCount}
          description="Item inventaris di bawah batas minimum"
          icon={Package}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ringkasan Keuangan</CardTitle>
            <CardDescription>
              Arus kas dan tren pendapatan — grafik akan hadir di Sprint 4
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Financial summary table as interim while charts aren't ready */}
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Total Pendapatan (semua waktu)</span>
                <span className="font-semibold text-botanical-600">{formatCurrency(data.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Total Pengeluaran (semua waktu)</span>
                <span className="font-semibold text-red-500">{formatCurrency(data.totalExpense)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-semibold">Laba Bersih</span>
                <span className={`text-lg font-bold ${data.totalBalance >= 0 ? "text-botanical-600" : "text-red-500"}`}>
                  {formatCurrency(data.totalBalance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status Operasional</CardTitle>
            <CardDescription>
              Ringkasan kondisi saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(159,232,112,0.1)', border: '1px solid rgba(159,232,112,0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(159,232,112,0.2)' }}>
                    <Leaf className="h-4 w-4" style={{ color: '#2a7015' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Siklus Aktif</p>
                    <p className="text-xs text-muted-foreground">Batch sedang berjalan</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{data.activeCycles}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(6,47,40,0.05)', border: '1px solid rgba(6,47,40,0.1)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,47,40,0.1)' }}>
                    <BarChart3 className="h-4 w-4" style={{ color: '#062F28' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Efisiensi Rata-rata</p>
                    <p className="text-sm text-muted-foreground">Tingkat keberhasilan</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{formatPercentage(data.efficiency)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,170,0,0.15)' }}>
                    <ClipboardList className="h-4 w-4" style={{ color: '#b07800' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Menunggu Approval</p>
                    <p className="text-xs text-muted-foreground">Jurnal + Laporan panen</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{totalPending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={data.recentActivities} />
    </div>
  )
}
