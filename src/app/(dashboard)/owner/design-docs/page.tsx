"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsListUnderline, TabsTriggerUnderline } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress, CircularProgress } from "@/components/ui/progress"
import { Spinner, DotsLoader } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Tag } from "@/components/ui/tag"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Pagination, PageButton, PageDots } from "@/components/ui/pagination"
import { Toast, ToastBody, ToastTitle, ToastMessage, ToastStack } from "@/components/ui/toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { StatCard, ContentCard } from "@/components/ui/stat-card"
import { Display, H1, H2, H3, H4, Body, TextSmall, Caption, Overline, Code, TypeRow } from "@/components/ui/typography"
import { ListCard, ListItem, ListItemContent, ListItemTitle, ListItemSub, ListItemRight, ListItemAmount, ListItemTime } from "@/components/ui/list-item"
import { BarChart, DonutChart, DonutLegend, DonutLegendItem, Sparkline } from "@/components/ui/chart"
import { Paintbrush, MoreHorizontal, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronRight, Download, Settings, Plus, ArrowRight, Bell, Search, Pin, Mail, User } from "lucide-react"

/* ─── Section Header ─── */
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-[10px] mb-6 pb-[14px] border-b border-[--border-ui]">
      <span className="section-num">{num}</span>
      <h2 className="text-[22px] font-bold tracking-[-0.03em]">{title}</h2>
    </div>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[--c-tertiary] mb-[10px]">{children}</div>
}

