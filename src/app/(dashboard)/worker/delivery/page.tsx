"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Truck,
  PackageCheck,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type OrderStatus = "DRAFT" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED"

interface SalesOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: string
  shippingAddress?: string
  customer?: { name: string; phone?: string } | null
  items: {
    id: string
    quantity: string
    inventoryItem: { name: string; unit: string }
  }[]
  deliveries: {
    id: string
    status: string
    notes?: string
    deliveryDate?: string
    createdAt: string
    kurir?: { name: string } | null
  }[]
  createdAt: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  DRAFT:     { label: "Draft",      className: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "Dikonfirmasi", className: "bg-blue-100 text-blue-700" },
  PACKED:    { label: "Dikemas",    className: "bg-indigo-100 text-indigo-700" },
  SHIPPED:   { label: "Dikirim",    className: "bg-amber-100 text-amber-700" },
  DELIVERED: { label: "Terkirim",   className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
}

// ── Update Delivery Dialog ────────────────────────────────────────────────────
function UpdateDeliveryDialog({
  order,
  onUpdated,
}: {
  order: SalesOrder
  onUpdated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const nextAction = order.status === "CONFIRMED" || order.status === "PACKED" ? "SHIP" : "DELIVER"
  const nextLabel = nextAction === "SHIP" ? "Tandai Dikirim" : "Tandai Diterima"
  const nextIcon = nextAction === "SHIP" ? <Truck className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sales-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextAction, deliveryNotes: notes }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error)
        return
      }
      setOpen(false)
      setNotes("")
      onUpdated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        className={`gap-1 ${nextAction === "SHIP" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"} text-white`}
        onClick={() => setOpen(true)}
      >
        {nextIcon}
        {nextLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{nextLabel}</DialogTitle>
            <DialogDescription>
              SO {order.orderNumber} — {order.customer?.name ?? "Tanpa pelanggan"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {order.shippingAddress && (
              <div className="flex gap-2 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm">{order.shippingAddress}</p>
              </div>
            )}
            <div>
              <Label>Catatan Pengiriman (opsional)</Label>
              <Textarea
                placeholder="Misal: Barang diterima oleh Bpk. Ahmad..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : nextLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkerDeliveryPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    // Ambil SO yang perlu tindakan pengiriman (CONFIRMED, PACKED, SHIPPED)
    const res = await fetch("/api/sales-orders")
    const data = await res.json()
    const relevant = (Array.isArray(data) ? data : []).filter((o: SalesOrder) =>
      ["CONFIRMED", "PACKED", "SHIPPED"].includes(o.status)
    )
    setOrders(relevant)
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.customer?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const shipping = orders.filter((o) => o.status === "SHIPPED").length
  const confirmed = orders.filter((o) => o.status === "CONFIRMED" || o.status === "PACKED").length

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pengiriman</h2>
          <p className="text-muted-foreground">Update status pengiriman pesanan pelanggan</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Siap Dikirim</CardDescription>
            <div className="text-4xl font-bold text-blue-600">{confirmed}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">SO sudah dikonfirmasi Admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sedang Dikirim</CardDescription>
            <div className="text-4xl font-bold text-amber-600">{shipping}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Menunggu konfirmasi diterima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Perlu Tindakan</CardDescription>
            <div className="text-4xl font-bold">{orders.length}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">SO aktif hari ini</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Daftar Pengiriman
          </CardTitle>
          <div className="relative max-w-sm">
            <Input
              placeholder="Cari nomor SO atau pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20 text-green-500" />
              <p className="font-medium">Semua pengiriman selesai!</p>
              <p className="text-xs mt-1">Tidak ada SO yang perlu tindakan saat ini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
                        <Badge className={STATUS_CONFIG[order.status].className} variant="outline">
                          {STATUS_CONFIG[order.status].label}
                        </Badge>
                      </div>

                      {order.customer && (
                        <p className="text-sm font-medium">{order.customer.name}
                          {order.customer.phone && (
                            <span className="text-muted-foreground font-normal"> · {order.customer.phone}</span>
                          )}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <span key={item.id} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {Number(item.quantity).toLocaleString("id-ID")} {item.inventoryItem.unit} {item.inventoryItem.name}
                          </span>
                        ))}
                      </div>

                      {order.shippingAddress && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {order.shippingAddress}
                        </div>
                      )}

                      {/* Riwayat status terkini */}
                      {order.deliveries[0] && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {order.deliveries[0].notes} ·{" "}
                          {new Date(order.deliveries[0].createdAt).toLocaleString("id-ID")}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold">{formatCurrency(Number(order.totalAmount))}</p>
                      {(order.status === "CONFIRMED" || order.status === "PACKED" || order.status === "SHIPPED") && (
                        <UpdateDeliveryDialog order={order} onUpdated={fetchOrders} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
