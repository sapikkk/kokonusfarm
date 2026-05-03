"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ShoppingCart,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
  Users,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Types
type OrderStatus = "DRAFT" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID"

interface SalesOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: string
  paidAmount: string
  customer?: { id: string; name: string; phone?: string } | null
  items: {
    id: string
    quantity: string
    unitPrice: string
    totalPrice: string
    inventoryItem: { id: string; name: string; unit: string }
  }[]
  deliveries: { status: string; createdAt: string }[]
  createdAt: string
}

interface Customer {
  id: string
  name: string
  phone?: string
  type: string
}

interface InventoryItem {
  id: string
  name: string
  unit: string
  currentStock: string
  unitPrice: string
}

// ── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  DRAFT:     { label: "Draft",     className: "bg-gray-100 text-gray-700 border-gray-200" },
  CONFIRMED: { label: "Dikonfirmasi", className: "bg-blue-100 text-blue-700 border-blue-200" },
  PACKED:    { label: "Dikemas",   className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  SHIPPED:   { label: "Dikirim",   className: "bg-amber-100 text-amber-700 border-amber-200" },
  DELIVERED: { label: "Terkirim",  className: "bg-green-100 text-green-700 border-green-200" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700 border-red-200" },
}

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  UNPAID:  { label: "Belum Bayar", className: "bg-red-100 text-red-700" },
  PARTIAL: { label: "Sebagian",    className: "bg-amber-100 text-amber-700" },
  PAID:    { label: "Lunas",       className: "bg-green-100 text-green-700" },
}

