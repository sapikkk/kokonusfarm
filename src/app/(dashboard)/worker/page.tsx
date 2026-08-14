import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sprout, Package, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPhaseColor, getPhaseLabel, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewBatchDialog } from "@/components/production/new-batch-dialog";
import { UpdateBatchDialog } from "@/components/production/update-batch-dialog";

async function getWorkerDashboardData(userId: string) {
  // Get active production cycles
  const activeCycles = await prisma.productionCycle.findMany({
    where: {
      phase: {
        in: ["SEMAI", "BIBIT", "TANAM"],
      },
    },
    orderBy: {
      startDate: "desc",
    },
    take: 10,
  });

  // Get recent production logs by this user
  const recentLogs = await prisma.productionLog.findMany({
    where: {
      userId: userId,
    },
    include: {
      cycle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get inventory items with low stock
  // Note: Prisma tidak support column-to-column comparison langsung,
  // jadi kita fetch semua item aktif dan filter in-memory.
  const allActiveItems = await prisma.inventoryItem.findMany({
    where: { isActive: true },
    select: { id: true, name: true, unit: true, currentStock: true, minStock: true },
  });
  const lowStockItems = allActiveItems.filter(
    (item) => Number(item.currentStock) <= Number(item.minStock)
  );

  // Count by phase
  const semaiCount = activeCycles
    .filter((c) => c.phase === "SEMAI")
    .reduce((acc, c) => acc + c.currentQuantity, 0);
  const tanamCount = activeCycles
    .filter((c) => c.phase === "TANAM")
    .reduce((acc, c) => acc + c.currentQuantity, 0);

  return {
    activeCycles,
    recentLogs,
    lowStockItems,
    semaiCount,
    tanamCount,
    totalActive: activeCycles.length,
  };
}

export default async function WorkerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const data = await getWorkerDashboardData(session.user.id);

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Catatan Saya</h2>
        <p className="text-muted-foreground">
          Pantau dan kelola produksi harian
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Aktif"
          value={data.totalActive}
          description="Batch berjalan"
          icon={Sprout}
        />

        <StatCard
          title="Fase Semai"
          value={data.semaiCount}
          description="Batch semai"
          icon={Sprout}
        />

        <StatCard
          title="Fase Tanam"
          value={data.tanamCount}
          description="Batch tanam"
          icon={Sprout}
        />

        <StatCard
          title="Stok Rendah"
          value={data.lowStockItems.length}
          description="Item perlu diisi"
          icon={Package}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Operasi umum untuk pencatatan harian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <NewBatchDialog />
            <Button variant="outline" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Fase
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Input Inventaris
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Aktif</CardTitle>
          <CardDescription>
            Siklus produksi yang sedang berjalan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.activeCycles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Tidak ada batch aktif</p>
              </div>
            ) : (
              data.activeCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{cycle.batchCode}</p>
                      <Badge className={getPhaseColor(cycle.phase)}>
                        {getPhaseLabel(cycle.phase)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cycle.plantType} • {cycle.currentQuantity}/
                      {cycle.initialQuantity} bibit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mulai: {formatDate(cycle.startDate)}
                    </p>
                  </div>
                  <UpdateBatchDialog
                    cycleId={cycle.id}
                    currentPhase={cycle.phase}
                    currentQuantity={cycle.currentQuantity}
                    batchCode={cycle.batchCode}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {data.lowStockItems.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,210,63,0.08)",
            border: "1px solid rgba(255,210,63,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,210,63,0.2)" }}
            >
              <AlertCircle className="h-4 w-4" style={{ color: "#c8920a" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#8a6500" }}>
                Peringatan Stok Rendah
              </p>
              <p className="text-xs" style={{ color: "#7B7B7B" }}>
                Item yang perlu segera diisi ulang
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-[#0A3D35]"
                style={{ border: "1px solid rgba(255,210,63,0.3)" }}
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stok: {item.currentStock.toString()} {item.unit}
                  </p>
                </div>
                <Badge variant="warning">Rendah</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
