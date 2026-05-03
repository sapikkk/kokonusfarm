import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tent, Zap, LayoutGrid, MapPin } from "lucide-react";
import { GreenhouseActions } from "@/components/greenhouse/greenhouse-actions";

async function getGreenhouses() {
  return prisma.greenhouse.findMany({
    include: {
      _count: { select: { installations: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export default async function AdminGreenhousePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/");
  }

  const rawGreenhouses = await getGreenhouses();

  // Serialize Decimal → number
  const greenhouses = rawGreenhouses.map((g) => ({
    ...g,
    area: g.area !== null ? Number(g.area) : null,
    fixedCostElectricity: Number(g.fixedCostElectricity),
  }));

  const totalArea = greenhouses.reduce((s, g) => s + (g.area ?? 0), 0);
  const totalElectricity = greenhouses.reduce((s, g) => s + g.fixedCostElectricity, 0);
  const activeCount = greenhouses.filter((g) => g.isActive).length;

  const formatRp = (n: number) =>
    n > 0 ? `Rp ${n.toLocaleString("id-ID")}` : "—";

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[--c-primary]">
            Manajemen Greenhouse
          </h2>
          <p className="text-[13px] text-[--c-secondary] mt-1">
            Daftar bangunan rumah kaca · Fixed Cost Listrik dibebankan ke HPP via jalur ABC
          </p>
        </div>
        <GreenhouseActions mode="create" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary] flex items-center gap-1.5">
              <Tent className="w-3.5 h-3.5 opacity-60" /> Total Aktif
            </CardDescription>
            <CardTitle className="text-3xl text-[--c-primary]">
              {activeCount}{" "}
              <span className="text-sm font-normal text-[--c-tertiary]">Greenhouse</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary] flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 opacity-60" /> Total Luas
            </CardDescription>
            <CardTitle className="text-3xl text-[--c-primary]">
              {totalArea.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-normal text-[--c-tertiary]">m²</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 opacity-60" /> Total Tagihan Listrik/bln
            </CardDescription>
            <CardTitle className="text-2xl text-[--c-primary]">
              {formatRp(totalElectricity)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-[--s-l1] border-[--border-ui]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded flex items-center justify-center bg-[--c-primary]/10">
              <Tent className="h-4 w-4 text-[--c-primary]" />
            </div>
            <div>
              <CardTitle className="text-[16px] font-bold text-[--c-primary]">
                Daftar Greenhouse
              </CardTitle>
              <CardDescription className="text-[12px] text-[--c-secondary] mt-0.5">
                Klik &quot;Kelola&quot; untuk edit atau tambah instalasi di dalamnya
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {greenhouses.length === 0 ? (
            <div className="text-center py-14">
              <Tent className="h-12 w-12 mx-auto mb-3 opacity-15" />
              <p className="text-[--c-secondary] text-sm">Belum ada greenhouse terdaftar</p>
              <p className="text-[--c-tertiary] text-xs mt-1">
                Klik &quot;Tambah Greenhouse&quot; untuk memulai
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Greenhouse</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Luas (m²)</TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Fixed Cost Listrik/bln
                      </span>
                    </TableHead>
                    <TableHead>Instalasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {greenhouses.map((gh) => (
                    <TableRow key={gh.id}>
                      <TableCell className="mono font-semibold text-[12px]">
                        {gh.code}
                      </TableCell>
                      <TableCell className="font-semibold text-[13px] text-[--c-primary]">
                        {gh.name}
                      </TableCell>
                      <TableCell>
                        {gh.location ? (
                          <div className="flex items-center text-[13px] text-[--c-secondary] gap-1.5">
                            <MapPin className="h-3.5 w-3.5 opacity-50" />
                            {gh.location}
                          </div>
                        ) : (
                          <span className="text-[--c-tertiary] text-[12px]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] text-[--c-secondary]">
                        {gh.area ? gh.area.toLocaleString("id-ID") : "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: gh.fixedCostElectricity > 0 ? "#c8920a" : undefined }}
                        >
                          {formatRp(gh.fixedCostElectricity)}
                        </span>
                        {gh.electricityNotes && (
                          <p className="text-[11px] text-[--c-tertiary] mt-0.5">
                            {gh.electricityNotes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] text-[--c-secondary]">
                        {gh._count.installations} unit
                      </TableCell>
                      <TableCell>
                        <Badge variant={gh.isActive ? "poadminve" : "notice"} dot>
                          {gh.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <GreenhouseActions mode="edit" greenhouse={gh} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
