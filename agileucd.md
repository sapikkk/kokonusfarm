# 🌿 Kebun Hijau: Agile & UCD Framework

Dokumen ini berisi instrumen lengkap manajemen proyek "Kebun Hijau" menggunakan pendekatan **Agile Scrum** yang dipadukan dengan **User-Centered Design (UCD)**.

---

## 1. 👥 UCD: User Personas

Sistem ini didesain berdasarkan kebutuhan 3 pengguna utama:

### 🧑‍💼 Persona 1: sapik (Owner / Pemilik)
- **Tujuan**: Memantau keuntungan, melihat tren pertumbuhan bisnis, dan menarik dana (prive) dengan mudah.
- **Pain Points**: Sulit melacak biaya operasional (listrik, nutrisi) secara real-time dan mengetahui HPP pasti per panen.
- **Kebutuhan UX**: Dashboard visual yang intuitif, grafik pendapatan vs pengeluaran, ringkasan singkat tanpa perlu masuk ke detail teknis.

### 👩‍💻 Persona 2: admin (Admin / Pembukuan)
- **Tujuan**: Mencatat semua transaksi keuangan dengan standar akuntansi (Double-Entry), menetapkan HPP, dan merekap order penjualan.
- **Pain Points**: Rentan salah input debit/kredit, kesulitan menghitung HPP (Activity-Based Costing) secara manual dari berbagai batch produksi.
- **Kebutuhan UX**: Tabel data yang mudah difilter, konfirmasi jelas sebelum me-record jurnal, dan alur approval laporan panen yang mulus.

### 👷‍♂️ Persona 3: Agus (Pekerja / Operator Lapangan)
- **Tujuan**: Mencatat aktivitas fisik di greenhouse (semai, pindah tanam, panen) dan melaporkan penggunaan stok gudang.
- **Pain Points**: Tangan sering kotor atau basah sehingga sulit mengetik banyak di sistem, lupa batch mana yang harus dipindah.
- **Kebutuhan UX**: Antarmuka mobile-friendly, tombol aksi besar, minim pengetikan (banyak dropdown/scanner), dan instruksi visual yang jelas.

---

## 2. 🗺️ UCD: User Journey (Contoh: Proses Panen)

1. **Trigger**: Tanaman selada di Instalasi A1 sudah masuk usia panen (30 hari).
2. **Action (Agus - Pekerja)**: Agus membuka HP, login ke sistem, memilih menu "Produksi", memilih "Batch A1", menekan tombol besar "PANEN", dan memasukkan angka berat total (misal: 15 kg).
3. **Wait**: Sistem mengirim status "PENDING" ke Admin.
4. **Action (admin - Admin)**: admin mendapat notifikasi di Dashboard. Ia meninjau laporan panen Agus. Sistem otomatis menampilkan estimasi HPP berdasarkan biaya benih, rockwool, nutrisi, dan listrik.
5. **Decision**: admin klik "Approve". Sistem otomatis men-generate Jurnal Akuntansi (Persediaan Barang Jadi bertambah, Barang Dalam Proses berkurang).
6. **Result (sapik - Owner)**: sapik melihat aset di neracanya bertambah secara real-time.

---

## 3. 📚 Product Backlog (Epics & User Stories)

Berikut adalah daftar Epics (Modul besar) dan User Stories (kebutuhan spesifik) yang menyusun proyek ini.

### 📦 EPIC 1: Core Framework & Authentication (✅ SELESAI)
- **US1.1**: *Sebagai sistem, saya ingin memiliki struktur Next.js 14 dan database PostgreSQL agar aplikasi berjalan cepat dan aman.*
- **US1.2**: *Sebagai pengguna, saya ingin bisa login menggunakan email dan password agar data saya aman.*
- **US1.3**: *Sebagai pengguna, saya ingin diarahkan ke dashboard yang sesuai dengan Role saya (Owner, Admin, Pekerja) agar saya hanya melihat apa yang saya butuhkan.*

### 📦 EPIC 2: Sistem Akuntansi & HPP (✅ SELESAI)
- **US2.1**: *Sebagai Admin, saya ingin membuat Chart of Accounts (COA) agar pembukuan rapi.*
- **US2.2**: *Sebagai Admin, saya ingin mencatat transaksi jurnal Double-Entry agar laporan neraca dan laba-rugi akurat.*
- **US2.3**: *Sebagai sistem, saya ingin menghitung HPP secara otomatis (Activity-Based Costing) berdasarkan biaya greenhouse, instalasi, dan batch produksi.*

### 📦 EPIC 3: Manajemen Produksi DWC (✅ SELESAI)
- **US3.1**: *Sebagai Pekerja, saya ingin membuat batch semai baru dan memilih benih serta media tanam dari inventaris.*
- **US3.2**: *Sebagai Pekerja, saya ingin mengubah fase tanaman (Semai -> Bibit -> Tanam -> Panen) dengan beberapa klik.*
- **US3.3**: *Sebagai Pekerja, saya ingin men-submit laporan hasil panen beserta catatan lapangan.*

