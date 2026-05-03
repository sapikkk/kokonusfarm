"use client";

import { useState, useTranadminon } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Layers, Loader2, Beaker } from "lucide-react";
import { createInstallation, updateInstallation, type InstallationType } from "./actions";

type GreenhouseOption = { id: string; code: string; name: string };

type InstalasiData = {
  id: string;
  code: string;
  name: string;
  type: string;
  greenhouseId: string;
  totalSlots: number | null;
  fixedCostNutrient: number;
  nutrientNotes: string | null;
  isActive: boolean;
};

type Props =
  | { mode: "create"; greenhouseList: GreenhouseOption[] }
  | { mode: "edit"; instalasi: InstalasiData; greenhouseList: GreenhouseOption[] };

const TYPES: { value: InstallationType; label: string }[] = [
  { value: "SEMAI_TRAY", label: "Rak Semai / Tray" },
  { value: "DFT", label: "DFT — Deep Flow Technique" },
  { value: "NFT", label: "NFT — Nutrient Film Technique" },
  { value: "DWC", label: "DWC — Deep Water Culture" },
  { value: "WICK", label: "Wick System" },
];

export function InstalasiActions(props: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTranadminon] = useTranadminon();

  const isEdit = props.mode === "edit";
  const inst = isEdit ? props.instalasi : null;

  const [code, setCode] = useState(inst?.code ?? "");
  const [name, setName] = useState(inst?.name ?? "");
  const [type, setType] = useState<InstallationType>(
    (inst?.type as InstallationType) ?? "DFT"
  );
  const [greenhouseId, setGreenhouseId] = useState(inst?.greenhouseId ?? "");
  const [slots, setSlots] = useState(inst?.totalSlots?.toString() ?? "");
  const [nutrient, setNutrient] = useState(inst?.fixedCostNutrient?.toString() ?? "0");
  const [nutrientNotes, setNutrientNotes] = useState(inst?.nutrientNotes ?? "");
  const [isActive, setIsActive] = useState(inst?.isActive ?? true);

  function handleOpen(val: boolean) {
    if (!val && !isEdit) {
      setCode(""); setName(""); setType("DFT");
      setGreenhouseId(""); setSlots("");
      setNutrient("0"); setNutrientNotes(""); setIsActive(true);
    }
    setOpen(val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTranadminon(async () => {
      const payload = {
        code,
        name,
        type,
        greenhouseId,
        totalSlots: slots ? parseInt(slots) : null,
        fixedCostNutrient: parseFloat(nutrient) || 0,
        nutrientNotes: nutrientNotes || undefined,
        isActive,
      };
      if (isEdit && inst) {
        await updateInstallation(inst.id, payload);
      } else {
        await createInstallation(payload);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="secondary" size="sm" className="h-7 text-[11px] gap-1">
            <Layers className="w-3 h-3" /> Edit
          </Button>
        ) : (
          <Button variant="default">
            <Plus className="mr-2 w-[15px] h-[15px]" /> Tambah Instalasi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit: ${inst?.name}` : "Tambah Instalasi Baru"}
          </DialogTitle>
          <DialogDescription>
            Instalasi menanggung <strong>Fixed Cost Nutrisi</strong> per tandon
            yang ditarik otomatis ke HPP batch yang ditempatkan di sini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inst-code">Kode *</Label>
              <Input
                id="inst-code"
                placeholder="INST-A1"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-slots">Total Slot / Lubang</Label>
              <Input
                id="inst-slots"
                type="number"
                placeholder="500"
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inst-name">Nama Instalasi *</Label>
            <Input
              id="inst-name"
              placeholder="Meja DFT A1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inst-type">Tipe Sistem *</Label>
              <Select value={type} onValueChange={(v) => setType(v as InstallationType)}>
                <SelectTrigger id="inst-type">
                  <SelectValue placeholder="Pilih tipe..." />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-gh">Greenhouse *</Label>
              <Select value={greenhouseId} onValueChange={setGreenhouseId}>
                <SelectTrigger id="inst-gh">
                  <SelectValue placeholder="Pilih greenhouse..." />
                </SelectTrigger>
                <SelectContent>
                  {props.greenhouseList.map((gh) => (
                    <SelectItem key={gh.id} value={gh.id}>
                      {gh.code} · {gh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fixed Cost Nutrisi */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(159,232,112,0.06)", border: "1px solid rgba(159,232,112,0.2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Beaker className="w-4 h-4" style={{ color: "#2a7015" }} />
              <span className="text-[13px] font-semibold">Fixed Cost Nutrisi / siklus</span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-nutrient">Biaya Nutrisi Tandon (Rp)</Label>
              <Input
                id="inst-nutrient"
                type="number"
                placeholder="0"
                value={nutrient}
                onChange={(e) => setNutrient(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-nutrient-notes">Keterangan</Label>
              <Input
                id="inst-nutrient-notes"
                placeholder="Contoh: AB Mix 10L per siklus"
                value={nutrientNotes}
                onChange={(e) => setNutrientNotes(e.target.value)}
              />
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-[--s-l2]">
              <Label htmlFor="inst-active" className="cursor-pointer">Status Aktif</Label>
              <Switch
                id="inst-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending || !greenhouseId}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Buat Instalasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
