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
import { Package, AlertCircle } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { InventoryDetailDialog } from "@/components/inventory/inventory-detail-dialog"
import { NewItemDialog } from "@/components/inventory/new-item-dialog"
import { UpdateItemDialog } from "@/components/inventory/update-item-dialog"
import { ActivePackManagerDialog } from "@/components/inventory/active-pack-manager-dialog"

async function getInventoryData() {
  const items = await prisma.inventoryItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      inventoryLogs: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      }
    }
  })

  const lowStockItems = items.filter(item => 
    parseFloat(item.currentStock.toString()) <= parseFloat(item.minStock.toString())
  )

  // Group by category
  const groupedItems = {
    NUTRISI: items.filter(i => i.category === "NUTRISI"),
    MEDIA: items.filter(i => i.category === "MEDIA"),
    BENIH: items.filter(i => i.category === "BENIH"),
    KEMASAN: items.filter(i => i.category === "KEMASAN"),
    ALAT: items.filter(i => i.category === "ALAT"),
    LAINNYA: items.filter(i => i.category === "LAINNYA"),
  }

  return { items, lowStockItems, groupedItems }
}

const categoryLabels: Record<string, string> = {
  NUTRISI: "Nutrisi",
  MEDIA: "Media Tanam",
  BENIH: "Benih",
  KEMASAN: "Kemasan",
  ALAT: "Alat",
  LAINNYA: "Lain-lain",
}

export default async function WorkerInventoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }

  const data = await getInventoryData()

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Inventaris</h2>
          <p className="text-muted-foreground">
            Pantau stok dan kelola barang inventaris
          </p>
        </div>
        <NewItemDialog />
      </div>

      {/* Low Stock Alert */}
      {data.lowStockItems.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,95,95,0.07)', border: '1px solid rgba(255,95,95,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,95,95,0.15)' }}>
              <AlertCircle className="h-4 w-4" style={{ color: '#FF5F5F' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#FF5F5F' }}>Peringatan Stok</p>
              <p className="text-xs" style={{ color: '#7B7B7B' }}>{data.lowStockItems.length} item memerlukan pengisian ulang</p>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {data.lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-[#0A3D35] border"
                style={{ borderColor: 'rgba(255,95,95,0.2)' }}
              >
                <div>
                  <p className="font-medium text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Stok: {formatNumber(item.currentStock.toString())} {item.unit}
                  </p>
                </div>
                {parseFloat(item.currentStock.toString()) <= 0 ? (
                  <Badge variant="destructive">Habis</Badge>
                ) : (
                  <Badge variant="warning">Rendah</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory by Category */}
      {Object.entries(data.groupedItems).map(([category, items]) => {
        if (items.length === 0) return null
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{categoryLabels[category]}</CardTitle>
              <CardDescription>
                {items.length} item dalam kategori ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Stok Saat Ini</TableHead>
                    <TableHead>Min. Stok</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const current = parseFloat(item.currentStock.toString())
                    const minimum = parseFloat(item.minStock.toString())
                    const isZero = current <= 0
                    const isLow = current > 0 && current <= minimum
                    const percentage = (current / minimum) * 100
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">
                          {item.code}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={isLow ? "font-medium" : ""} style={{ color: isLow ? '#FF5F5F' : undefined }}>
                              {formatNumber(current)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatNumber(minimum)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.unit}</Badge>
                        </TableCell>
                        <TableCell>
                          {isZero ? (
                            <Badge variant="destructive">Habis</Badge>
                          ) : isLow ? (
                            <Badge variant="warning">Rendah</Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-end">
                            {(category === "BENIH" || category === "MEDIA") && (
                              <ActivePackManagerDialog 
                                itemId={item.id} 
                                itemName={item.name} 
                                currentStock={current} 
                                category={category}
                              />
                            )}
                            <InventoryDetailDialog item={item} />
                            <UpdateItemDialog item={item} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}

      {data.items.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Belum ada data inventaris</p>
              <p className="text-sm">Mulai dengan menambahkan item pertama Anda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
