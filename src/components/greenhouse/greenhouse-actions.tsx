"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Settings2, Loader2, Zap } from "lucide-react";
import { createGreenhouse, updateGreenhouse, deleteGreenhouse } from "./actions";

type GreenhouseData = {
  id: string;
  code: string;
  name: string;
  location: string | null;
  area: number | null;
  fixedCostElectricity: number;
  electricityNotes: string | null;
  isActive: boolean;
};

type Props =
  | { mode: "create" }
  | { mode: "edit"; greenhouse: GreenhouseData };

export function GreenhouseActions(props: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = props.mode === "edit";
  const gh = isEdit ? props.greenhouse : null;

  const [code, setCode] = useState(gh?.code ?? "");
  const [name, setName] = useState(gh?.name ?? "");
  const [location, setLocation] = useState(gh?.location ?? "");
  const [area, setArea] = useState(gh?.area?.toString() ?? "");
  const [electricity, setElectricity] = useState(
    gh?.fixedCostElectricity?.toString() ?? "0"
  );
  const [elecNotes, setElecNotes] = useState(gh?.electricityNotes ?? "");
  const [isActive, setIsActive] = useState(gh?.isActive ?? true);

  function handleOpen(val: boolean) {
    if (!val) {
      // reset on close for create mode
      if (!isEdit) {
        setCode(""); setName(""); setLocation("");
        setArea(""); setElectricity("0"); setElecNotes("");
        setIsActive(true);
      }
    }
    setOpen(val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        code,
        name,
        location: location || undefined,
        area: area ? parseFloat(area) : null,
        fixedCostElectricity: parseFloat(electricity) || 0,
        electricityNotes: elecNotes || undefined,
        isActive,
      };
      const res = isEdit && gh
        ? await updateGreenhouse(gh.id, payload)
        : await createGreenhouse(payload);
      
      if (res && !res.success) {
        alert(res.error);
        return;
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!gh) return;
    const ok = confirm(`Apakah Anda yakin ingin menghapus greenhouse "${gh.name}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteGreenhouse(gh.id);
      if (res && !res.success) {
        alert(res.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="secondary" size="sm" className="h-7 text-[11px] gap-1">
            <Settings2 className="w-3 h-3" /> Kelola
          </Button>
        ) : (
          <Button variant="default">
            <Plus className="mr-2 w-[15px] h-[15px]" /> Tambah Greenhouse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit: ${gh?.name}` : "Tambah Greenhouse Baru"}
          </DialogTitle>
          <DialogDescription>
            Greenhouse menanggung <strong>Fixed Cost Listrik</strong> yang akan
            ditarik otomatis saat admin menetapkan HPP batch panen.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gh-code">Kode *</Label>
              <Input
                id="gh-code"
                placeholder="GH-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gh-area">Luas (m²)</Label>
              <Input
                id="gh-area"
                type="number"
                placeholder="200"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gh-name">Nama Greenhouse *</Label>
            <Input
              id="gh-name"
              placeholder="Greenhouse Utama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gh-loc">Lokasi</Label>
            <Input
              id="gh-loc"
              placeholder="Blok Utara, Area A"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Fixed Cost Listrik */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,210,63,0.07)", border: "1px solid rgba(255,210,63,0.25)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" style={{ color: "#c8920a" }} />
              <span className="text-[13px] font-semibold">Fixed Cost Listrik / bulan</span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gh-elec">Tagihan Listrik (Rp)</Label>
              <Input
                id="gh-elec"
                type="number"
                placeholder="0"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gh-elec-notes">Keterangan</Label>
              <Input
                id="gh-elec-notes"
                placeholder="Contoh: Tagihan PLN Sep 2024"
                value={elecNotes}
                onChange={(e) => setElecNotes(e.target.value)}
              />
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-[--s-l2]">
              <Label htmlFor="gh-active" className="cursor-pointer">Status Aktif</Label>
              <Switch
                id="gh-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 w-full">
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="sm:mr-auto"
              >
                Hapus
              </Button>
            )}
            <div className="flex gap-2 justify-end sm:ml-auto">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Simpan Perubahan" : "Buat Greenhouse"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
