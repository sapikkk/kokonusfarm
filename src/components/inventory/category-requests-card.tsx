"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, ClipboardList, Loader2, AlertCircle } from "lucide-react"

interface CategoryRequest {
  id: string
  name: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  requestedBy: {
    name: string
    email: string
  }
}

export function CategoryRequestsCard() {
  const router = useRouter()
  const [requests, setRequests] = useState<CategoryRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  async function fetchRequests() {
    try {
      const res = await fetch("/api/inventory/categories/requests")
      if (res.ok) {
        const data = await res.json()
        // Only show pending ones
        setRequests(data.filter((r: CategoryRequest) => r.status === "PENDING"))
      }
    } catch (err) {
      console.error("Error loading requests:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleDecision(id: string, status: "APPROVED" | "REJECTED") {
    setActioningId(id)
    try {
      const res = await fetch(`/api/inventory/categories/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        // Refresh local list
        setRequests(prev => prev.filter(r => r.id !== id))
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Gagal memproses persetujuan")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan koneksi")
    } finally {
      setActioningId(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) return null

  return (
    <Card className="border-yellow-200/60 dark:border-yellow-900/40 bg-yellow-50/20 dark:bg-yellow-950/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-yellow-100 dark:bg-yellow-950">
            <ClipboardList className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-base text-yellow-800 dark:text-yellow-300">Persetujuan Kategori Baru</CardTitle>
            <CardDescription className="text-yellow-700/80 dark:text-yellow-400/80">
              Pekerja mengajukan kategori berikut. Setujui agar dapat digunakan dalam pencatatan inventaris.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-yellow-900/70 dark:text-yellow-400/70">Nama Kategori</TableHead>
              <TableHead className="text-yellow-900/70 dark:text-yellow-400/70">Diajukan Oleh</TableHead>
              <TableHead className="text-yellow-900/70 dark:text-yellow-400/70">Tanggal</TableHead>
              <TableHead className="text-right text-yellow-900/70 dark:text-yellow-400/70">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-semibold text-foreground">
                  {req.name}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{req.requestedBy.name}</p>
                  <p className="text-xs text-muted-foreground">{req.requestedBy.email}</p>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/20"
                      disabled={actioningId !== null}
                      onClick={() => handleDecision(req.id, "REJECTED")}
                    >
                      {actioningId === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={actioningId !== null}
                      onClick={() => handleDecision(req.id, "APPROVED")}
                    >
                      {actioningId === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                      Setujui
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