export default function DesignDocsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [ulTab, setUlTab] = useState("semua")
  const [rangeVal, setRangeVal] = useState(70)

  const sections = [
    { id: "s01", num: "01", label: "Typography", group: "Foundations" },
    { id: "s02", num: "02", label: "Buttons", group: "Foundations" },
    { id: "s03", num: "03", label: "Form Elements", group: "Foundations" },
    { id: "s04", num: "04", label: "Badges & Tags", group: "Foundations" },
    { id: "s05", num: "05", label: "Cards", group: "Components" },
    { id: "s06", num: "06", label: "Alerts", group: "Components" },
    { id: "s07", num: "07", label: "Tables", group: "Components" },
    { id: "s08", num: "08", label: "Progress & Loading", group: "Components" },
    { id: "s09", num: "09", label: "Avatars", group: "Components" },
    { id: "s10", num: "10", label: "Tabs", group: "Navigation" },
    { id: "s11", num: "11", label: "Breadcrumb", group: "Navigation" },
    { id: "s12", num: "12", label: "Pagination", group: "Navigation" },
    { id: "s13", num: "13", label: "Toast", group: "Navigation" },
    { id: "s14", num: "14", label: "Modal", group: "Navigation" },
    { id: "s15", num: "15", label: "Dropdown", group: "Navigation" },
    { id: "s16", num: "16", label: "Tooltip", group: "Navigation" },
    { id: "s17", num: "17", label: "Charts", group: "Navigation" },
    { id: "s18", num: "18", label: "List Items", group: "Navigation" },
  ]

  const groups = Array.from(new Set(sections.map(s => s.group)))

  const barValues = [45, 72, 58, 90, 63, 38, 81]
  const barMax = Math.max(...barValues)
  const barDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  const spark1 = Array.from({ length: 20 }, () => 20 + Math.random() * 80)
  const spark2 = Array.from({ length: 20 }, () => 20 + Math.random() * 80)
  const spark3 = Array.from({ length: 20 }, () => 20 + Math.random() * 80)
  const sparkMax = (arr: number[]) => Math.max(...arr)

  return (
    <div className="flex gap-0">
      {/* ──────── INLINE SIDEBAR NAV ──────── */}
      <aside className="hidden xl:flex flex-col w-[200px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto py-4 pr-4 custom-scrollbar border-r border-[--border-ui]">
        {groups.map(g => (
          <div key={g} className="mb-4">
            <div className="overline px-2 mb-1">{g}</div>
            {sections.filter(s => s.group === g).map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 px-3 py-[7px] rounded-[10px] text-[12px] font-medium text-[--c-secondary] hover:bg-[--bg-hover] hover:text-[--c-primary] transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        ))}
      </aside>

      {/* ──────── MAIN CONTENT ──────── */}
      <div className="flex-1 min-w-0 max-w-[1100px] py-8 px-4 xl:px-8 flex flex-col gap-14">
        {/* Page header */}
        <div>
          <p className="overline text-[--c-positive] mb-1">Sistem Antarmuka (UI)</p>
          <h1 className="text-[48px] font-black tracking-[-0.05em] italic uppercase leading-none mb-3">
            Project <span className="text-[--c-positive]">SKRIPSI</span>
          </h1>
          <p className="text-[--c-secondary] max-w-xl text-[14px]">
            Katalog lengkap komponen UI dari referensi <code className="mono text-[--c-positive]">indexx.html</code>. Semua 18 section ditampilkan di sini.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="lime-chip">
              <span className="w-[6px] h-[6px] rounded-full bg-[--c-positive] inline-block" style={{ animation: "pulse 1.5s infinite" }} />
              Live Preview
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            01 — TYPOGRAPHY
            ════════════════════════════════════════════ */}
        <section id="s01">
          <SectionHeader num="01" title="Typography" />
          <div className="flex flex-col gap-1">
            <TypeRow label="Display" spec="48px / 900 / Italic" className=""><Display>Project SKRIPSI</Display></TypeRow>
            <TypeRow label="Heading 1" spec="36px / 700" className=""><H1>Dashboard Overview</H1></TypeRow>
            <TypeRow label="Heading 2" spec="28px / 700" className=""><H2>Monthly Summary</H2></TypeRow>
            <TypeRow label="Heading 3" spec="22px / 600" className=""><H3>Section Title</H3></TypeRow>
            <TypeRow label="Heading 4" spec="18px / 600" className=""><H4>Card Heading Here</H4></TypeRow>
            <TypeRow label="Body" spec="14px / 400 / 1.7lh" className=""><Body>Teks paragraf reguler digunakan untuk konten utama. Pastikan keterbacaan optimal dengan line-height yang nyaman.</Body></TypeRow>
            <TypeRow label="Small" spec="12px / 400" className=""><TextSmall>Teks kecil untuk keterangan tambahan, meta info, atau deskripsi singkat.</TextSmall></TypeRow>
            <TypeRow label="Caption" spec="10px / 400" className=""><Caption>Caption untuk label tabel, timestamp, dan metadata komponen.</Caption></TypeRow>
            <TypeRow label="Overline" spec="9px / 700 / +18em" className=""><Overline>Section Overline Label</Overline></TypeRow>
            <TypeRow label="Code / Mono" spec="DM Mono 13px" className=""><Code>{`const token = "bg-accent"; // #9FE870`}</Code></TypeRow>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            02 — BUTTONS
            ════════════════════════════════════════════ */}
        <section id="s02">
          <SectionHeader num="02" title="Buttons" />
          <SubLabel>Variants</SubLabel>
          <div className="flex flex-wrap gap-[10px] mb-5">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Danger</Button>
            <Button variant="positive">Positive</Button>
            <Button variant="notice">Notice</Button>
            <Button variant="dark">Dark / Inverse</Button>
            <Button disabled>Disabled</Button>
          </div>

          <SubLabel>Sizes</SubLabel>
          <div className="flex flex-wrap gap-[10px] items-center mb-5">
            <Button size="xs">XS Button</Button>
            <Button size="sm">SM Button</Button>
            <Button size="default">MD Button</Button>
            <Button size="lg">LG Button</Button>
            <Button size="xl">XL Button</Button>
          </div>

          <SubLabel>Shapes & Icon Buttons</SubLabel>
          <div className="flex flex-wrap gap-[10px] items-center">
            <Button className="!rounded-[50px]">Pill Shape</Button>
            <Button variant="ghost" className="!rounded-[50px]">Pill Ghost</Button>
            <Button variant="secondary" size="icon"><Settings className="w-[15px] h-[15px]" /></Button>
            <Button size="icon" className="!rounded-[50px]"><Plus className="w-[14px] h-[14px]" /></Button>
            <Button className="gap-2"><Plus className="w-[14px] h-[14px]" /> With Icon</Button>
            <Button variant="ghost" className="gap-2">Export <ArrowRight className="w-[13px] h-[13px]" /></Button>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            03 — FORM ELEMENTS
            ════════════════════════════════════════════ */}
        <section id="s03">
          <SectionHeader num="03" title="Form Elements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="field">
              <label className="field-label">Full Name <span className="req">*</span></label>
              <Input placeholder="sapik" />
              <span className="field-hint">Nama lengkap sesuai KTP.</span>
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[--c-tertiary] pointer-events-none" />
                <Input className="pl-9" type="email" placeholder="user@domain.com" />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Password <span className="req">*</span></label>
              <Input className="!border-[--bdr-negative]" type="password" defaultValue="12345" />
              <span className="field-error">Password minimal 8 karakter.</span>
            </div>
            <div className="field">
              <label className="field-label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[--c-tertiary] pointer-events-none" />
                <Input className="pl-9 !border-[--bdr-positive]" type="text" defaultValue="sapik" />
              </div>
              <span className="field-hint text-positive">Username tersedia.</span>
            </div>
            <div className="field">
              <label className="field-label">Peran</label>
              <Select><SelectTrigger><SelectValue placeholder="Pilih peran..." /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="mgr">Manager</SelectItem><SelectItem value="staff">Staff</SelectItem></SelectContent></Select>
            </div>
            <div className="field">
              <label className="field-label">Target Pendapatan</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold mono text-[--c-tertiary] pointer-events-none">Rp</span>
                <Input className="pl-9 pr-12" type="text" placeholder="0" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold mono text-[--c-tertiary] pointer-events-none">/bln</span>
              </div>
            </div>
            <div className="field md:col-span-2">
              <label className="field-label">Catatan</label>
              <Textarea placeholder="Tulis catatan atau deskripsi di sini..." />
            </div>
          </div>

          <div className="h-px bg-[--border-ui] my-6" />

          <SubLabel>Checkboxes</SubLabel>
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-start gap-3">
              <Checkbox id="cb1" defaultChecked />
              <div>
                <Label htmlFor="cb1" className="text-[13px] font-medium leading-none cursor-pointer">Aktifkan notifikasi email</Label>
                <p className="text-[11px] text-[--c-tertiary] mt-1">Terima ringkasan harian via email</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="cb2" />
              <div>
                <Label htmlFor="cb2" className="text-[13px] font-medium leading-none cursor-pointer">Izinkan data analitik</Label>
                <p className="text-[11px] text-[--c-tertiary] mt-1">Bantu kami meningkatkan layanan</p>
              </div>
            </div>
          </div>

          <SubLabel>Radio Buttons</SubLabel>
          <div className="mb-6">
            <RadioGroup defaultValue="gratis">
              {["Gratis", "Pro", "Enterprise"].map((v, i) => (
                <div key={v} className="flex items-center space-x-2">
                  <RadioGroupItem value={v.toLowerCase()} id={`r${i}`} />
                  <Label htmlFor={`r${i}`} className="text-[13px] font-medium cursor-pointer">{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <SubLabel>Toggles</SubLabel>
          <div className="flex flex-col gap-3 mb-6">
            {(["Mode Gelap", "Tampilkan di profil publik", "Sinkronisasi otomatis"] as const).map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <Switch id={`sw${i}`} defaultChecked={i !== 1} />
                <Label htmlFor={`sw${i}`} className="text-[13px] font-medium cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>

          <SubLabel>Range Slider</SubLabel>
          <div className="field max-w-[440px]">
            <div className="flex justify-between text-[12px] font-semibold mb-[10px]">
              <span>Volume Notifikasi</span>
              <span className="text-positive mono">{rangeVal}%</span>
            </div>
            <Slider defaultValue={[70]} max={100} step={1} onValueChange={(val) => setRangeVal(val[0])} />
          </div>
        </section>

        {/* ════════════════════════════════════════════
            04 — BADGES & TAGS
            ════════════════════════════════════════════ */}
        <section id="s04">
          <SectionHeader num="04" title="Badges & Tags" />
          <SubLabel>Semantic Badges</SubLabel>
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="positive" dot>Active</Badge>
            <Badge variant="negative" dot>Error</Badge>
            <Badge variant="notice" dot>Warning</Badge>
            <Badge variant="blue" dot>Info</Badge>
            <Badge variant="solid">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <SubLabel>Status Badges</SubLabel>
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <Badge variant="positive"><span className="w-[5px] h-[5px] rounded-full bg-[--c-positive] shrink-0" style={{ animation: "pulse 1.5s infinite" }} />Online</Badge>
            <Badge variant="notice" dot>Away</Badge>
            <Badge variant="default" dot>Offline</Badge>
            <Badge variant="negative" dot>Busy</Badge>
          </div>
          <SubLabel>Interactive Tags</SubLabel>
          <div className="flex flex-wrap gap-2 items-center">
            <Tag active>Dashboard</Tag>
            <Tag>Laporan</Tag>
            <Tag>Keuangan</Tag>
            <Tag>SDM</Tag>
            <Tag onRemove={() => console.log("Removed React")}>React.js</Tag>
            <Tag onRemove={() => console.log("Removed TS")}>TypeScript</Tag>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            05 — CARDS
            ════════════════════════════════════════════ */}
        <section id="s05">
          <SectionHeader num="05" title="Cards" />
          <SubLabel>Stat / KPI Cards</SubLabel>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {([
              ["Total Pendapatan", "Rp 2.4M", "▲ 12.5%", "up", "72%", ""],
              ["Total Pengguna", "1,248", "▲ 8.3%", "up", "58%", ""],
              ["Order Aktif", "87", "▼ 3.1%", "down", "40%", "var(--bg-negative)"],
              ["Tingkat Konversi", "24.6%", "▲ 1.2%", "up", "24%", "var(--c-blue)"],
            ] as [string, string, string, "up" | "down", string, string][]).map(([label, val, change, dir, bar, barColor]) => (
              <StatCard key={label} label={label} value={val} change={change} dir={dir} barWidth={bar} barColor={barColor} />
            ))}
          </div>

          <SubLabel>Content Cards</SubLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              [<CheckCircle2 key="1" className="w-5 h-5 text-[--c-positive]" />, "positive", "Laporan Bulanan", "Ringkasan performa bisnis bulan ini termasuk pendapatan dan margin laba bersih.", "Selesai", "Jul 2025"],
              [<Info key="2" className="w-5 h-5 text-[--c-blue]" />, "blue", "Onboarding Pengguna", "Panduan langkah demi langkah untuk memperkenalkan fitur platform kepada pengguna baru.", "Aktif", ""],
              [<AlertTriangle key="3" className="w-5 h-5 text-[--c-notice]" />, "notice", "Pembaruan Sistem", "Dijadwalkan pembaruan infrastruktur pada tanggal 15 Juli 2025 pukul 02.00 WIB.", "Terjadwal", "15 Jul 02:00"],
            ] as [React.ReactNode, "positive" | "negative" | "notice" | "blue" | "default", string, string, string, string][]).map(([icon, iconBg, title, body, status, meta]) => (
              <ContentCard key={title} icon={icon} iconBg={iconBg} title={title} body={body} status={status} meta={meta} />
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            06 — ALERTS
            ════════════════════════════════════════════ */}
        <section id="s06">
          <SectionHeader num="06" title="Alerts" />
          <div className="flex flex-col gap-[10px]">
            <Alert variant="positive">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Berhasil Disimpan</AlertTitle>
              <AlertDescription>Data profil Anda telah berhasil diperbarui dan disimpan ke server.</AlertDescription>
            </Alert>
            <Alert variant="negative">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gagal Mengunggah</AlertTitle>
              <AlertDescription>Ukuran file melebihi batas 10MB. Kompres file terlebih dahulu.</AlertDescription>
            </Alert>
            <Alert variant="notice">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>Sesi Anda akan berakhir dalam 5 menit. Simpan pekerjaan Anda.</AlertDescription>
            </Alert>
            <Alert variant="blue">
              <Info className="h-4 w-4" />
              <AlertTitle>Informasi</AlertTitle>
              <AlertDescription>Fitur ekspor laporan PDF kini tersedia. Kunjungi halaman Laporan.</AlertDescription>
            </Alert>
            <Alert variant="default">
              <Info className="h-4 w-4" />
              <AlertTitle>Catatan</AlertTitle>
              <AlertDescription>Halaman ini hanya dapat diakses oleh pengguna dengan hak akses Admin.</AlertDescription>
            </Alert>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            07 — TABLE
            ════════════════════════════════════════════ */}
        <section id="s07">
          <SectionHeader num="07" title="Tables" />
          <div className="bg-[--s-l1] border border-[--border-ui] rounded-[18px] overflow-hidden">
            <div className="p-4 px-5 border-b border-[--border-ui] flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-[14px] font-bold">Data Transaksi</div>
                <div className="text-[11px] text-[--c-tertiary] mt-0.5">Menampilkan 5 dari 128 entri</div>
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="secondary" size="sm" className="gap-[6px]"><Search className="w-3 h-3" /> Filter</Button>
                <Button size="sm" className="gap-[6px]"><Plus className="w-3 h-3" /> Export</Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Nama Pelanggan</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {([
                  ["#TRX-0048", "Ahmad Reza", "ahmad@mail.com", "green", "AR", "Premium Plan", "12 bulan", "Rp 1.200.000", "Lunas", "positive", "12 Jul 2025"],
                  ["#TRX-0047", "admin Wahyu", "admin@mail.com", "blue", "SW", "Basic Plan", "1 bulan", "Rp 150.000", "Pending", "notice", "11 Jul 2025"],
                  ["#TRX-0046", "sapik Pratama", "sapik@mail.com", "notice", "BP", "Enterprise", "6 bulan", "Rp 4.800.000", "Lunas", "positive", "10 Jul 2025"],
                  ["#TRX-0045", "Nia Rahayu", "nia@mail.com", "red", "NR", "Basic Plan", "3 bulan", "Rp 420.000", "Gagal", "negative", "09 Jul 2025"],
                  ["#TRX-0044", "Farhan Hasan", "farhan@mail.com", "neutral", "FH", "Premium Plan", "3 bulan", "Rp 330.000", "Refund", "blue", "08 Jul 2025"],
                ] as string[][]).map(([id, name, email, color, init, prod, dur, amt, status, statusVar, date]) => (
                  <TableRow key={id}>
                    <TableCell><span className="mono text-[12px] font-semibold">{id}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-[10px]">
                        <Avatar size="sm" colorVariant={color as any}><AvatarFallback>{init}</AvatarFallback></Avatar>
                        <div><div className="font-semibold">{name}</div><div className="mono text-[10px] text-[--c-tertiary] mt-0.5">{email}</div></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="font-semibold">{prod}</div><div className="mono text-[10px] text-[--c-tertiary] mt-0.5">{dur}</div></TableCell>
                    <TableCell className="text-right mono font-medium">{amt}</TableCell>
                    <TableCell><Badge variant={statusVar as any}>{status}</Badge></TableCell>
                    <TableCell className="text-[12px] text-[--c-secondary]">{date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-3 px-5 border-t border-[--border-ui] flex items-center justify-between text-[11px] text-[--c-tertiary] flex-wrap gap-2">
              <span>1–5 dari 128 transaksi</span>
              <div className="pagination">
                <button className="page-btn" disabled>‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-dots">…</span>
                <button className="page-btn">26</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            08 — PROGRESS & LOADING
            ════════════════════════════════════════════ */}
        <section id="s08">
          <SectionHeader num="08" title="Progress & Loading" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div>
              <SubLabel>Linear Progress</SubLabel>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-[12px] font-semibold"><span>Pengiriman</span><span className="text-positive">72%</span></div>
                  <Progress value={72} variant="positive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-[12px] font-semibold"><span>Error Rate</span><span className="text-negative">28%</span></div>
                  <Progress value={28} variant="negative" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-[12px] font-semibold"><span>Utilisasi Server</span><span className="text-notice">61%</span></div>
                  <Progress value={61} variant="notice" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-[12px] font-semibold"><span>Koneksi Aktif</span><span className="text-blue">88%</span></div>
                  <Progress value={88} variant="blue" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-[12px] font-semibold"><span>Gradient Fill</span><span>45%</span></div>
                  <Progress value={45} variant="gradient" size="thick" />
                </div>
              </div>
            </div>
            <div>
              <SubLabel>Circular Progress</SubLabel>
              <div className="flex flex-wrap gap-6 items-center mb-6">
                <div className="text-center">
                  <CircularProgress value={72} label="72%" />
                  <div className="text-[10px] text-[--c-tertiary] mt-[6px]">CPU Usage</div>
                </div>
                <div className="text-center">
                  <CircularProgress value={30} color="var(--c-blue)" label="30%" />
                  <div className="text-[10px] text-[--c-tertiary] mt-[6px]">Memory</div>
                </div>
                <div className="text-center">
                  <CircularProgress value={95} color="var(--c-negative)" label="95%" />
                  <div className="text-[10px] text-[--c-tertiary] mt-[6px]">Disk Space</div>
                </div>
              </div>

              <SubLabel>Spinners & Loaders</SubLabel>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="text-center"><Spinner size="sm" /><div className="text-[10px] text-[--c-tertiary] mt-2">SM</div></div>
                <div className="text-center"><Spinner size="md" /><div className="text-[10px] text-[--c-tertiary] mt-2">MD</div></div>
                <div className="text-center"><Spinner size="lg" /><div className="text-[10px] text-[--c-tertiary] mt-2">LG</div></div>
                <div className="text-center"><DotsLoader /><div className="text-[10px] text-[--c-tertiary] mt-2">Dots</div></div>
              </div>
            </div>
          </div>

          <SubLabel>Skeleton Loader</SubLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Skeleton variant="card" className="p-[22px]">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="avatar" />
                <div className="flex-1">
                  <Skeleton variant="title" style={{ width: "60%" }} />
                  <Skeleton variant="text" style={{ width: "40%" }} />
                </div>
              </div>
              <Skeleton variant="text" />
              <Skeleton variant="text" style={{ width: "85%" }} />
              <Skeleton variant="text" style={{ width: "70%" }} />
            </Skeleton>
            <Skeleton variant="card" className="p-[22px]">
              <Skeleton style={{ height: 120, borderRadius: 10, marginBottom: 14 }} />
              <Skeleton variant="title" style={{ width: "50%" }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" style={{ width: "75%" }} />
            </Skeleton>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            09 — AVATARS
            ════════════════════════════════════════════ */}
        <section id="s09">
          <SectionHeader num="09" title="Avatars" />
          <SubLabel>Sizes</SubLabel>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            {(["xs", "sm", "md", "lg", "xl"] as const).map(s => <Avatar key={s} size={s} colorVariant="green"><AvatarFallback>DR</AvatarFallback></Avatar>)}
          </div>
          <SubLabel>Color Variants</SubLabel>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            {([["green", "AR"], ["blue", "SW"], ["red", "NR"], ["notice", "BP"], ["neutral", "FH"]] as const).map(([c, i]) => <Avatar key={c} size="md" colorVariant={c}><AvatarFallback>{i}</AvatarFallback></Avatar>)}
            <Avatar size="md" square colorVariant="green"><AvatarFallback>DR</AvatarFallback></Avatar>
            <Avatar size="md" square colorVariant="blue"><AvatarFallback>AD</AvatarFallback></Avatar>
          </div>
          <SubLabel>With Status Indicator</SubLabel>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            {([["green", "AR", "status-online"], ["blue", "SW", "status-away"], ["red", "NR", "status-offline"], ["notice", "BP", "status-busy"]] as [string, string, string][]).map(([c, i, st]) => (
              <div key={c} className="relative">
                <Avatar size="md" colorVariant={c as any}><AvatarFallback>{i}</AvatarFallback></Avatar>
                <div className={`avatar-status ${st}`} />
              </div>
            ))}
          </div>
          <SubLabel>Avatar Group</SubLabel>
          <div className="avatar-group">
            <Avatar size="md" colorVariant="green"><AvatarFallback>AR</AvatarFallback></Avatar>
            <Avatar size="md" colorVariant="blue"><AvatarFallback>SW</AvatarFallback></Avatar>
            <Avatar size="md" colorVariant="red"><AvatarFallback>NR</AvatarFallback></Avatar>
            <Avatar size="md" colorVariant="notice"><AvatarFallback>BP</AvatarFallback></Avatar>
            <div className="avatar-overflow">+8</div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            10 — TABS
            ════════════════════════════════════════════ */}
        <section id="s10">
          <SectionHeader num="10" title="Tabs" />
          <SubLabel>Pill Tabs</SubLabel>
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analitik">Analitik</TabsTrigger>
              <TabsTrigger value="laporan">Laporan</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><div className="alert-blue p-4 rounded-[14px] flex gap-3 text-[13px]"><span className="text-[18px]"></span><div><div className="font-bold mb-[3px]">Tab Overview Aktif</div><div className="text-[12px] leading-[1.6]">Konten tab Overview ditampilkan di sini.</div></div></div></TabsContent>
            <TabsContent value="analitik"><div className="bg-[--s-l2] border border-[--border-ui] text-[--c-secondary] p-4 rounded-[14px] flex gap-3 text-[13px]"><span className="text-[18px]"></span><div><div className="font-bold mb-[3px]">Tab Analitik</div><div className="text-[12px]">Konten halaman analitik dan visualisasi data.</div></div></div></TabsContent>
            <TabsContent value="laporan"><div className="alert-positive p-4 rounded-[14px] flex gap-3 text-[13px]"><span className="text-[18px]"></span><div><div className="font-bold mb-[3px]">Tab Laporan</div><div className="text-[12px]">Ekspor dan unduh laporan dalam berbagai format.</div></div></div></TabsContent>
            <TabsContent value="settings"><div className="alert-notice p-4 rounded-[14px] flex gap-3 text-[13px]"><span className="text-[18px]"></span><div><div className="font-bold mb-[3px]">Tab Pengaturan</div><div className="text-[12px]">Konfigurasi preferensi dan parameter sistem.</div></div></div></TabsContent>
          </Tabs>

          <SubLabel>Underline Tabs</SubLabel>
          <Tabs defaultValue="semua">
            <TabsListUnderline>
              <TabsTriggerUnderline value="semua">Semua</TabsTriggerUnderline>
              <TabsTriggerUnderline value="aktif">Aktif</TabsTriggerUnderline>
              <TabsTriggerUnderline value="pending">Pending</TabsTriggerUnderline>
              <TabsTriggerUnderline value="arsip">Arsip</TabsTriggerUnderline>
            </TabsListUnderline>
            <div className="mt-4 text-[13px] text-[--c-secondary]">Konten tab underline ditampilkan di area ini.</div>
          </Tabs>
        </section>

        {/* ════════════════════════════════════════════
            11 — BREADCRUMB
            ════════════════════════════════════════════ */}
        <section id="s11">
          <SectionHeader num="11" title="Breadcrumb" />
          <div className="flex flex-col gap-[14px]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Komponen</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Laporan</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Keuangan</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Q2 2025</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><span className="text-[--c-tertiary] text-[11px] font-bold">HOME</span></BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem><BreadcrumbLink href="#">Pengguna</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem><BreadcrumbLink href="#">Manajemen</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem><BreadcrumbPage>Detail Profil</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            12 — PAGINATION
            ════════════════════════════════════════════ */}
        <section id="s12">
          <SectionHeader num="12" title="Pagination" />
          <div className="flex flex-col gap-4">
            <Pagination>
              <PageButton disabled>‹ Sebelumnya</PageButton>
              <PageButton isActive>1</PageButton>
              <PageButton>2</PageButton>
              <PageButton>3</PageButton>
              <PageDots />
              <PageButton>12</PageButton>
              <PageButton>Berikutnya ›</PageButton>
            </Pagination>
            <Pagination>
              <PageButton>‹</PageButton>
              <PageButton>1</PageButton>
              <PageButton>2</PageButton>
              <PageButton isActive>3</PageButton>
              <PageButton>4</PageButton>
              <PageButton>5</PageButton>
              <PageDots />
              <PageButton>18</PageButton>
              <PageButton>›</PageButton>
            </Pagination>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            13 — TOAST
            ════════════════════════════════════════════ */}
        <section id="s13">
          <SectionHeader num="13" title="Toast & Notifications" />
          <SubLabel>Preview Statis</SubLabel>
          <ToastStack className="max-w-[380px] static transform-none opacity-100 flex-col pointer-events-auto">
            <Toast variant="positive" onDismiss={() => { }}>
              <ToastBody>
                <ToastTitle>Berhasil Disimpan</ToastTitle>
                <ToastMessage>Perubahan Anda telah disimpan.</ToastMessage>
              </ToastBody>
            </Toast>
            <Toast variant="negative" onDismiss={() => { }}>
              <ToastBody>
                <ToastTitle>Koneksi Gagal</ToastTitle>
                <ToastMessage>Periksa koneksi internet Anda.</ToastMessage>
              </ToastBody>
            </Toast>
            <Toast variant="notice" onDismiss={() => { }}>
              <ToastBody>
                <ToastTitle>Sesi Hampir Habis</ToastTitle>
                <ToastMessage>Login ulang dalam 5 menit.</ToastMessage>
              </ToastBody>
            </Toast>
            <Toast variant="default" onDismiss={() => { }}>
              <ToastBody>
                <ToastTitle>Update Tersedia</ToastTitle>
                <ToastMessage>Versi 2.1.0 siap diinstal.</ToastMessage>
              </ToastBody>
            </Toast>
          </ToastStack>
        </section>

        {/* ════════════════════════════════════════════
            14 — MODAL
            ════════════════════════════════════════════ */}
        <section id="s14">
          <SectionHeader num="14" title="Modal / Dialog" />
          <div className="bg-[--s-l2] border border-[--border-ui] rounded-[18px] p-6 text-center">
            <p className="text-[--c-secondary] text-[13px] mb-4">Klik tombol di bawah untuk membuka contoh modal interaktif.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Dialog><DialogTrigger asChild><Button>Konfirmasi Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Konfirmasi Tindakan</DialogTitle><DialogDescription>Apakah Anda yakin ingin melanjutkan? Perubahan yang dilakukan tidak dapat dibatalkan.</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary">Batal</Button><Button>Ya, Lanjutkan</Button></DialogFooter></DialogContent></Dialog>
              <Dialog><DialogTrigger asChild><Button variant="destructive">Delete Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle className="text-[--c-negative]">Hapus Data</DialogTitle><DialogDescription>Data yang dihapus tidak dapat dipulihkan.</DialogDescription></DialogHeader><Input placeholder='Ketik "HAPUS" di sini...' /><DialogFooter><Button variant="secondary">Batal</Button><Button variant="destructive">Hapus Permanen</Button></DialogFooter></DialogContent></Dialog>
              <Dialog><DialogTrigger asChild><Button variant="secondary">Form Modal</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Tambah Pengguna Baru</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div className="field"><label className="field-label">Nama <span className="req">*</span></label><Input placeholder="Nama lengkap" /></div><div className="field"><label className="field-label">Email <span className="req">*</span></label><Input type="email" placeholder="email@domain.com" /></div></div><DialogFooter className="mt-4"><Button variant="secondary">Batal</Button><Button>Tambah Pengguna</Button></DialogFooter></DialogContent></Dialog>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            15 — DROPDOWN
            ════════════════════════════════════════════ */}
        <section id="s15">
          <SectionHeader num="15" title="Dropdown Menu" />
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="secondary" className="gap-2">Aksi <ChevronRight className="w-[11px] h-[11px] rotate-90" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Dokumen</DropdownMenuLabel>
                <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                <DropdownMenuItem>Duplikasi</DropdownMenuItem>
                <DropdownMenuItem>Arsipkan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Berbahaya</DropdownMenuLabel>
                <DropdownMenuItem className="text-[--c-negative]">Hapus</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button className="gap-2">Ekspor Data <ChevronRight className="w-[11px] h-[11px] rotate-90" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Ekspor PDF</DropdownMenuItem>
                <DropdownMenuItem>Ekspor Excel</DropdownMenuItem>
                <DropdownMenuItem>Ekspor CSV</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Salin Tautan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            16 — TOOLTIP
            ════════════════════════════════════════════ */}
        <section id="s16">
          <SectionHeader num="16" title="Tooltips" />
          <TooltipProvider>
            <div className="flex flex-wrap gap-3 items-center py-10 px-5">
              <Tooltip>
                <TooltipTrigger asChild><Button variant="secondary">Hover Saya</Button></TooltipTrigger>
                <TooltipContent>Ini adalah tooltip dasar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild><Button>Simpan</Button></TooltipTrigger>
                <TooltipContent>Simpan semua perubahan (Ctrl+S)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-9 h-9 rounded-[10px] border border-[--border-ui] bg-[--s-l2] flex items-center justify-center text-[--c-secondary] cursor-pointer hover:bg-[--bg-hover] transition-colors"><Info className="w-[15px] h-[15px]" /></div>
                </TooltipTrigger>
                <TooltipContent>Informasi lebih lanjut</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild><Badge variant="positive" className="cursor-default">Active</Badge></TooltipTrigger>
                <TooltipContent>Akun aktif sejak 12 Jan 2025</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </section>

        {/* ════════════════════════════════════════════
            17 — CHARTS
            ════════════════════════════════════════════ */}
        <section id="s17">
          <SectionHeader num="17" title="Charts & Data Viz" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Bar Chart */}
            <div className="stat-card">
              <div className="flex justify-between items-start mb-4">
                <div><div className="overline">Pendapatan Mingguan</div><div className="text-[22px] font-bold tracking-[-0.03em] mt-1">Rp 8.4M</div></div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-[9px] py-[3px] rounded-[50px] bg-[--bg-positive-subtle] text-[--c-positive]">▲ 14.2%</span>
              </div>
              <BarChart values={barValues} labels={barDays} highlightIndex={5} height={80} />
            </div>

            {/* Donut Chart */}
            <div className="stat-card">
              <div className="overline mb-4">Distribusi Produk</div>
              <div className="donut-wrap">
                <DonutChart
                  size={120}
                  strokeWidth={18}
                  centerLabel="100%"
                  segments={[
                    { value: 42, color: "var(--bg-accent)" },
                    { value: 31, color: "var(--c-blue)" },
                    { value: 18, color: "var(--bg-notice)" },
                    { value: 9, color: "var(--bg-negative)" },
                  ]}
                />
                <DonutLegend>
                  {([["var(--bg-accent)", "Premium", "42%", "Rp 3.5M"], ["var(--c-blue)", "Basic", "31%", "Rp 2.6M"], ["var(--bg-notice)", "Starter", "18%", "Rp 1.5M"], ["var(--bg-negative)", "Trial", "9%", "Rp 756K"]] as string[][]).map(([c, n, pct, amt]) => (
                    <DonutLegendItem key={n} color={c} label={n} sub={`${pct} · ${amt}`} />
                  ))}
                </DonutLegend>
              </div>
            </div>
          </div>

          {/* Sparklines */}
          <div className="stat-card">
            <SubLabel>Sparklines — Pendapatan 30 Hari Terakhir</SubLabel>
            <div className="flex gap-6 flex-wrap mt-3">
              {([["Lime — Pendapatan", spark1, "var(--bg-accent)"], ["Blue — Pengguna Baru", spark2, "var(--c-blue)"], ["Red — Error Rate", spark3, "var(--bg-negative)"]] as [string, number[], string][]).map(([label, data, color]) => (
                <div key={label}>
                  <div className="text-[11px] text-[--c-tertiary] mb-[6px]">{label}</div>
                  <Sparkline data={data} color={color} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            18 — LIST ITEMS
            ════════════════════════════════════════════ */}
        <section id="s18">
          <SectionHeader num="18" title="List Items" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SubLabel>Transaksi Terbaru</SubLabel>
              <ListCard>
                {([
                  ["green", "AR", "Ahmad Reza", "Premium Plan · 12 bulan", "+Rp 1.2M", "positive", "12:34"],
                  ["blue", "SW", "admin Wahyu", "Basic Plan · 1 bulan", "+Rp 150K", "notice", "11:20"],
                  ["red", "NR", "Nia Rahayu", "Refund Request", "−Rp 420K", "negative", "09:15"],
                  ["notice", "BP", "sapik Pratama", "Enterprise · 6 bulan", "+Rp 4.8M", "positive", "08:02"],
                ] as [string, string, string, string, string, "positive" | "negative" | "notice" | "default", string][]).map(([color, init, name, sub, amt, amtVar, time]) => (
                  <ListItem key={name}>
                    <Avatar size="sm" colorVariant={color as any}><AvatarFallback>{init}</AvatarFallback></Avatar>
                    <ListItemContent><ListItemTitle>{name}</ListItemTitle><ListItemSub>{sub}</ListItemSub></ListItemContent>
                    <ListItemRight><ListItemAmount variant={amtVar}>{amt}</ListItemAmount><ListItemTime>{time}</ListItemTime></ListItemRight>
                  </ListItem>
                ))}
              </ListCard>
            </div>
            <div>
              <SubLabel>Notifikasi</SubLabel>
              <ListCard>
                {([
                  [<AlertTriangle key="1" className="w-[18px] h-[18px] text-[--c-notice]" />, "Pembaruan Sistem", "Server akan maintenance 15 Jul 02.00 WIB", "notice", "Baru", "2 jam lalu"],
                  [<CheckCircle2 key="2" className="w-[18px] h-[18px] text-[--c-positive]" />, "Export Selesai", "Laporan Q2-2025.pdf siap diunduh", "", "", "5 jam lalu"],
                  [<User key="3" className="w-[18px] h-[18px] text-[--c-blue]" />, "Pengguna Baru", "Farhan Hasan mendaftar via referral", "positive", "Baru", "1 hari lalu"],
                  [<AlertCircle key="4" className="w-[18px] h-[18px] text-[--c-negative]" />, "Pembayaran Gagal", "Transaksi #TRX-0045 perlu ditinjau", "negative", "Urgent", "1 hari lalu"],
                ] as [React.ReactNode, string, string, string, string, string][]).map(([icon, title, sub, badgeVar, badgeTxt, time]) => (
                  <ListItem key={title}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[--s-l2]">{icon}</div>
                    <ListItemContent><ListItemTitle>{title}</ListItemTitle><ListItemSub>{sub}</ListItemSub></ListItemContent>
                    <ListItemRight>
                      {badgeTxt && <Badge variant={badgeVar as any} className="!text-[8px]">{badgeTxt}</Badge>}
                      <ListItemTime>{time}</ListItemTime>
                    </ListItemRight>
                  </ListItem>
                ))}
              </ListCard>
            </div>
          </div>
        </section>


        {/* ──── FOOTER ──── */}
        <footer className="text-center py-8 mt-4 mono text-[9px] tracking-[0.18em] uppercase text-[--c-tertiary]">
          2025 © KOKONUS FARM &nbsp;·&nbsp; Designed by SYAFIQ &nbsp;·&nbsp; &nbsp;·&nbsp; UI Components v1.0
        </footer>
      </div>
    </div>
  )
}
