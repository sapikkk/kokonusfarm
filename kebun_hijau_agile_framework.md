# KEBUN HIJAU
## Sistem Manajemen Hidroponik Digital
### Agile & User-Centered Design Framework — Dokumen Manajemen Proyek Komprehensif

---

| Field | Keterangan |
|---|---|
| Versi Dokumen | 1.0.0 |
| Status | Living Document |
| Metodologi | Agile Scrum + UCD |
| Sprint Duration | 2 Minggu / Sprint |
| Total Sprints | 5 Sprints |
| Tech Stack | Next.js 14, TypeScript, Prisma, PostgreSQL |

---

## Daftar Isi

1. [Ringkasan Eksekutif & Statistik Proyek](#1-ringkasan-eksekutif--statistik-proyek)
2. [User-Centered Design (UCD)](#2-user-centered-design-ucd)
   - 2.1 User Personas
   - 2.2 User Journey Maps
3. [Product Backlog — Epics & User Stories](#3-product-backlog--epics--user-stories)
   - 3.1 Ringkasan Sprint Roadmap
   - 3.2 EPIC 1: Core Framework & Authentication
   - 3.3 EPIC 2: Sistem Akuntansi Double-Entry & HPP
   - 3.4 EPIC 3: Manajemen Produksi DWC
   - 3.5 EPIC 4: Manajemen Inventaris & Bahan Baku
   - 3.6 EPIC 5: Manajemen Penjualan & Pengiriman
   - 3.7 EPIC 6: Dashboard, Visualisasi & Export
4. [Sprint Planning — Detail per Sprint](#4-sprint-planning--detail-per-sprint)
5. [Definition of Done (DoD)](#5-definition-of-done-dod)
6. [Risk Register](#6-risk-register)
7. [UCD Usability Testing Plan — Sprint 5](#7-ucd-usability-testing-plan--sprint-5)
8. [Role-Based Access Control (RBAC)](#8-role-based-access-control-rbac)
9. [Referensi API Endpoints](#9-referensi-api-endpoints)
10. [Demo Accounts & Deployment](#10-demo-accounts--deployment)
11. [Glosarium Istilah](#11-glosarium-istilah)
12. [Penutup & Living Document Policy](#12-penutup--living-document-policy)

---

## 1. Ringkasan Eksekutif & Statistik Proyek

> **Kebun Hijau** adalah sistem manajemen hidroponik digital berbasis web yang dibangun untuk memodernisasi operasional kebun hidroponik skala kecil-menengah. Sistem ini mengintegrasikan tiga modul inti: manajemen produksi DWC (Deep Water Culture), akuntansi double-entry berstandar profesional, dan manajemen inventaris bahan baku — semuanya dalam satu platform yang dapat diakses oleh tiga tipe pengguna dengan level akses berbeda.

### Statistik Proyek

| Total Sprints | Total EPICs | Total User Stories | Kapasitas/Sprint |
|:---:|:---:|:---:|:---:|
| **5 Sprints** | **6 EPICs** | **34+ Stories** | **~130 jam** |

---

## 2. User-Centered Design (UCD)

Sistem Kebun Hijau didesain dari sudut pandang pengguna. Tiga persona utama mewakili seluruh spectrum pengguna sistem — dari pemilik bisnis hingga pekerja lapangan.

### 2.1 User Personas

---

#### Persona 1: Budi — Owner / Pemilik

> **Budi Santoso** | Pemilik Kebun Hijau | 45 tahun
>
> *"Saya ingin tahu persis berapa untung per batch panen tanpa harus tanya ke staf."*

| Tujuan Utama | Pain Points | Kebutuhan UX |
|---|---|---|
| Memantau keuntungan bisnis secara  xxx | Sulit melacak biaya listrik & nutrisi  xxx | Dashboard visual intuitif & clean |
| Melihat tren pertumbuhan & proyeksi pendapatan | HPP tidak pasti — harus tanya ke admin | Grafik pendapatan vs pengeluaran |
| Menarik dana (prive) dengan mudah | Tidak punya akses langsung ke laporan keuangan | Summary tanpa perlu buka detail teknis |
| Komparasi HPP vs harga jual | Data tersebar di banyak catatan manual/spreadsheet | Akses laporan dalam 2-3 klik |

---

#### Persona 2: Siti — Admin / Pembukuan

> **Siti Rahayu** | Admin / Pembukuan | 32 tahun
>
> *"Saya butuh sistem yang membantu saya memastikan debit dan kredit selalu balance, tanpa risiko salah input."*

| Tujuan Utama | Pain Points | Kebutuhan UX |
|---|---|---|
| Mencatat transaksi dengan standar double-entry | Rentan salah input debit/kredit secara manual | Tabel data dengan filter & search cepat |
| Menetapkan HPP dengan Activity-Based Costing | Hitung HPP ABC manual sangat kompleks | Konfirmasi jelas sebelum submit jurnal |
| Merekap dan approve laporan panen | Data dari banyak batch tidak terintegrasi | Alur approval harvest report yang smooth |
| Manage Chart of Accounts (COA) | Tidak ada audit trail untuk perubahan jurnal | Auto-kalkulasi HPP dengan tampilan detail |

---

#### Persona 3: Agus — Pekerja / Operator Lapangan

> **Agus Wijaya** | Operator Lapangan | 27 tahun
>
> *"Tangan saya sering basah, jadi saya butuh aplikasi yang bisa dipakai cepat di HP dengan tombol besar."*

| Tujuan Utama | Pain Points | Kebutuhan UX |
|---|---|---|
| Catat aktivitas fisik greenhouse (semai, pindah, panen) | Tangan kotor/basah — sulit ketik banyak | Antarmuka mobile-friendly, tombol aksi BESAR |
| Laporkan penggunaan stok gudang | Lupa batch mana yang harus dipindah | Minim pengetikan — banyak dropdown & pilihan cepat |
| Submit laporan hasil panen ke admin | UI tidak mobile-friendly | Instruksi visual jelas — batch yang perlu tindakan disorot |

---

### 2.2 User Journey Maps

#### Journey 1: Proses Panen (End-to-End)

Skenario ini merepresentasikan siklus paling kompleks dalam sistem — dari trigger fisik di lapangan hingga update laporan keuangan Owner.

| Step | Aktor | Aksi | Sistem | Hasil |
|---|---|---|---|---|
| 1 | Agus (Pekerja) | Tanaman selada di Instalasi A1 usia 30 hari — siap panen | — | Trigger manual oleh pekerja |
| 2 | Agus (Pekerja) | Buka HP, Login, Pilih menu Produksi, Pilih Batch A1, Tekan PANEN, Input berat 15 kg | Validasi input & kirim ke queue | Status batch berubah ke HARVEST_PENDING |
| 3 | Sistem | — | Generate notifikasi ke Admin. Kalkulasi estimasi HPP dari cost benih, rockwool, nutrisi, listrik | Notifikasi masuk ke dashboard Admin |
| 4 | Siti (Admin) | Buka dashboard, lihat Harvest Report dari Agus, review yield & HPP estimasi | Tampilkan breakdown biaya per unit | Admin siap approve/reject |
| 5 | Siti (Admin) | Klik Approve, tetapkan HPP final | Auto-generate Jurnal Double-Entry: Persediaan Barang Jadi +, Barang Dalam Proses - | Transaksi akuntansi terbuat |
| 6 | Budi (Owner) | Buka dashboard Owner | Neraca dan saldo akun ter-update  xxx | Owner melihat aset bertambah |

---

#### Journey 2: Alur Pembelian & Input Inventaris

| Step | Aktor | Aksi | Sistem | Hasil |
|---|---|---|---|---|
| 1 | Agus (Pekerja) | Cek stok — nutrisi hampir habis, sistem menampilkan alert merah | Alert otomatis jika stok < minimum threshold | Alert terlihat di dashboard Pekerja & Admin |
| 2 | Siti (Admin) | Buat Jurnal Pembelian, input faktur supplier, catat debit Inventaris & kredit Kas/Hutang | Validasi debit = kredit, simpan transaksi PENDING | Draft jurnal tersimpan |
| 3 | Siti (Admin) | Approve transaksi sendiri (jika otorisasi) | Update saldo COA, generate inventory log IN | Stok nutrisi bertambah, kas berkurang |
| 4 | Agus (Pekerja) | Buka Active Pack baru dari batch nutrisi yang baru masuk | Catat cost per unit berdasarkan harga beli | Active Pack siap dialokasikan ke produksi |

---

#### Journey 3: Alur Penjualan Hasil Panen (Sprint 3)

| Step | Aktor | Aksi | Sistem | Hasil |
|---|---|---|---|---|
| 1 | Siti (Admin) | Buat Sales Order baru, pilih pelanggan, tambahkan item (selada kg) | Validasi stok tersedia | SO dalam status DRAFT |
| 2 | Siti (Admin) | Konfirmasi SO, input metode pembayaran | Kurangi stok inventaris otomatis, generate invoice | Stok berkurang, piutang/kas bertambah |
| 3 | Agus (Pekerja) | Update status pengiriman menjadi DELIVERED | Record delivery confirmation timestamp | Barang dinyatakan terkirim |
| 4 | Sistem | — | Auto-generate Jurnal Pendapatan: Kas/Piutang debit, Pendapatan Penjualan kredit | Laporan laba-rugi Owner ter-update |

---

## 3. Product Backlog — Epics & User Stories

Product Backlog adalah daftar lengkap semua fitur, perbaikan, dan pekerjaan yang perlu dilakukan. Backlog dibagi menjadi 6 EPIC besar yang masing-masing berisi beberapa User Stories.

### 3.1 Ringkasan Sprint Roadmap

| Sprint | Goal Utama | User Stories | Points | Durasi | Status |
|---|---|:---:|:---:|---|---|
| Sprint 1 | Foundation, Database Schema, Authentication | US1.1–1.4 | 34 | 2 Minggu | ✅ Selesai |
| Sprint 2 | Akuntansi, Produksi DWC, Inventaris | US2.1–4.3 | 55 | 2 Minggu | ✅ Selesai |
| Sprint 3 | Sales Order, Pengiriman, Jurnal Otomatis | US5.1–5.4 | 34 | 2 Minggu | 🔵 Saat Ini |
| Sprint 4 | Visualisasi Dashboard, Export PDF/Excel | US6.1–6.3 | 21 | 2 Minggu | ⏳ Belum Dimulai |
| Sprint 5 | QA, Usability Testing, Bug Fix, Go-Live | All | 13 | 2 Minggu | ⏳ Belum Dimulai |

---

### 3.2 EPIC 1: Core Framework & Authentication

> **Tujuan:** Membangun fondasi teknis yang kuat. Ini adalah sprint paling kritis karena semua sprint berikutnya bergantung pada infrastruktur yang dibangun di sini. Output utama: proyek Next.js berjalan, database PostgreSQL terkonfigurasi, dan autentikasi berbasis peran berfungsi penuh.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-1 |
| Nama | Core Framework & Authentication |
| Sprint | Sprint 1 (Minggu 1–2) |
| Status | ✅ SELESAI |
| Story Points | 34 points |
| Team | Tech Lead, Backend Dev, Database Admin |
| Dependencies | Tidak ada (EPIC pertama) |

---

#### US1.1 — Setup Next.js 14 Project Structure dengan TypeScript

**Persona:** Developer Tim Kebun Hijau | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Tech Lead

*Sebagai developer, saya ingin memiliki struktur project yang terorganisir dengan Next.js 14, TypeScript, ESLint, dan Prettier agar pengembangan lebih cepat, konsisten, dan mudah di-maintain oleh seluruh tim.*

**Acceptance Criteria:**
- [ ] Project Next.js 14 terinstall dengan App Router aktif
- [ ] TypeScript dikonfigurasi dengan strict mode tanpa error
- [ ] ESLint dan Prettier terintegrasi dan berjalan tanpa error
- [ ] Struktur folder: /app, /components, /lib, /hooks, /types, /public terbentuk
- [ ] Environment variables template (.env.example) tersedia
- [ ] Tailwind CSS v3 terintegrasi dan class utility berfungsi
- [ ] Shadcn/UI terinstall dengan komponen Button, Card, Input dasar
- [ ] Development server berjalan di http://localhost:3000 tanpa warning

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Initialize project: npx create-next-app@latest | 1 jam | Wajib dilakukan pertama kali |
| Konfigurasi TypeScript strict mode | 1.5 jam | Edit tsconfig.json |
| Setup ESLint dengan config Next.js | 1 jam | Pastikan flat config |
| Konfigurasi Prettier + integrasi ESLint | 1 jam | Format on save |
| Install dan konfigurasi Tailwind CSS | 2 jam | Termasuk custom color |
| Setup Shadcn/UI + install komponen dasar | 2 jam | Button, Card, Input, Badge |
| Buat struktur folder dan file index | 0.5 jam | Sesuai standar tim |

**Dependencies:** Tidak ada

---

#### US1.2 — Design & Implementasi Database Schema Prisma (11 Tabel)

**Persona:** Seluruh Tim (Database Admin sebagai lead) | **Priority:** HIGHEST | **Story Points:** 13 pts | **Assignee:** Database Admin

*Sebagai sistem, saya ingin memiliki schema database yang komprehensif dan terstruktur dengan 11 tabel yang saling berelasi untuk mendukung double-entry accounting, production cycle tracking DWC, dan inventory management.*

**Acceptance Criteria:**
- [ ] Tabel User dengan field id, email, password, role, name, createdAt terdefinisi
- [ ] Tabel Account (COA) dengan hierarchy parent-child terdefinisi
- [ ] Tabel Transaction dan JournalLine untuk double-entry terdefinisi
- [ ] Tabel Greenhouse dan Installation terdefinisi dengan relasi
- [ ] Tabel ProductionCycle dengan semua fase terdefinisi
- [ ] Tabel ProductionLog untuk audit trail terdefinisi
- [ ] Tabel HarvestReport dengan workflow approval terdefinisi
- [ ] Tabel InventoryItem, InventoryLog, ActivePack terdefinisi
- [ ] Semua Enum (Role, TransactionStatus, ProductionPhase, MovementType) terdefinisi
- [ ] Cascade delete dikonfigurasi untuk menjaga integritas data
- [ ] Unique constraints dan indexes ditambahkan untuk performa
- [ ] Database documentation (ERD) dalam format Mermaid tersedia

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Design ERD — validasi dengan seluruh stakeholder | 3 jam | CRITICAL: harus disetujui sebelum coding |
| Buat tabel User, Account, Transaction, JournalLine | 4 jam | Core accounting tables |
| Buat tabel Greenhouse, Installation, ProductionCycle | 3 jam | Production tracking tables |
| Buat tabel HarvestReport, ProductionLog | 2 jam | Harvest workflow tables |
| Buat tabel InventoryItem, InventoryLog, ActivePack | 3 jam | Inventory tables |
| Definisikan semua Enum dan constraints | 2 jam | Type safety |
| Review schema dan peer review | 1 jam | Wajib sebelum migration |

**Dependencies:** US1.1 harus selesai

---

#### US1.3 — Setup PostgreSQL Database & Prisma ORM Integration

**Persona:** Backend Developer | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai developer, saya ingin PostgreSQL dan Prisma ORM terkonfigurasi dengan baik dan terintegrasi ke aplikasi Next.js agar dapat menjalankan migrations, query database, dan seed data demo dengan mudah.*

**Acceptance Criteria:**
- [ ] PostgreSQL local instance berjalan di port 5432
- [ ] Database 'kebun_hijau' berhasil dibuat
- [ ] Prisma ORM terintegrasi dan prisma/schema.prisma terdefinisi lengkap
- [ ] DATABASE_URL dikonfigurasi di .env dan .env.example
- [ ] Prisma Client berhasil di-generate (npx prisma generate)
- [ ] Migration pertama berhasil dijalankan (npx prisma db push)
- [ ] Prisma Studio berjalan di localhost:5555
- [ ] Seed script (prisma/seed.ts) berjalan dan membuat 3 demo users
- [ ] Database connection test berhasil dari aplikasi

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Install PostgreSQL dan buat database | 1.5 jam | Lokal dev environment |
| Install Prisma ORM: npm install prisma @prisma/client | 0.5 jam | |
| Konfigurasi Prisma dengan DATABASE_URL | 1 jam | Edit schema.prisma datasource |
| Jalankan prisma db push untuk sync schema | 1 jam | Termasuk troubleshoot |
| Buat seed.ts dengan demo data (3 users, COA, sample data) | 4 jam | Data demo untuk testing |
| Test koneksi dari API route Next.js | 0.5 jam | Verifikasi end-to-end |

**Dependencies:** US1.1 dan US1.2 harus selesai

---

#### US1.4 — Implementasi NextAuth.js Authentication System

**Persona:** Backend Developer | **Priority:** HIGHEST | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai pengguna, saya ingin bisa login menggunakan email dan password dan diarahkan ke dashboard yang sesuai dengan role saya (Owner, Admin, Pekerja) agar saya hanya melihat informasi yang relevan.*

**Acceptance Criteria:**
- [ ] NextAuth.js v5 terintegrasi dengan aplikasi
- [ ] Credential provider dikonfigurasi dengan validasi email + password
- [ ] Password di-hash menggunakan bcrypt sebelum disimpan
- [ ] JWT token dikonfigurasi dengan NEXTAUTH_SECRET
- [ ] Session management berfungsi dengan benar
- [ ] Login page (/auth/signin) tersedia dan responsif
- [ ] Logout functionality berjalan dengan redirect ke login page
- [ ] Error handling untuk invalid credentials (pesan error yang tepat)
- [ ] Middleware.ts memproteksi route /owner, /admin, /worker
- [ ] Redirect otomatis ke dashboard berdasarkan role setelah login

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Install NextAuth.js: npm install next-auth | 0.5 jam | |
| Buat auth.ts config dengan credentials provider | 2 jam | JWT strategy |
| Implement bcrypt password hashing | 1 jam | Saat register dan verifikasi |
| Buat login page UI dengan form validation | 3 jam | Responsive mobile-first |
| Setup middleware.ts untuk route protection | 2 jam | Per-role routing |
| Test semua 3 role login/logout flow | 1 jam | E2E manual testing |

**Dependencies:** US1.3 harus selesai (database dengan user data)

---

### 3.3 EPIC 2: Sistem Akuntansi Double-Entry & HPP

> **Tujuan:** Membangun modul akuntansi berstandar profesional dengan double-entry bookkeeping, Chart of Accounts yang terstruktur, dan kalkulasi HPP otomatis menggunakan Activity-Based Costing (ABC). Ini adalah inti dari nilai bisnis sistem untuk Admin dan Owner.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-2 |
| Nama | Sistem Akuntansi Double-Entry & HPP |
| Sprint | Sprint 2 (Minggu 3–4) |
| Status | ✅ SELESAI |
| Story Points | 21 points |
| Team | Backend Dev, Database Admin |
| Dependencies | EPIC 1 harus selesai |

---

#### US2.1 — Manajemen Chart of Accounts (COA) dengan Hierarki

**Persona:** Siti (Admin) | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai Admin, saya ingin membuat dan mengelola Chart of Accounts dengan struktur hierarki parent-child agar pembukuan terorganisir sesuai standar akuntansi Indonesia.*

**Acceptance Criteria:**
- [ ] Halaman daftar COA menampilkan semua akun dengan hierarki visual
- [ ] Admin dapat membuat akun baru dengan kode, nama, tipe (Aset/Kewajiban/Modal/Pendapatan/Beban)
- [ ] Akun dapat dijadikan sub-akun dari akun parent yang ada
- [ ] Admin dapat menonaktifkan akun yang tidak digunakan (soft delete)
- [ ] Sistem memvalidasi kode akun unik dan tidak duplikat
- [ ] API GET /api/accounts mengembalikan COA terstruktur
- [ ] API POST /api/accounts membuat akun baru dengan validasi
- [ ] Data seed menyediakan COA lengkap (minimal 20 akun dasar)

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API route /api/accounts (GET, POST, PUT) | 4 jam | CRUD operations |
| Buat halaman UI COA di /admin/accounts | 5 jam | Termasuk tabel dan form |
| Implementasi hierarki tree view untuk COA | 3 jam | Parent-child visual |
| Buat form tambah/edit akun dengan validasi Zod | 2 jam | |
| Seed data COA lengkap di prisma/seed.ts | 2 jam | Minimal 20 akun dasar |

**Dependencies:** EPIC 1 selesai

---

#### US2.2 — Pencatatan Jurnal Transaksi Double-Entry

**Persona:** Siti (Admin) | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai Admin, saya ingin mencatat transaksi jurnal dengan validasi debit-kredit otomatis agar laporan neraca dan laba-rugi selalu akurat dan seimbang.*

**Acceptance Criteria:**
- [ ] Halaman daftar jurnal menampilkan semua transaksi dengan status
- [ ] Admin dapat membuat jurnal baru dengan multiple JournalLine (debit & kredit)
- [ ] Sistem memvalidasi total debit = total kredit sebelum save
- [ ] Transaksi memiliki status: DRAFT, PENDING, APPROVED, REJECTED
- [ ] Admin dapat menyetujui atau menolak transaksi PENDING
- [ ] Filter jurnal berdasarkan tanggal, status, dan tipe akun
- [ ] API POST /api/transactions dengan validasi double-entry
- [ ] Auto-update saldo COA setelah transaksi disetujui

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API route /api/transactions (GET, POST, PUT) | 4 jam | Termasuk approval endpoint |
| Buat UI halaman daftar jurnal /admin/journal | 5 jam | Tabel dengan filter |
| Buat form entri jurnal dengan dynamic JournalLine rows | 4 jam | Add/remove baris dinamis |
| Implementasi validasi debit=kredit di frontend dan backend | 2 jam |  xxx validation |
| Buat workflow approval (PENDING ke APPROVED/REJECTED) | 2 jam | Dengan konfirmasi dialog |

**Dependencies:** US2.1 selesai (perlu COA)

---

#### US2.3 — Kalkulasi HPP Otomatis berbasis Activity-Based Costing

**Persona:** Siti (Admin) + Sistem | **Priority:** HIGHEST | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai sistem, saya ingin menghitung Harga Pokok Produksi (HPP) secara otomatis berdasarkan biaya benih, rockwool, nutrisi, listrik greenhouse, dan overhead per batch produksi menggunakan metode Activity-Based Costing.*

**Acceptance Criteria:**
- [ ] Sistem mengidentifikasi semua cost driver: benih, rockwool, nutrisi, listrik, overhead
- [ ] Biaya benih dihitung dari Active Pack cost per biji x jumlah biji disemai
- [ ] Biaya media tanam (rockwool) dihitung dari Active Pack cost per unit
- [ ] Biaya nutrisi dihitung dari total konsumsi per siklus produksi
- [ ] Biaya listrik dialokasikan berdasarkan durasi pemakaian instalasi
- [ ] HPP per unit = total biaya / total yield kg panen
- [ ] Admin dapat review dan override HPP sebelum finalisasi
- [ ] HPP final disimpan di HarvestReport dan ditampilkan di laporan

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat kalkulasi engine HPP di lib/hpp-calculator.ts | 4 jam | Pure function, testable |
| Integrasi HPP engine ke HarvestReport approval flow | 3 jam | Trigger saat Admin approve |
| Buat tampilan breakdown biaya di halaman approval panen | 3 jam | Detail per cost driver |
| Allow Admin override HPP dengan justifikasi | 1 jam | Audit trail override |

**Dependencies:** US2.2 selesai + EPIC 3 (production data)

---

### 3.4 EPIC 3: Manajemen Produksi DWC

> **Tujuan:** Membangun sistem tracking siklus hidup tanaman dari benih hingga panen menggunakan sistem DWC (Deep Water Culture). Setiap batch produksi harus bisa di-track  — fase mana, instalasi mana, berapa yield-nya, dan berapa HPP-nya.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-3 |
| Nama | Manajemen Produksi DWC |
| Sprint | Sprint 2 (Minggu 3–4) |
| Status | ✅ SELESAI |
| Story Points | 21 points |
| Team | Backend Dev, Frontend Dev |
| Dependencies | EPIC 1 selesai, EPIC 4 (partial) |

---

#### US3.1 — Manajemen Batch Semai — Buat & Track Siklus Baru

**Persona:** Agus (Pekerja) | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai Pekerja, saya ingin membuat batch semai baru dengan mudah dan memilih benih serta media tanam dari inventaris yang tersedia, sehingga setiap siklus produksi tercatat akurat dari awal.*

**Acceptance Criteria:**
- [ ] Pekerja dapat membuat ProductionCycle baru dari menu Produksi
- [ ] Form pembuatan batch memungkinkan pilih: Greenhouse, Instalasi, Benih (dari Active Pack), Media Tanam (dari Active Pack)
- [ ] Batch mendapat kode unik otomatis (format: GH-A1-240101-001)
- [ ] Jumlah benih disemai tercatat dan stok Active Pack berkurang otomatis
- [ ] Batch baru dimulai dengan fase SEMAI
- [ ] Tanggal semai dicatat otomatis
- [ ] Halaman daftar batch menampilkan semua siklus aktif per instalasi
- [ ] API POST /api/production membuat siklus baru dengan validasi

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API route /api/production (GET, POST) | 3 jam | List dan create cycle |
| Buat UI halaman daftar produksi /worker/production | 4 jam | Dengan status badge per fase |
| Buat form Tambah Batch dengan pilihan Greenhouse/Instalasi | 3 jam | Dropdown terhubung ke data |
| Integrasi pilihan Active Pack benih ke form | 2 jam | Filter hanya pack ACTIVE |
| Auto-generate kode batch dan kurangi stok Active Pack | 2 jam | Transaksional |

**Dependencies:** EPIC 1 selesai + US4.2 (Active Pack)

---

#### US3.2 — Manajemen Fase Produksi — Pindah Fase dengan Mudah

**Persona:** Agus (Pekerja) | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Frontend Dev

*Sebagai Pekerja, saya ingin mengubah fase tanaman (Semai ke Bibit ke Tanam ke Panen) dengan beberapa klik di HP sehingga saya bisa mencatat progress tanaman dari lapangan.*

**Acceptance Criteria:**
- [ ] Pekerja dapat melihat semua batch aktif beserta fase saat ini
- [ ] Tombol aksi besar tersedia untuk pindah ke fase berikutnya
- [ ] Konfirmasi dialog muncul sebelum perubahan fase dilakukan
- [ ] ProductionLog otomatis dibuat saat fase berubah (timestamp + user)
- [ ] Sistem validasi: fase hanya bisa maju, tidak bisa mundur
- [ ] Durasi di setiap fase dicatat untuk kalkulasi HPP
- [ ] Halaman produksi responsif dan mobile-friendly
- [ ] Filter batch berdasarkan fase, instalasi, dan tanggal

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API PUT /api/production/[id]/phase untuk update fase | 2 jam | Dengan validasi urutan fase |
| Buat komponen PhaseCard dengan tombol aksi besar | 3 jam | Mobile-first design |
| Implementasi konfirmasi dialog sebelum pindah fase | 1 jam | Shadcn Dialog |
| Auto-create ProductionLog setiap perubahan fase | 2 jam | Audit trail |
| Buat badge visual per fase (warna berbeda) | 1 jam | UX clarity |

**Dependencies:** US3.1 selesai

---

#### US3.3 — Submit Harvest Report oleh Pekerja

**Persona:** Agus (Pekerja) | **Priority:** HIGH | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai Pekerja, saya ingin mengirimkan laporan hasil panen dengan data berat total dan catatan lapangan agar Admin bisa mereview dan menetapkan HPP berdasarkan data aktual.*

**Acceptance Criteria:**
- [ ] Pekerja dapat submit Harvest Report dari batch yang sudah di fase HARVEST
- [ ] Form submit mencakup: total berat panen (kg), notes lapangan, foto kondisi (optional)
- [ ] Status HarvestReport dimulai dengan PENDING setelah submit
- [ ] Admin mendapat notifikasi di dashboard setelah pekerja submit
- [ ] Pekerja tidak dapat submit report kedua untuk batch yang sama
- [ ] Halaman riwayat panen menampilkan semua report yang pernah disubmit pekerja
- [ ] API POST /api/harvest untuk submit report baru

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API POST /api/harvest untuk submit report | 2 jam | |
| Buat form submit harvest di UI pekerja | 3 jam | Simple form, large inputs |
| Tampilkan status PENDING setelah submit | 1 jam |  xxx feedback |
| Tampilkan notifikasi di dashboard Admin | 2 jam | Badge counter |

**Dependencies:** US3.2 selesai

---

### 3.5 EPIC 4: Manajemen Inventaris & Bahan Baku

> **Tujuan:** Membangun sistem tracking stok yang terintegrasi dengan produksi dan akuntansi. Setiap pergerakan barang (masuk/keluar/adjust) harus tercatat, dan Active Pack lifecycle memungkinkan kalkulasi cost per unit yang akurat untuk input HPP.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-4 |
| Nama | Manajemen Inventaris & Bahan Baku |
| Sprint | Sprint 2 (Minggu 3–4) |
| Status | ✅ SELESAI |
| Story Points | 13 points |
| Team | Backend Dev |
| Dependencies | EPIC 1 selesai |

---

#### US4.1 — Manajemen Stok Inventaris — Input & Tracking

**Persona:** Siti (Admin) + Agus (Pekerja) | **Priority:** HIGHEST | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai Admin/Pekerja, saya ingin menambah, mengurangi, dan menyesuaikan stok barang (Nutrisi, Media Tanam, Benih) dengan mudah agar saldo inventaris selalu akurat dan dapat dipercaya.*

**Acceptance Criteria:**
- [ ] Halaman daftar inventaris menampilkan semua item dengan stok terkini
- [ ] Admin dapat menambah item inventaris baru dengan kategori (NUTRISI, MEDIA, BENIH, LAINNYA)
- [ ] Pekerja dapat mencatat pergerakan stok: IN (masuk), OUT (keluar), ADJUST (koreksi)
- [ ] Setiap pergerakan stok membuat InventoryLog otomatis
- [ ] Stok saat ini (currentStock) ter-update otomatis setelah setiap pergerakan
- [ ] Alert visual muncul jika stok di bawah minimum threshold
- [ ] Filter dan search item berdasarkan kategori dan nama
- [ ] API CRUD untuk /api/inventory

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API /api/inventory (GET, POST, PUT) | 3 jam | CRUD + movement endpoint |
| Buat halaman inventaris /worker/inventory | 4 jam | Daftar + form movement |
| Implementasi alert stok rendah | 2 jam | Visual badge merah jika < threshold |
| Buat log movement history per item | 2 jam | Audit trail inventory |

**Dependencies:** EPIC 1 selesai

---

#### US4.2 — Active Pack Lifecycle — Tracking Biaya Per Unit

**Persona:** Agus (Pekerja) | **Priority:** HIGH | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai Pekerja, saya ingin membuka 'Active Pack' dari batch benih atau rockwool yang baru dibeli agar sistem dapat mulai menghitung biaya per unit  untuk input kalkulasi HPP.*

**Acceptance Criteria:**
- [ ] Pekerja dapat membuka Active Pack baru dari item inventaris kategori BENIH atau MEDIA
- [ ] Saat membuka Active Pack, sistem mencatat: total unit, harga beli per pack, cost per unit kalkulasi otomatis
- [ ] Active Pack memiliki status: ACTIVE (sedang dipakai) atau DEPLETED (habis)
- [ ] Setiap penggunaan benih/media dalam produksi mengurangi sisa Active Pack
- [ ] Cost per unit dari Active Pack digunakan dalam kalkulasi HPP
- [ ] Riwayat semua Active Pack tersedia untuk audit
- [ ] Saat Active Pack habis, status otomatis berubah ke DEPLETED

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat model ActivePack dan relasi ke InventoryItem | 1 jam | Schema sudah ada di Prisma |
| Buat API /api/inventory/active-pack (POST, GET) | 3 jam | |
| Buat UI buka Active Pack baru | 2 jam | Form dengan kalkulasi cost/unit |
| Integrasi pengurangan Active Pack ke form buat batch produksi | 2 jam | |

**Dependencies:** US4.1 selesai

---

#### US4.3 — Alert Stok Rendah & Dashboard Summary

**Persona:** Siti (Admin) | **Priority:** MEDIUM | **Story Points:** 3 pts | **Assignee:** Frontend Dev

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat komponen alert summary di dashboard Admin | 1 jam | |

**Dependencies:** US4.1 selesai

---

### 3.6 EPIC 5: Manajemen Penjualan & Pengiriman

> **Tujuan:** Melengkapi siklus hilir bisnis dengan modul penjualan. Setelah panen disetujui dan HPP ditetapkan, hasil produksi harus bisa dijual ke pelanggan, pengirimannya di-track, dan pendapatannya otomatis masuk ke jurnal akuntansi.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-5 |
| Nama | Manajemen Penjualan & Pengiriman |
| Sprint | Sprint 3 (Minggu 5–6) — AKTIF |
| Status | 🔵 Saat Ini (Sprint 3) |
| Story Points | 34 points |
| Team | Backend Dev, Frontend Dev |
| Dependencies | EPIC 1, 2, 3, 4 selesai |

---

#### US5.1 — Manajemen Customer & Pembuatan Sales Order

**Persona:** Siti (Admin) | **Priority:** HIGHEST | **Story Points:** 13 pts | **Assignee:** Backend Dev

*Sebagai Admin, saya ingin mencatat pesanan penjualan (Sales Order) dari pelanggan dan mengelola data pelanggan agar proses penjualan terdokumentasi dengan baik dan terintegrasi dengan stok.*

**Acceptance Criteria:**
- [ ] Admin dapat menambah data pelanggan baru (nama, alamat, telp, email)
- [ ] Admin dapat membuat Sales Order baru dan memilih pelanggan
- [ ] Sales Order dapat menambah multiple item produk dengan jumlah dan harga
- [ ] Sistem validasi stok mencukupi sebelum SO dibuat
- [ ] SO memiliki status: DRAFT, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- [ ] Admin dapat mengkonfirmasi SO — stok langsung berkurang
- [ ] Nomor SO auto-generate (format: SO-2025-001)
- [ ] Halaman daftar SO dengan filter status dan pelanggan
- [ ] API CRUD untuk /api/sales-orders dan /api/customers

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Design schema Customer dan SalesOrder di Prisma | 2 jam | Migration baru |
| Buat API /api/customers (GET, POST, PUT) | 3 jam | CRUD pelanggan |
| Buat API /api/sales-orders (GET, POST, PUT) | 4 jam | Termasuk item lines |
| Buat halaman daftar SO /admin/sales | 4 jam | Tabel dengan filter |
| Buat form buat SO baru dengan dynamic item lines | 4 jam | Mirip form jurnal |
| Implementasi validasi stok saat SO dikonfirmasi | 2 jam | Transaksional |
| Auto-kurangi stok setelah SO confirmed | 2 jam | Inventory log OUT |

**Dependencies:** EPIC 1–4 selesai

---

#### US5.2 — Tambah Item Inventory ke Sales Order

**Persona:** Siti (Admin) | **Priority:** HIGH | **Story Points:** 5 pts | **Assignee:** Backend Dev

*Sebagai Admin, saya ingin memasukkan item inventaris yang akan dijual ke dalam Sales Order beserta jumlah dan harganya agar transaksi penjualan tercatat.*

**Acceptance Criteria:**
- [ ] Form SO menampilkan dropdown item dari inventaris yang tersedia
- [ ] Admin dapat menambah/hapus item dari SO secara dinamis
- [ ] Harga jual per unit dapat diinput manual (override dari HPP)
- [ ] Subtotal per item kalkulasi otomatis (qty x harga)
- [ ] Total SO kalkulasi otomatis dari semua item
- [ ] Warning jika qty melebihi stok yang tersedia

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat komponen SalesOrderItemLine dinamis | 3 jam | Add/remove rows |
| Implementasi dropdown item dengan stok tersedia | 2 jam |  xxx stok info |
| Kalkulasi subtotal dan total otomatis | 1 jam | Client-side calculation |

**Dependencies:** US5.1 selesai

---

#### US5.3 — Update Status Pengiriman

**Persona:** Agus (Pekerja) | **Priority:** HIGH | **Story Points:** 8 pts | **Assignee:** Frontend Dev

*Sebagai Pekerja/Kurir, saya ingin mengupdate status pengiriman barang menjadi 'SHIPPED' dan 'DELIVERED' agar Admin dan Owner dapat memantau progress pengiriman 
**Acceptance Criteria:**
- [ ] Pekerja melihat daftar SO yang perlu dikirim di dashboard
- [ ] Pekerja dapat mengubah status SO dari CONFIRMED ke SHIPPED ke DELIVERED
- [ ] Setiap perubahan status mencatat timestamp dan user yang melakukan
- [ ] Pekerja dapat menambah catatan pengiriman saat update status
- [ ] Admin dan Owner dapat melihat status pengiriman terkini di  xxx
- [ ] Filter daftar pengiriman berdasarkan status

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat halaman daftar pengiriman /worker/delivery | 3 jam | |
| Buat tombol update status pengiriman | 2 jam | Large buttons, mobile-friendly |
| Implementasi delivery log (timestamp + user + notes) | 2 jam | Audit trail |
|  xxx status update di dashboard Admin | 1 jam | |

**Dependencies:** US5.1 selesai

---

#### US5.4 — Auto-Generate Jurnal Pendapatan saat SO Dibayar

**Persona:** Sistem | **Priority:** HIGHEST | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai sistem, saya ingin secara otomatis membuat jurnal pendapatan ketika Sales Order berstatus DELIVERED dan pembayaran dikonfirmasi agar laporan keuangan selalu akurat tanpa input manual.*

**Acceptance Criteria:**
- [ ] Sistem otomatis membuat JournalLine saat SO status berubah ke DELIVERED
- [ ] Jurnal debit: Kas/Piutang Dagang (sesuai metode bayar)
- [ ] Jurnal kredit: Pendapatan Penjualan
- [ ] Jurnal kredit tambahan: HPP (beban pokok penjualan) debit, Persediaan Barang Jadi kredit
- [ ] Transaksi jurnal otomatis berstatus PENDING — Admin masih perlu approve
- [ ] Referensi SO number tercantum di deskripsi jurnal untuk traceability

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat service autoJournalFromSalesOrder di lib/accounting.ts | 4 jam | Pure function |
| Integrasi service ke SO status update handler | 2 jam | Trigger saat DELIVERED |
| Test kalkulasi jurnal untuk berbagai skenario | 2 jam | Unit testing |

**Dependencies:** US5.1, US2.2 selesai

---

### 3.7 EPIC 6: Dashboard, Visualisasi & Export

> **Tujuan:** Meningkatkan pengalaman Owner dan Admin melalui visualisasi data yang powerful dan kemampuan export laporan. Dashboard bukan sekedar angka — melainkan insight yang bisa langsung digunakan untuk pengambilan keputusan bisnis.

| Field | Keterangan |
|---|---|
| Epic ID | EPIC-6 |
| Nama | Dashboard, Visualisasi & Export |
| Sprint | Sprint 4 (Minggu 7–8) |
| Status | ⏳ Belum Dimulai |
| Story Points | 21 points |
| Team | Frontend Dev, Backend Dev |
| Dependencies | EPIC 1–5 selesai |

---

#### US6.1 — Grafik Pendapatan Bulanan di Dashboard Owner

**Persona:** Budi (Owner) | **Priority:** HIGH | **Story Points:** 8 pts | **Assignee:** Frontend Dev

*Sebagai Owner, saya ingin melihat grafik pendapatan bulanan dibandingkan dengan pengeluaran agar saya dapat menganalisa tren bisnis dan mengambil keputusan strategis tanpa perlu membaca tabel angka.*

**Acceptance Criteria:**
- [ ] Dashboard Owner menampilkan line chart pendapatan vs pengeluaran 12 bulan terakhir
- [ ] Chart interaktif — hover menampilkan tooltip dengan angka detail
- [ ] Filter chart berdasarkan periode (3 bulan, 6 bulan, 1 tahun)
- [ ] Angka KPI summary: total pendapatan, total pengeluaran, net profit, margin
- [ ] Data chart di-fetch dari API yang sudah diagregasi per bulan
- [ ] Chart responsif untuk mobile (stacked view)
- [ ] Loading skeleton saat data sedang di-fetch

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API /api/reports/monthly-summary | 3 jam | Agregasi data per bulan |
| Install Recharts dan setup chart components | 2 jam | |
| Buat komponen LineChart pendapatan vs pengeluaran | 4 jam | Responsive + tooltip |
| Buat KPI summary cards di atas chart | 2 jam | Net profit, margin |
| Implementasi filter periode | 2 jam | |

**Dependencies:** EPIC 1–5 selesai

---

#### US6.2 — Pie Chart Breakdown Biaya Operasional

**Persona:** Budi (Owner) | **Priority:** MEDIUM | **Story Points:** 5 pts | **Assignee:** Frontend Dev

*Sebagai Owner, saya ingin melihat pie chart breakdown biaya operasional (listrik vs nutrisi vs gaji vs overhead) agar saya tahu komponen biaya mana yang paling besar dan perlu diefisienkan.*

**Acceptance Criteria:**
- [ ] Dashboard Owner menampilkan pie/donut chart breakdown biaya
- [ ] Komponen biaya: Listrik, Nutrisi, Benih, Gaji, Overhead, Lainnya
- [ ] Klik pada segment pie — drill-down ke detail transaksi biaya tersebut
- [ ] Periode breakdown dapat difilter (bulan, kuartal, tahun)
- [ ] Persentase setiap komponen ditampilkan di legend

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Buat API /api/reports/cost-breakdown | 2 jam | Agregasi per kategori COA |
| Buat komponen PieChart/DonutChart | 3 jam | Recharts PieChart |
| Implementasi drill-down ke detail transaksi | 2 jam | Link ke jurnal terfilter |

**Dependencies:** US6.1 selesai

---

#### US6.3 — Export Laporan Keuangan PDF & Excel

**Persona:** Siti (Admin) + Budi (Owner) | **Priority:** HIGH | **Story Points:** 8 pts | **Assignee:** Backend Dev

*Sebagai Admin/Owner, saya ingin men-download laporan keuangan (Jurnal, Neraca, Laba-Rugi) dalam format Excel dan PDF agar dapat disimpan secara offline, dikirim ke akuntan, atau dijadikan dokumen resmi.*

**Acceptance Criteria:**
- [ ] Admin dapat export daftar jurnal ke Excel (.xlsx) dengan filter yang aktif
- [ ] Admin/Owner dapat export laporan neraca ke PDF
- [ ] Admin/Owner dapat export laporan laba-rugi ke PDF
- [ ] Format Excel mencakup semua kolom yang visible di UI
- [ ] Format PDF menggunakan template profesional dengan logo dan periode
- [ ] Export berjalan secara background (tidak freeze browser)
- [ ] File nama otomatis: NamaLaporan_YYYYMM.xlsx/pdf

**Task Breakdown:**

| Task | Jam | Keterangan |
|---|---|---|
| Install dan setup library xlsx untuk export Excel | 2 jam | npm install xlsx |
| Install dan setup jspdf + autotable untuk export PDF | 2 jam | |
| Buat API /api/export/journal, /api/export/balance-sheet | 4 jam | Streaming response |
| Buat tombol export di halaman jurnal dan laporan | 2 jam | Dengan loading indicator |

**Dependencies:** EPIC 2 selesai

---

## 4. Sprint Planning — Detail per Sprint

Setiap sprint berdurasi 2 minggu (10 hari kerja).

### 4.1 Sprint 1 — Foundation & Database

| Field | Detail |
|---|---|
| Sprint Goal | Setup arsitektur dasar, schema database, dan authentication system yang siap pakai |
| Durasi | Minggu 1–2 (10 hari kerja) |
| Kapasitas | 80 jam (3 orang x ~27 jam/orang) |
| Story Points | 34 points |
| Sprint Status | ✅ SELESAI |

**Sprint 1 Timeline:**

| Hari | Fokus Utama | Output | Assignee |
|---|---|---|---|
| Day 1–2 | Project setup, ESLint/Prettier, Tailwind, Shadcn | Project running di localhost:3000 | Tech Lead |
| Day 3–4 | Design ERD, review dengan stakeholder, PostgreSQL setup | ERD approved, PostgreSQL running | DB Admin + Team |
| Day 5–6 | Implementasi Prisma schema, migrations, seed data | 11 tabel terbuat, seed berhasil | DB Admin |
| Day 7–8 | NextAuth.js setup, credential provider, login page | Login/logout flow berfungsi per role | Backend Dev |
| Day 9–10 | Middleware routing, testing, dokumentasi, demo prep | Sprint demo ready, semua AC terpenuhi | Semua Tim |

---

### 4.2 Sprint 2 — Core Business Logic

| Field | Detail |
|---|---|
| Sprint Goal | Pekerja bisa input produksi, Admin bisa kelola jurnal akuntansi, COA, dan menyetujui panen dengan HPP otomatis |
| Durasi | Minggu 3–4 (10 hari kerja) |
| Kapasitas | 80 jam |
| Story Points | 55 points (EPIC 2, 3, 4) |
| Sprint Status | ✅ SELESAI |

**Sprint 2 Timeline:**

| Hari | Fokus Utama | Output | Assignee |
|---|---|---|---|
| Day 1–2 | Chart of Accounts UI + API, seed COA lengkap | COA admin page functional | Backend Dev |
| Day 3–4 | Form jurnal double-entry, validasi debit=kredit | Jurnal admin page functional | Backend Dev |
| Day 5–6 | Inventaris UI (list, movement, active pack) | Worker inventory page functional | Backend Dev |
| Day 7–8 | Produksi UI (batch list, phase cards, submit harvest) | Worker production page functional | Frontend Dev |
| Day 9–10 | Integrasi HPP calculator, approval flow panen, testing | End-to-end harvest flow berfungsi | Semua Tim |

---

### 4.3 Sprint 3 — Sales & Delivery Module (AKTIF)

| Field | Detail |
|---|---|
| Sprint Goal | Menyelesaikan siklus hilir: penjualan hasil panen ke pelanggan, tracking pengiriman, dan integrasi jurnal pendapatan otomatis |
| Durasi | Minggu 5–6 (10 hari kerja) |
| Kapasitas | 80 jam |
| Story Points | 34 points (EPIC 5) |
| Sprint Status | 🔵 Sedang Berjalan |

**Sprint 3 Backlog:**

| ID | Task | Estimasi | Assignee | Status |
|---|---|---|---|---|
| T3.1 | Prisma schema tambahan: Customer, SalesOrder, SalesOrderItem | 4 jam | DB Admin | TODO |
| T3.2 | API CRUD /api/customers | 3 jam | Backend | TODO |
| T3.3 | API CRUD /api/sales-orders dengan item lines | 6 jam | Backend | TODO |
| T3.4 | Halaman daftar SO /admin/sales dengan filter status | 5 jam | Frontend | TODO |
| T3.5 | Form buat SO baru dengan dynamic item lines | 5 jam | Frontend | TODO |
| T3.6 | Halaman pengiriman /worker/delivery | 4 jam | Frontend | TODO |
| T3.7 | Service autoJournalFromSalesOrder | 5 jam | Backend | TODO |
| T3.8 | Integration testing end-to-end sales flow | 3 jam | Tim | TODO |

---

### 4.4 Sprint 4 — Visualisasi & Export

| Field | Detail |
|---|---|
| Sprint Goal | Meningkatkan pengalaman Owner dengan visualisasi data charts dan kemampuan export laporan ke PDF/Excel |
| Durasi | Minggu 7–8 (10 hari kerja) |
| Kapasitas | 80 jam |
| Story Points | 21 points (EPIC 6) |
| Sprint Status | ⏳ Belum Dimulai |

**Sprint 4 Backlog:**

| ID | Task | Estimasi | Assignee | Status |
|---|---|---|---|---|
| T4.1 | Install Recharts + setup chart base components | 2 jam | Frontend | TODO |
| T4.2 | API /api/reports/monthly-summary (agregasi per bulan) | 3 jam | Backend | TODO |
| T4.3 | Komponen LineChart pendapatan vs pengeluaran | 4 jam | Frontend | TODO |
| T4.4 | API + Komponen PieChart breakdown biaya operasional | 5 jam | Frontend | TODO |
| T4.5 | Export Excel untuk jurnal (library xlsx) | 4 jam | Backend | TODO |
| T4.6 | Export PDF untuk neraca & laba-rugi (jspdf) | 5 jam | Backend | TODO |
| T4.7 | UI tombol export di semua halaman relevan | 2 jam | Frontend | TODO |

---

### 4.5 Sprint 5 — QA, Usability Testing & Go-Live

| Field | Detail |
|---|---|
| Sprint Goal | Memastikan sistem benar-benar siap digunakan di lapangan — bebas bug, nyaman dipakai oleh ketiga persona, dan siap deploy ke production |
| Durasi | Minggu 9–10 (10 hari kerja) |
| Kapasitas | 80 jam |
| Story Points | 13 points (QA tasks) |
| Sprint Status | ⏳ Belum Dimulai |

**Sprint 5 Backlog:**

| ID | Task | Estimasi | Assignee | Status |
|---|---|---|---|---|
| T5.1 | Usability test Task 1 dengan Pekerja di greenhouse (HP + sarung tangan) | 4 jam | UX + Dev | TODO |
| T5.2 | Usability test Task 2 dengan Admin (filter jurnal) | 2 jam | UX + Dev | TODO |
| T5.3 | Usability test Task 3 dengan Owner (baca grafik) | 2 jam | UX + Dev | TODO |
| T5.4 | Audit akuntansi: verifikasi saldo Debit = Kredit semua transaksi | 4 jam | Backend | TODO |
| T5.5 | Bug fixing berdasarkan hasil usability testing | 8 jam | Semua Tim | TODO |
| T5.6 | Setup Vercel production deployment + environment variables | 3 jam | DevOps | TODO |
| T5.7 | Production database setup (PostgreSQL cloud) | 2 jam | DevOps | TODO |
| T5.8 | Final performance testing dan security review | 3 jam | Senior Dev | TODO |
| T5.9 | Go-live: launch production, training users | 3 jam | PM + Dev | TODO |

---

## 5. Definition of Done (DoD)

Definition of Done adalah kontrak tim. Sebuah User Story **HANYA** dianggap selesai jika memenuhi **SEMUA** kriteria berikut tanpa kecuali.

### 5.1 DoD Level User Story

| # | Kriteria | Validator | Level |
|---|---|---|---|
| 1 | Semua Acceptance Criteria (AC) terpenuhi 100% | Product Owner | 🔴 WAJIB |
| 2 | Code di-review dan approved oleh minimal 1 developer lain | Tech Lead | 🔴 WAJIB |
| 3 | TypeScript compilation bersih tanpa error dan warning | CI/CD | 🔴 WAJIB |
| 4 | ESLint dan Prettier lulus tanpa violation | CI/CD | 🔴 WAJIB |
| 5 | Tidak ada console.error atau console.warn di production mode | Developer | 🔴 WAJIB |
| 6 | API endpoint memiliki proper error handling dan response codes | Backend Dev | 🔴 WAJIB |
| 7 | UI responsif dan berfungsi baik di mobile (min 375px) dan desktop | Frontend Dev | 🔴 WAJIB |
| 8 | Database migration (jika ada) sudah di-run dan terdokumentasi | DB Admin | 🔴 WAJIB |
| 9 | Demo data di seed.ts sudah ter-update jika fitur baru memerlukan | Backend Dev | 🔴 WAJIB |
| 10 | Dokumentasi API (di README atau komentar kode) ter-update | Developer | 🟠 PENTING |
| 11 | Edge cases dan error states sudah di-handle di UI | Frontend Dev | 🟠 PENTING |
| 12 | Tidak ada data yang di-hardcode — semua dari database | Developer | 🔴 WAJIB |

### 5.2 DoD Level Sprint

| # | Kriteria Sprint Done | Bukti |
|---|---|---|
| 1 | Semua User Stories dalam Sprint Backlog sudah memenuhi DoD Level US | Sprint Review demo berhasil |
| 2 | Sprint Review/Demo telah dilakukan di depan Product Owner dan stakeholder | Meeting notes tersedia |
| 3 | Sprint Retrospective telah dilakukan dan action items tercatat | Retro board tersimpan |
| 4 | Velocity sprint tercatat (story points completed vs planned) | Agile board updated |
| 5 | Application berjalan tanpa crash di environment staging | Deploy log bersih |
| 6 | Tidak ada known P1 (critical) bugs yang belum di-fix | Bug tracker clear |

---

## 6. Risk Register

Risk register adalah living document yang mencatat semua risiko yang diidentifikasi, probabilitas terjadinya, dampaknya, dan strategi mitigasi. Dokumen ini **harus direview setiap awal sprint**.

| ID | Risiko | Deskripsi | Prob. | Dampak | Mitigasi |
|---|---|---|:---:|:---:|---|
| R-01 | Database Schema Complexity | Relasi 11 tabel + HPP ABC bisa berubah requirements di tengah jalan | 🟠 MEDIUM | 🔴 HIGH | ERD sign-off wajib sebelum coding. 1 sprint buffer untuk schema change. |
| R-02 | Prisma N+1 Query Performance | Relasi kompleks bisa generate query tidak efisien dan database slow | 🟠 MEDIUM | 🟠 MEDIUM | Query profiling dari awal. Gunakan Prisma include/select secara selektif. |
| R-03 | Authentication Security Gaps | NextAuth yang misconfigure bisa buka celah CSRF, session hijacking | 🟢 LOW | 🔴 CRITICAL | Follow NextAuth best practices, code review khusus auth, gunakan HTTPS dev. |
| R-04 | Kalkulasi HPP Tidak Akurat | Bug di HPP engine bisa berdampak langsung ke keputusan bisnis Owner | 🟠 MEDIUM | 🔴 CRITICAL | Unit test komprehensif untuk HPP calculator. Validasi dengan akuntan. |
| R-05 | Team Knowledge Gap | Jika tim belum familiar Prisma/Next.js 14 App Router, setup bisa delay | 🟠 MEDIUM | 🟠 MEDIUM | Knowledge sharing session di sprint kickoff. Dokumentasi internal tersedia. |
| R-06 | Scope Creep dari Stakeholder | Owner atau Admin bisa minta fitur baru di tengah sprint | 🔴 HIGH | 🟠 MEDIUM | Backlog grooming ketat. Fitur baru masuk backlog, bukan sprint aktif. |
| R-07 | Mobile UX Tidak Sesuai Ekspektasi Pekerja | UI di HP sulit dipakai pekerja di lapangan — resistensi adopsi | 🟠 MEDIUM | 🔴 HIGH | Usability testing dengan pekerja di Sprint 5. Prototyping mobile-first. |
| R-08 | Data Loss / Corruption | Bug di accounting engine bisa membuat data jurnal tidak konsisten | 🟢 LOW | 🔴 CRITICAL | Backup database otomatis harian. Transaction rollback jika kalkulasi gagal. |
| R-09 | External Library Breaking Change | Next.js, Prisma, atau NextAuth update major version di tengah proyek | 🟢 LOW | 🟠 MEDIUM | Lock version di package.json. Update library hanya saat Sprint boundary. |
| R-10 | Deployment Environment Mismatch | Aplikasi berjalan di local tapi gagal di production (env vars, DB) | 🟠 MEDIUM | 🔴 HIGH | Staging environment di Sprint 3. Checklist deployment. .env.example lengkap. |

---

## 7. UCD Usability Testing Plan — Sprint 5

Sebelum go-live, sistem harus divalidasi langsung dengan pengguna nyata. Pengujian ini menggunakan metode Task-Based Usability Testing dengan 3 skenario yang merepresentasikan setiap persona.

### 7.1 Test Setup & Protokol

| Field | Detail |
|---|---|
| Metode | Task-Based Usability Testing (Think Aloud Protocol) |
| Jumlah Peserta | Minimal 3 orang (1 per persona: Owner, Admin, Pekerja) |
| Environment | Staging server + HP Android (min Android 10) untuk test pekerja |
| Rekaman | Screen recording + voice recording (dengan consent) |
| Durasi per Sesi | 45–60 menit per peserta |
| Fasilitator | UX researcher atau Tech Lead |

---

### 7.2 Test Tasks

#### Test Task 1 — Persona Pekerja: Pindah Fase Batch

> **Kondisi:** Peserta (pekerja lapangan) menggunakan HP sambil menggunakan sarung tangan tipis.
>
> **Instruksi:** "Batch selada B-001 sudah cukup besar untuk dipindah dari fase Bibit ke Tanam. Tolong lakukan perpindahan itu melalui aplikasi ini."
>
> **Metrik Sukses:** Selesai dalam < 1 menit tanpa bantuan. Tidak ada pertanyaan "Tombolnya di mana?"
>
> **Metrik Gagal:** Butuh > 2 menit, salah pilih batch, atau butuh bantuan fasilitator.
>
> **Poin Observasi:** Apakah tombol cukup besar? Apakah batch mudah ditemukan? Apakah konfirmasi dialog jelas?

---

#### Test Task 2 — Persona Admin: Filter & Temukan Jurnal

> **Kondisi:** Peserta (admin/pembukuan) menggunakan laptop di kantor.
>
> **Instruksi:** "Cari jurnal transaksi biaya listrik Greenhouse A untuk bulan lalu."
>
> **Metrik Sukses:** Ditemukan dalam < 3 klik, waktu < 2 menit.
>
> **Metrik Gagal:** Butuh > 5 klik, tidak bisa menemukan jurnal, atau salah jurnal.
>
> **Poin Observasi:** Apakah filter jurnal intuitif? Apakah deskripsi transaksi cukup informatif untuk dibedakan?

---

#### Test Task 3 — Persona Owner: Baca Grafik Performa

> **Kondisi:** Peserta (pemilik) menggunakan tablet atau laptop.
>
> **Instruksi:** "Tanpa membuka tabel angka, tolong ceritakan: bulan apa keuntungan paling tinggi dalam 6 bulan terakhir? Dan apa kira-kira penyebabnya?"
>
> **Metrik Sukses:** Bisa menjawab bulan yang benar dalam < 30 detik hanya dengan melihat grafik.
>
> **Metrik Gagal:** Tidak bisa menjawab, butuh membuka tabel detail, atau jawaban salah.
>
> **Poin Observasi:** Apakah grafik terbaca? Apakah sumbu Y dan tooltip membantu? Apakah warna line membedakan pendapatan vs pengeluaran?

---

### 7.3 Rubrik Penilaian & Tindak Lanjut

| Hasil Test | Skor | Artinya | Tindak Lanjut |
|---|---|---|---|
| Semua task selesai tanpa bantuan | Excellent (>85/100) | UX sudah baik | Minor polish saja |
| 1–2 task butuh petunjuk kecil | Good (70–84/100) | UX cukup, ada gap | Fix UI pada area bermasalah |
| Mayoritas task butuh bantuan | Needs Work (<70/100) | UX bermasalah signifikan | Desain ulang komponen bermasalah, test ulang |

---

## 8. Role-Based Access Control (RBAC)

Sistem mengimplementasikan tiga level akses yang ketat. Setiap role memiliki akses yang tepat sesuai tanggung jawabnya — tidak lebih, tidak kurang.

### 8.1 Matrix Hak Akses

| Fitur / Modul | Owner | Admin | Pekerja |
|---|:---:|:---:|:---:|
| Dashboard Finansial (overview) | ✅ Full | ⚠️ Partial | ❌ Tidak |
| Grafik & Analytics Tren | ✅ Full | ❌ Tidak | ❌ Tidak |
| Chart of Accounts (COA) | 👁️ View Only | ✅ Full CRUD | ❌ Tidak |
| Jurnal Transaksi (input) | ❌ Tidak | ✅ Create & Approve | ❌ Tidak |
| Jurnal Transaksi (lihat) | ✅ Full | ✅ Full | ❌ Tidak |
| Approval Harvest Report | ❌ Tidak | ✅ Full | ❌ Tidak |
| Penetapan HPP | ❌ Tidak | ✅ Full | ❌ Tidak |
| Sales Order (buat & confirm) | ❌ Tidak | ✅ Full | ❌ Tidak |
| Update Status Pengiriman | ❌ Tidak | ✅ Full | ✅ Full |
| Produksi — Buat Batch Baru | ❌ Tidak | ❌ Tidak | ✅ Full |
| Produksi — Pindah Fase | ❌ Tidak | ❌ Tidak | ✅ Full |
| Produksi — Submit Harvest Report | ❌ Tidak | ❌ Tidak | ✅ Full |
| Inventaris — Lihat Stok | ✅ Full | ✅ Full | ✅ Full |
| Inventaris — Input Movement | ❌ Tidak | ✅ Full | ✅ Full |
| Inventaris — Buka Active Pack | ❌ Tidak | ✅ Full | ✅ Full |
| Laporan Neraca & Laba-Rugi | ✅ Full | ✅ Full | ❌ Tidak |
| Export PDF / Excel | ✅ Full | ✅ Full | ❌ Tidak |
| Manajemen User (tambah/hapus) | ✅ Full | ❌ Tidak | ❌ Tidak |
| Prive / Penarikan Dana | ✅ Full | ❌ Tidak | ❌ Tidak |

---

## 9. Referensi API Endpoints

Semua endpoint menggunakan RESTful convention. Authentication menggunakan NextAuth session. Semua response dalam format JSON.

| Method | Endpoint | Deskripsi | Role | Sprint |
|---|---|---|---|---|
| `POST` | /api/auth/signin | Login dengan email & password | All | Sprint 1 |
| `GET` | /api/auth/session | Get session aktif | All | Sprint 1 |
| `GET` | /api/accounts | List semua COA (Chart of Accounts) | Admin, Owner | Sprint 2 |
| `POST` | /api/accounts | Buat akun COA baru | Admin | Sprint 2 |
| `PUT` | /api/accounts/[id] | Update data akun COA | Admin | Sprint 2 |
| `GET` | /api/transactions | List jurnal transaksi (dengan filter) | Admin, Owner | Sprint 2 |
| `POST` | /api/transactions | Buat draft jurnal baru | Admin | Sprint 2 |
| `PUT` | /api/transactions/[id] | Approve / reject transaksi | Admin | Sprint 2 |
| `GET` | /api/production | List semua siklus produksi | All | Sprint 2 |
| `POST` | /api/production | Buat batch semai baru | Pekerja | Sprint 2 |
| `PUT` | /api/production/[id]/phase | Pindah fase batch produksi | Pekerja | Sprint 2 |
| `GET` | /api/harvest | List semua harvest report | Admin | Sprint 2 |
| `POST` | /api/harvest | Submit harvest report baru | Pekerja | Sprint 2 |
| `PUT` | /api/harvest/[id]/approve | Approve harvest & tetapkan HPP | Admin | Sprint 2 |
| `GET` | /api/inventory | List semua item inventaris | All | Sprint 2 |
| `POST` | /api/inventory | Tambah item inventaris baru | Admin | Sprint 2 |
| `POST` | /api/inventory/movement | Catat pergerakan stok (IN/OUT/ADJUST) | Pekerja, Admin | Sprint 2 |
| `POST` | /api/inventory/active-pack | Buka Active Pack baru | Pekerja, Admin | Sprint 2 |
| `GET` | /api/customers | List semua pelanggan | Admin | Sprint 3 |
| `POST` | /api/customers | Tambah pelanggan baru | Admin | Sprint 3 |
| `GET` | /api/sales-orders | List semua Sales Order | Admin, Owner | Sprint 3 |
| `POST` | /api/sales-orders | Buat Sales Order baru | Admin | Sprint 3 |
| `PUT` | /api/sales-orders/[id]/confirm | Konfirmasi SO (kurangi stok) | Admin | Sprint 3 |
| `PUT` | /api/sales-orders/[id]/deliver | Update status pengiriman | Pekerja, Admin | Sprint 3 |
| `GET` | /api/reports/monthly-summary | Data chart bulanan pendapatan vs pengeluaran | Owner, Admin | Sprint 4 |
| `GET` | /api/reports/cost-breakdown | Data chart breakdown biaya operasional | Owner, Admin | Sprint 4 |
| `GET` | /api/export/journal | Export jurnal ke Excel (.xlsx) | Admin | Sprint 4 |
| `GET` | /api/export/balance-sheet | Export neraca ke PDF | Owner, Admin | Sprint 4 |
| `GET` | /api/export/income-statement | Export laba-rugi ke PDF | Owner, Admin | Sprint 4 |

---

## 10. Demo Accounts & Deployment

### 10.1 Demo Accounts (Setelah Running Seed)

| Role | Email | Password | Akses Dashboard |
|---|---|---|---|
| Owner (Budi) | owner@kebunhijau.com | password123 | Financial Intelligence, Analytics, Grafik |
| Admin (Siti) | admin@kebunhijau.com | password123 | Journal, COA, Approval, Sales |
| Pekerja (Agus) | worker@kebunhijau.com | password123 | Produksi, Inventaris, Pengiriman |

> ⚠️ **PERINGATAN KEAMANAN:** Password demo `password123` HARUS diganti sebelum deployment ke production. Generate `NEXTAUTH_SECRET` baru dengan:
> ```bash
> openssl rand -base64 32
> ```

---

### 10.2 Deployment Checklist

| # | Checklist Item | Status |
|---|---|---|
| 1 | Environment variables production sudah di-set (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET) | ⏳ Belum |
| 2 | NEXTAUTH_SECRET di-generate dengan openssl rand -base64 32 (minimal 32 karakter) | ⏳ Belum |
| 3 | Database production PostgreSQL sudah disetup (Railway, Supabase, atau VPS) | ⏳ Belum |
| 4 | npx prisma db push sudah di-run di database production | ⏳ Belum |
| 5 | npx prisma generate sudah di-run setelah schema update | ⏳ Belum |
| 6 | npm run build berhasil tanpa error (TypeScript, ESLint clean) | ⏳ Belum |
| 7 | Vercel project dihubungkan ke repository GitHub | ⏳ Belum |
| 8 | Environment variables sudah diinput di Vercel Dashboard | ⏳ Belum |
| 9 | Custom domain sudah dikonfigurasi (jika ada) | ⏳ Belum |
| 10 | HTTPS aktif (Vercel auto-handle ini) | ⏳ Belum |
| 11 | Demo accounts password sudah diganti di production | ⏳ Belum |
| 12 | Backup database otomatis dikonfigurasi | ⏳ Belum |

---

## 11. Glosarium Istilah

| Istilah | Definisi |
|---|---|
| **DWC** | Deep Water Culture — metode hidroponik di mana akar tanaman terendam langsung dalam larutan nutrisi beroksigen |
| **Double-Entry** | Sistem pencatatan akuntansi di mana setiap transaksi dicatat di dua akun: satu debit dan satu kredit, dengan total keduanya selalu sama |
| **HPP** | Harga Pokok Produksi — total biaya yang dikeluarkan untuk menghasilkan satu unit produk |
| **ABC Costing** | Activity-Based Costing — metode HPP yang mengalokasikan biaya berdasarkan aktivitas yang mengkonsumsinya |
| **COA** | Chart of Accounts — daftar terstruktur semua akun yang digunakan dalam sistem pembukuan |
| **Active Pack** | Konsep tracking unit paket benih atau media tanam yang sedang aktif digunakan, untuk kalkulasi cost per unit |
| **ProductionCycle** | Satu siklus produksi lengkap dari benih disemai hingga panen, diidentifikasi dengan batch code unik |
| **HarvestReport** | Laporan hasil panen yang disubmit pekerja dan direview admin sebelum HPP ditetapkan |
| **EPIC** | Kumpulan User Stories yang berkaitan dengan satu modul atau fitur besar dalam proyek |
| **User Story** | Deskripsi fitur dari sudut pandang pengguna: "Sebagai [siapa], saya ingin [apa], agar [kenapa]" |
| **Story Point** | Satuan relatif untuk mengukur kompleksitas dan usaha pengembangan sebuah User Story |
| **Sprint Backlog** | Daftar user stories dan tasks yang dipilih untuk dikerjakan dalam satu sprint |
| **DoD** | Definition of Done — kriteria yang harus terpenuhi agar sebuah item pekerjaan dianggap selesai |
| **Velocity** | Jumlah story points yang berhasil diselesaikan dalam satu sprint — digunakan untuk perencanaan sprint berikutnya |
| **Sales Order (SO)** | Dokumen resmi yang mencatat pesanan penjualan dari pelanggan, beserta item dan harga |
| **Middleware** | Kode Next.js yang berjalan sebelum request mencapai halaman — digunakan untuk autentikasi dan routing berbasis role |

---

## 12. Penutup & Living Document Policy

> **Ini adalah Living Document**
>
> Dokumen ini bersifat hidup (living document) dan **HARUS** di-update di setiap milestone berikut:
>
> - **Setiap Sprint Review:** Update status sprint, tandai User Stories yang selesai
> - **Setiap Sprint Retrospective:** Tambahkan lessons learned ke risk register
> - **Saat ada perubahan requirement:** Tambahkan user stories baru, update estimasi
> - **Saat ada risiko baru teridentifikasi:** Tambahkan ke Risk Register
> - **Saat Usability Testing selesai:** Update hasil ke Section 7
>
> Versi dokumen harus di-increment setiap kali ada update signifikan. Format: **MAJOR.MINOR.PATCH**

---

### 12.1 Kontribusi & Perubahan Dokumen

| Versi | Tanggal | Perubahan | Author |
|---|---|---|---|
| 1.0.0 | 2025 | Initial release — semua section pertama kali dibuat | Kebun Hijau Dev Team |
| 1.x.x | Sprint 2 | Update status sprint, tambah lessons learned | — |
| 2.0.0 | Sprint 5 | Update hasil usability testing, final go-live checklist | — |

---

<div align="center">

**KEBUN HIJAU**

*Modernizing Hydroponic Operations*

Agile & UCD Framework v1.0.0 | Konfidensial

© 2025 Kebun Hijau — All Rights Reserved

</div>
