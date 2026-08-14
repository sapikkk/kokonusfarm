import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PackageSearch, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { GoodsReceiptDialog } from "@/components/inventory/goods-receipt-dialog"
import { DeleteInventoryButton } from "@/components/inventory/delete-inventory-button"
import { ActivePackManagerDialog } from "@/components/inventory/active-pack-manager-dialog"
import { CategoryRequestsCard } from "@/components/inventory/category-requests-card"

async function getInventory() {
  return prisma.inventoryItem.findMany({
    where: { isActive: true },
    orderBy: {
      category: 'asc'
    }
  })
}

export default async function AdminInventoryPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    redirect("/")
  }

  const inventory = await getInventory()

  const formatRp = (n: any) => `Rp ${Number(n).toLocaleString('id-ID')}`

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Gudang</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Kelola stok persediaan raw material dan otomatisasi Base Unit
          </p>
        </div>
      </div>

      <CategoryRequestsCard />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[#062F28]/10 dark:bg-[#9FE870]/15">
              <PackageSearch className="h-4 w-4 text-[#062F28] dark:text-[#9FE870]" />
            </div>
            <div>
              <CardTitle className="text-base">Daftar Aset Gudang (Raw Material)</CardTitle>
              <CardDescription>Barang yang dihitung di sini menggunakan Base Unit (Unit Terkecil).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode / Item</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Aktual</TableHead>
                <TableHead>Harga Rata-Rata (Moving Average)</TableHead>
                <TableHead>Nilai Aset</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>Belum ada data barang di database Anda.</p>
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => {
                  const qty = Number(item.currentStock)
                  const min = Number(item.minStock)
                  const price = Number(item.unitPrice)
                  const total = qty * price

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.code}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`font-medium ${qty <= min ? 'text-red-500' : ''}`}>
                            {qty.toLocaleString('id-ID')} {item.unit}
                          </span>
                          {qty <= min && min > 0 && (
                            <span className="text-[10px] text-red-500 font-semibold uppercase">Restock Needed</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatRp(price)} <span className="text-muted-foreground text-xs font-normal">/ {item.unit}</span>
                      </TableCell>
                      <TableCell className="font-semibold text-[#2a7015]">
                        {formatRp(total)}
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex items-center justify-end gap-1">
                           {(item.category === "BENIH" || item.category === "MEDIA") && (
                             <ActivePackManagerDialog 
                               itemId={item.id} 
                               itemName={item.name} 
                               currentStock={qty}
                               category={item.category}
                             />
                           )}
                           <GoodsReceiptDialog item={{
                               id: item.id,
                               name: item.name,
                               unit: item.unit,
                               currentStock: Number(item.currentStock),
                               unitPrice: Number(item.unitPrice)
                           }} />
                           <DeleteInventoryButton itemId={item.id} itemName={item.name} showLabel={false} />
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