// ── Buat SO Dialog ────────────────────────────────────────────────────────────
function CreateSODialog({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("__none__")
  const [notes, setNotes] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  const [costDelivery, setCostDelivery] = useState("0")
  const [items, setItems] = useState([{ inventoryItemId: "", quantity: "1", unitPrice: "0" }])

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch("/api/customers").then((r) => r.json()),
        fetch("/api/inventory").then((r) => r.json()),
      ]).then(([c, i]) => {
        setCustomers(Array.isArray(c) ? c : [])
        setInventory(Array.isArray(i) ? i.filter((item: InventoryItem) => Number(item.currentStock) > 0) : [])
      })
    }
  }, [open])

  const addItem = () =>
    setItems((prev) => [...prev, { inventoryItemId: "", quantity: "1", unitPrice: "0" }])

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx))

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      // Auto-fill harga dari inventory
      if (field === "inventoryItemId") {
        const found = inventory.find((i) => i.id === value)
        if (found) next[idx].unitPrice = Number(found.unitPrice).toString()
      }
      return next
    })
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.quantity || "0") * parseFloat(item.unitPrice || "0"),
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer === "__none__" ? null : selectedCustomer,
          items,
          notes,
          shippingAddress,
          costDelivery: parseFloat(costDelivery),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Gagal membuat SO")
        return
      }
      setOpen(false)
      onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" style={{ background: "var(--botanical-600, #2a7015)", color: "white" }}>
          <Plus className="h-4 w-4" />
          Buat Sales Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Sales Order Baru</DialogTitle>
          <DialogDescription>Isi detail pesanan penjualan</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pelanggan */}
          <div className="space-y-1">
            <Label>Pelanggan (opsional)</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pelanggan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Tanpa pelanggan —</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item Produk */}
          <div className="space-y-2">
            <Label>Item Produk</Label>
            {items.map((item, idx) => {
              const selectedItem = inventory.find((i) => i.id === item.inventoryItemId)
              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg border bg-muted/30">
                  <div className="col-span-5">
                    <Select
                      value={item.inventoryItemId}
                      onValueChange={(v) => updateItem(idx, "inventoryItemId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name} (stok: {Number(i.currentStock).toLocaleString("id-ID")} {i.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Harga/unit"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 text-xs text-muted-foreground text-right">
                    {selectedItem?.unit ?? ""}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Item
            </Button>
          </div>

          {/* Total + Ongkir */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Ongkos Kirim (Rp)</Label>
              <Input
                type="number"
                value={costDelivery}
                onChange={(e) => setCostDelivery(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">Total Pesanan</p>
              <p className="text-2xl font-bold text-botanical-600">
                {formatCurrency(totalAmount + parseFloat(costDelivery || "0"))}
              </p>
            </div>
          </div>

          {/* Alamat & Catatan */}
          <div className="space-y-1">
            <Label>Alamat Pengiriman</Label>
            <Input
              placeholder="Masukkan alamat pengiriman..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Catatan</Label>
            <Textarea
              placeholder="Catatan tambahan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Draft SO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Action Buttons per SO ─────────────────────────────────────────────────────
function ActionButton({
  order,
  onUpdated,
}: {
  order: SalesOrder
  onUpdated: () => void
}) {
  const [loading, setLoading] = useState(false)

  const doAction = async (action: string, notes?: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sales-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes, deliveryNotes: notes }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Gagal melakukan aksi")
        return
      }
      onUpdated()
    } finally {
      setLoading(false)
    }
  }

  if (order.status === "DRAFT") {
    return (
      <Button
        size="sm"
        disabled={loading}
        onClick={() => {
          if (confirm(`Konfirmasi SO ${order.orderNumber}? Stok akan langsung dikurangi.`)) {
            doAction("CONFIRM")
          }
        }}
        className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        Konfirmasi
      </Button>
    )
  }
  if (order.status === "CONFIRMED" || order.status === "PACKED") {
    return (
      <Button
        size="sm"
        disabled={loading}
        onClick={() => doAction("SHIP", "Barang sedang dalam pengiriman")}
        className="gap-1 bg-amber-600 hover:bg-amber-700 text-white"
      >
        <Truck className="h-3.5 w-3.5" />
        Kirim
      </Button>
    )
  }
  if (order.status === "SHIPPED") {
    return (
      <Button
        size="sm"
        disabled={loading}
        onClick={() => doAction("DELIVER", "Barang diterima pelanggan")}
        className="gap-1 bg-green-600 hover:bg-green-700 text-white"
      >
        <PackageCheck className="h-3.5 w-3.5" />
        Terima
      </Button>
    )
  }
  return null
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSalesPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [search, setSearch] = useState("")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus !== "ALL") params.set("status", filterStatus)
    const res = await fetch(`/api/sales-orders?${params}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [filterStatus])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.customer?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((s, o) => s + Number(o.totalAmount), 0)

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Penjualan</h2>
          <p className="text-muted-foreground">Kelola Sales Order dari draft hingga pengiriman</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <CreateSODialog onCreated={fetchOrders} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {(["DRAFT", "CONFIRMED", "SHIPPED", "DELIVERED"] as OrderStatus[]).map((s) => {
          const count = orders.filter((o) => o.status === s).length
          const cfg = STATUS_CONFIG[s]
          return (
            <Card key={s} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus(s)}>
              <CardHeader className="pb-2">
                <CardDescription>{cfg.label}</CardDescription>
                <p className="text-3xl font-bold">{count}</p>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Revenue Summary */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "rgba(159,232,112,0.08)", border: "1px solid rgba(159,232,112,0.25)" }}>
        <div>
          <p className="text-sm font-medium text-botanical-700">Total Pendapatan Terkonfirmasi</p>
          <p className="text-xs text-muted-foreground">Dari SO berstatus DELIVERED</p>
        </div>
        <p className="text-2xl font-bold text-botanical-700">{formatCurrency(totalRevenue)}</p>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Daftar Sales Order
          </CardTitle>
          <div className="flex gap-3 mt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Cari nomor SO atau pelanggan..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Belum ada Sales Order</p>
              <p className="text-xs mt-1">Klik &quot;Buat Sales Order&quot; untuk memulai</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. SO</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold text-sm">{order.orderNumber}</TableCell>
                    <TableCell>
                      {order.customer ? (
                        <div>
                          <p className="font-medium text-sm">{order.customer.name}</p>
                          {order.customer.phone && (
                            <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">Tanpa pelanggan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-xs">
                            {Number(item.quantity).toLocaleString("id-ID")} {item.inventoryItem.unit} {item.inventoryItem.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{order.items.length - 2} item lainnya</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(Number(order.totalAmount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_CONFIG[order.status].className}>
                        {STATUS_CONFIG[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={PAYMENT_CONFIG[order.paymentStatus].className}>
                        {PAYMENT_CONFIG[order.paymentStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <ActionButton order={order} onUpdated={fetchOrders} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
