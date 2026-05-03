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
import { Plus, FileText } from "lucide-react"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"

async function getJournalData() {
  const transactions = await prisma.transaction.findMany({
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
    take: 50,
  })

  return { transactions }
}

export default async function AdminJournalPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const data = await getJournalData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pusat Jurnal</h2>
          <p className="text-muted-foreground">
            Kelola dan verifikasi semua transaksi akuntansi
          </p>
        </div>
        <Button variant="botanical">
          <Plus className="mr-2 h-4 w-4" />
          Transaksi Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>
            Semua transaksi yang telah dicatat dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Referensi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Oleh</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada transaksi</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.transactions.map((transaction) => {
                  const totalDebit = transaction.journalLines.reduce(
                    (sum, line) => sum + parseFloat(line.debit.toString()),
                    0
                  )
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {formatDate(transaction.date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {transaction.reference || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.user.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(totalDebit)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Detail
                        </Button>
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
