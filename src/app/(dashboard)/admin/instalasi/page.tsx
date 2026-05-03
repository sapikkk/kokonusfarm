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
import { LayoutGrid, Beaker, GitMerge } from "lucide-react";
import { InstalasiActions } from "@/components/greenhouse/instalasi-actions";

async function getInstalasi() {
  return prisma.installation.findMany({
    include: {
      greenhouse: { select: { id: true, code: true, name: true } },
      _count: { select: { productionCycles: true } },
    },
    orderBy: [{ greenhouseId: "asc" }, { code: "asc" }],
  });
}

async function getGreenhouseList() {
  return prisma.greenhouse.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { code: "asc" },
  });
}

const TYPE_LABEL: Record<string, string> = {
  SEMAI_TRAY: "Rak Semai",
  DFT: "DFT",
  NFT: "NFT",
  DWC: "DWC",
  WICK: "Wick",
};

const TYPE_VARIANT: Record<string, "blue" | "notice" | "poadminve" | "default"> = {
  SEMAI_TRAY: "default",
  DFT: "blue",
  NFT: "notice",
  DWC: "poadminve",
  WICK: "default",
};

export default async function AdminInstalasiPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/");
  }

  const [rawInstalasi, greenhouseList] = await Promise.all([
    getInstalasi(),
    getGreenhouseList(),
  ]);

  const instalasi = rawInstalasi.map((i) => ({
    ...i,
    fixedCostNutrient: Number(i.fixedCostNutrient),
  }));

  const byType = (type: string) => instalasi.filter((i) => i.type === type).length;
  const totalSlots = instalasi.reduce((s, i) => s + (i.totalSlots ?? 0), 0);
  const totalNutrient = instalasi.reduce((s, i) => s + i.fixedCostNutrient, 0);

  const formatRp = (n: number) =>
    n > 0 ? `Rp ${n.toLocaleString("id-ID")}` : "—";

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[--c-primary]">
            Manajemen Instalasi
          </h2>
          <p className="text-[13px] text-[--c-secondary] mt-1">
            Rak, meja DFT/NFT, pipa jalur · Fixed Cost Nutrisi dibebankan ke HPP via jalur ABC
          </p>
        </div>
        <InstalasiActions mode="create" greenhouseList={greenhouseList} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary]">
              Total DFT
            </CardDescription>
            <CardTitle className="text-3xl text-[--c-primary]">
              {byType("DFT")}{" "}
              <span className="text-sm font-normal text-[--c-tertiary]">Instalasi</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary]">
              Total NFT
            </CardDescription>
            <CardTitle className="text-3xl text-[--c-primary]">
              {byType("NFT")}{" "}
              <span className="text-sm font-normal text-[--c-tertiary]">Instalasi</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary]">
              Total Slot Tanam
            </CardDescription>
            <CardTitle className="text-3xl text-[--c-primary]">
              {totalSlots.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-normal text-[--c-tertiary]">Lubang</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[13px] text-[--c-secondary] flex items-center gap-1">
              <Beaker className="w-3 h-3 opacity-60" /> Total Nutrisi/siklus
            </CardDescription>
            <CardTitle className="text-xl text-[--c-primary]">
              {formatRp(totalNutrient)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-[--s-l1] border-[--border-ui]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded flex items-center justify-center bg-[--c-primary]/10">
              <LayoutGrid className="h-4 w-4 text-[--c-primary]" />
            </div>
            <div>
              <CardTitle className="text-[16px] font-bold text-[--c-primary]">
                Daftar Instalasi Hidroponik
              </CardTitle>
              <CardDescription className="text-[12px] text-[--c-secondary] mt-0.5">
                Tiap instalasi membawa beban Fixed Cost Nutrisi yang akan ditarik otomatis saat HPP dihitung
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {instalasi.length === 0 ? (
            <div className="text-center py-14">
              <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-15" />
              <p className="text-[--c-secondary] text-sm">Belum ada instalasi terdaftar</p>
              <p className="text-[--c-tertiary] text-xs mt-1">
                Buat Greenhouse terlebih dahulu, lalu tambah instalasi di sini
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Instalasi</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Greenhouse</TableHead>
                    <TableHead>Slot Tanam</TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <Beaker className="w-3 h-3" /> Fixed Cost Nutrisi/siklus
                      </span>
                    </TableHead>
                    <TableHead>Batch Aktif</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instalasi.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="mono font-semibold text-[12px]">
                        {item.code}
                      </TableCell>
                      <TableCell className="font-semibold text-[13px] text-[--c-primary]">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={TYPE_VARIANT[item.type] ?? "default"}>
                          {TYPE_LABEL[item.type] ?? item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[13px] text-[--c-secondary]">
                        <span className="font-medium text-[--c-primary]">{item.greenhouse.code}</span>
                        {" · "}
                        {item.greenhouse.name}
                      </TableCell>
                      <TableCell className="text-[13px] text-[--c-secondary]">
                        {item.totalSlots ? (
                          <span className="flex items-center gap-1.5">
                            <GitMerge className="h-3 w-3 opacity-50" />
                            {item.totalSlots.toLocaleString("id-ID")} lubang
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: item.fixedCostNutrient > 0 ? "#2a7015" : undefined }}
                        >
                          {formatRp(item.fixedCostNutrient)}
                        </span>
                        {item.nutrientNotes && (
                          <p className="text-[11px] text-[--c-tertiary] mt-0.5">
                            {item.nutrientNotes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] text-[--c-secondary]">
                        {item._count.productionCycles} batch
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "poadminve" : "notice"} dot>
                          {item.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <InstalasiActions
                          mode="edit"
                          instalasi={item}
                          greenhouseList={greenhouseList}
                        />
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
