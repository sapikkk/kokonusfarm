import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, CheckCircle, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

async function getAdminDashboardData() {
  // Get transactions that need approval
  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
      journalLines: {
        include: {
          account: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  const approvedTransactions = await prisma.transaction.findMany({
    where: {
      status: "APPROVED",
    },
    take: 5,
    orderBy: {
      date: "desc",
    },
  })

  const rejectedTransactions = await prisma.transaction.findMany({
    where: {
      status: "REJECTED",
    },
    take: 5,
    orderBy: {
      date: "desc",
    },
  })

  const draftTransactions = await prisma.transaction.findMany({
    where: {
      status: "DRAFT",
    },
    take: 5,
    orderBy: {
      date: "desc",
    },
  })

  return {
    pending: pendingTransactions,
    approved: approvedTransactions.length,
    rejected: rejectedTransactions.length,
    draft: draftTransactions.length,
    recentActivities: pendingTransactions.slice(0, 5).map(t => ({
      id: t.id,
      type: "transaction" as const,
      title: t.description,
      description: `Oleh ${t.user.name}`,
      timestamp: t.date,
      status: t.status,
    })),
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const data = await getAdminDashboardData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
        <p className="text-muted-foreground">
          Pusat jurnal dan verifikasi transaksi
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Menunggu Persetujuan"
          value={data.pending.length}
          description="Transaksi pending"
          icon={Clock}
        />

        <StatCard
          title="Disetujui"
          value={data.approved}
          description="Transaksi approved"
          icon={CheckCircle}
        />

        <StatCard
          title="Ditolak"
          value={data.rejected}
          description="Transaksi rejected"
          icon={XCircle}
        />

        <StatCard
          title="Draft"
          value={data.draft}
          description="Belum selesai"
          icon={Receipt}
        />
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Antrean Verifikasi</CardTitle>
          <CardDescription>
            Transaksi yang memerlukan persetujuan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.pending.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Tidak ada transaksi yang menunggu persetujuan</p>
              </div>
            ) : (
              data.pending.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent tranadminon-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Oleh {transaction.user.name}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    {transaction.reference && (
                      <p className="text-xs text-muted-foreground">
                        Ref: {transaction.reference}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <RecentActivity activities={data.recentActivities} />
    </div>
  )
}
