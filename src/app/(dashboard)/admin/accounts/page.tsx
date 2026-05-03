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
import { Plus, BookOpen } from "lucide-react"

async function getAccountsData() {
  const accounts = await prisma.account.findMany({
    orderBy: {
      code: "asc",
    },
  })

  // Group by account type
  const groupedAccounts = {
    ASSET: accounts.filter(a => a.type === "ASSET"),
    LIABILITY: accounts.filter(a => a.type === "LIABILITY"),
    EQUITY: accounts.filter(a => a.type === "EQUITY"),
    REVENUE: accounts.filter(a => a.type === "REVENUE"),
    EXPENSE: accounts.filter(a => a.type === "EXPENSE"),
  }

  return { accounts, groupedAccounts }
}

const typeLabels: Record<string, string> = {
  ASSET: "Aset",
  LIABILITY: "Kewajiban",
  EQUITY: "Modal",
  REVENUE: "Pendapatan",
  EXPENSE: "Beban",
}

const typeBadgeVariants: Record<string, "poadminve" | "negative" | "default" | "blue" | "notice"> = {
  ASSET: "poadminve",
  LIABILITY: "negative",
  EQUITY: "default",
  REVENUE: "blue",
  EXPENSE: "notice",
}

export default async function AdminAccountsPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const data = await getAccountsData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[--c-primary]">Bagan Akun</h2>
          <p className="text-[13px] text-[--c-secondary] mt-1">
            Kelola struktur akun akuntansi (Chart of Accounts)
          </p>
        </div>
        <Button variant="default">
          <Plus className="mr-2 w-[15px] h-[15px]" />
          Akun Baru
        </Button>
      </div>

      {Object.entries(data.groupedAccounts).map(([type, accounts]) => (
        <Card key={type} className="bg-[--s-l1] border-[--border-ui]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[18px] font-bold text-[--c-primary]">{typeLabels[type]}</CardTitle>
                <CardDescription className="text-[13px] text-[--c-secondary] mt-1">
                  {accounts.length} akun terdaftar
                </CardDescription>
              </div>
              <Badge variant={typeBadgeVariants[type]}>
                {type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-[--c-tertiary]">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-[13px]">Belum ada akun dalam kategori ini</p>
              </div>
            ) : (
              <div className="table-wrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Akun</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="mono font-semibold text-[13px]">
                          {account.code}
                        </TableCell>
                        <TableCell className="font-semibold text-[13px] text-[--c-primary]">
                          {account.name}
                        </TableCell>
                        <TableCell className="text-[12px] text-[--c-secondary]">
                          {account.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.isActive ? "poadminve" : "default"} dot>
                            {account.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