### 📦 EPIC 4: Manajemen Inventaris (✅ SELESAI)
- **US4.1**: *Sebagai Admin, saya ingin menambah stok barang masuk (Nutrisi, Media, Benih).*
- **US4.2**: *Sebagai Pekerja, saya ingin membuka "Active Pack" benih baru agar sistem mulai menghitung biaya per biji benih.*
- **US4.3**: *Sebagai sistem, saya ingin memberikan peringatan jika stok barang di bawah batas minimum.*

### 📦 EPIC 5: Manajemen Penjualan & Pengiriman (⏳ BELUM SELESAI)
- **US5.1**: *Sebagai Admin, saya ingin mencatat pesanan penjualan (Sales Order) dari pelanggan.*
- **US5.2**: *Sebagai Admin, saya ingin memasukkan item inventory yang terjual ke dalam Sales Order.*
- **US5.3**: *Sebagai Pekerja/Kurir, saya ingin mengupdate status pengiriman barang menjadi "Delivered" dan mengunggah foto bukti.*
- **US5.4**: *Sebagai sistem, saya ingin otomatis membuat jurnal pendapatan ketika Sales Order dibayar.*

### 📦 EPIC 6: Dashboard, Visualisasi & Export (⏳ BELUM SELESAI)
- **US6.1**: *Sebagai Owner, saya ingin melihat grafik pendapatan bulanan agar mudah menganalisa tren.*
- **US6.2**: *Sebagai Owner, saya ingin melihat pie-chart biaya operasional (listrik vs nutrisi vs gaji).*
- **US6.3**: *Sebagai Admin, saya ingin men-download laporan keuangan (Jurnal/Neraca) dalam format Excel/PDF.*

---

## 4. 🏃‍♂️ Sprint Planning (Roadmap)

Setiap sprint diasumsikan berdurasi 2 minggu.

### ✅ SPRINT 1: Foundation & Database
- **Goal**: Setup arsitektur dasar dan skema database.
- **Backlog**: EPIC 1 lengkap, perancangan skema `schema.prisma`.
- **Status**: **Selesai**.

### ✅ SPRINT 2: Core Business Logic (Akuntansi & Produksi)
- **Goal**: Pekerja bisa input produksi, Admin bisa melihat Jurnal dan menyetujui Panen (HPP terbentuk).
- **Backlog**: EPIC 2, EPIC 3, EPIC 4.
- **Status**: **Selesai**.

### 🚀 SPRINT 3: Sales & Delivery Module (Fokus Saat Ini)
- **Goal**: Menyelesaikan siklus hilir, yaitu penjualan hasil panen dan integrasinya ke jurnal akuntansi.
- **Backlog**:
  1. Membuat API untuk `SalesOrder` dan `Customer`.
  2. Membuat UI untuk halaman Penjualan di dashboard Admin.
  3. Mengurangi stok inventory otomatis saat barang terjual.
  4. Mencatat jurnal pendapatan otomatis.
- **Status**: **Belum Dimulai**.

### 🎯 SPRINT 4: Visualisasi & Export
- **Goal**: Meningkatkan pengalaman Owner (UCD) melalui visualisasi data dan laporan hardcopy.
- **Backlog**:
  1. Integrasi Recharts di Dashboard Owner.
  2. Fitur Export PDF/Excel menggunakan `jspdf` / `xlsx`.
- **Status**: **Belum Dimulai**.

### 🛠 SPRINT 5: QA & Usability Testing
- **Goal**: Memastikan sistem benar-benar nyaman digunakan (UCD validation) dan bebas bug akutansi.
- **Backlog**:
  1. Melakukan testing langsung dengan Pekerja di greenhouse menggunakan HP.
  2. Melakukan audit jurnal akuntansi (Test saldo Debit = Kredit).
  3. Memperbaiki UI/UX berdasarkan masukan pengguna.
- **Status**: **Belum Dimulai**.

---

## 5. 🧪 UCD: Usability Testing Plan (Untuk Sprint 5)

Untuk memastikan prinsip UCD terpenuhi, pengujian berikut harus dilakukan sebelum *Go-Live*:

1. **Test Task 1 (Pekerja)**: Minta pekerja lapangan (dengan tangan kotor/menggunakan sarung tangan) untuk memindahkan batch dari "Bibit" ke "Tanam" menggunakan HP mereka.
   - *Metrik sukses*: Terselesaikan dalam < 1 menit tanpa bertanya.
2. **Test Task 2 (Admin)**: Minta admin untuk menemukan jurnal transaksi atas biaya listrik Greenhouse A bulan lalu.
   - *Metrik sukses*: Ditemukan dengan fitur filter dalam < 3 klik.
3. **Test Task 3 (Owner)**: Minta owner melihat dashboard dan sebutkan bulan apa keuntungan paling tinggi.
   - *Metrik sukses*: Bisa menjawab dengan cepat hanya dengan melihat grafik tanpa membaca tabel detail.

---
*Dokumen ini adalah living document (dokumen hidup) yang akan terus di-update setiap kali Sprint Review dan Retrospective dilakukan.*
