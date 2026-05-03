"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface DeleteInventoryButtonProps {
  itemId: string
  itemName: string
  /** Tampilkan tombol dengan label teks "Hapus" agar lebih jelas */
  showLabel?: boolean
}

export function DeleteInventoryButton({ itemId, itemName, showLabel = false }: DeleteInventoryButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error ?? "Gagal menghapus item. Silakan coba lagi.")
      }
    } catch {
      alert("Terjadi kesalahan jaringan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {showLabel ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:border-red-900 dark:hover:bg-red-950/40 dark:text-red-400"
            disabled={loading}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:border-red-900 dark:hover:bg-red-950/40 dark:text-red-400"
            disabled={loading}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Item Inventaris?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus <span className="font-semibold text-foreground">&quot;{itemName}&quot;</span> dari daftar inventaris.
            Tindakan ini tidak dapat dibatalkan. Riwayat log barang juga akan terhapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
