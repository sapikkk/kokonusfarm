# 👋 MULAI DI SINI!

Selamat datang di **Kebun Hijau** - Sistem Manajemen Hidroponik lengkap Anda!

## 📦 Apa yang Anda Dapatkan?

Aplikasi web full-stack dengan:
- ✅ **100+ file** siap pakai
- ✅ **Authentication** sistem dengan 3 role berbeda
- ✅ **Database schema** lengkap (11 tabel)
- ✅ **Dashboard** untuk Owner, Admin, dan Pekerja
- ✅ **API routes** untuk semua operasi CRUD
- ✅ **UI components** modern dengan Botanical Green theme
- ✅ **Documentation** komprehensif

## 🚀 Langkah Pertama (Pilih Salah Satu)

### Option 1: Quick Start (5 Menit) ⚡
Untuk langsung mencoba aplikasi:

1. Buka file: **`SETUP.md`**
2. Ikuti 5 langkah sederhana
3. Aplikasi siap digunakan!

### Option 2: Full Documentation (Untuk Developer) 📚
Untuk memahami sistem secara lengkap:

1. Baca: **`README.md`** - Dokumentasi lengkap
2. Review: **`PROJECT_SUMMARY.md`** - Overview struktur proyek
3. Explore: **`prisma/schema.prisma`** - Database design

## 📂 File Penting yang Harus Anda Ketahui

```
kebun-hijau/
├── 📖 START_HERE.md          ← Anda di sini!
├── ⚡ SETUP.md               ← Quick start guide
├── 📚 README.md              ← Full documentation
├── 📊 PROJECT_SUMMARY.md     ← Project overview
│
├── ⚙️  package.json          ← Dependencies
├── 🗄️  prisma/schema.prisma  ← Database structure
├── 🔐 .env.example           ← Environment template
│
└── 💻 src/                   ← Source code
    ├── app/                  ← Pages & API routes
    ├── components/           ← UI components
    └── lib/                  ← Utilities
```

## 🎯 Langkah Demi Langkah

### Step 1: Baca Dokumentasi
```
✓ START_HERE.md (Anda sudah di sini!)
→ SETUP.md (5 menit setup)
→ README.md (kalau perlu detail lebih)
```

### Step 2: Setup Environment
```bash
# Install dependencies
npm install

# Setup database
createdb kebun_hijau

# Configure .env
cp .env.example .env
# Edit .env dengan database credentials Anda
```

### Step 3: Initialize Database
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts  # Optional: demo data
```

### Step 4: Run Application
```bash
npm run dev
```

### Step 5: Login & Explore
```
URL: http://localhost:3000

Demo accounts:
- Owner: owner@kebunhijau.com / password123
- Admin: admin@kebunhijau.com / password123  
- Pekerja: worker@kebunhijau.com / password123
```

## 🎨 Fitur Utama yang Bisa Anda Coba

### Sebagai OWNER
1. Login sebagai Owner
2. Lihat dashboard finansial
3. Check metrics & analytics
4. Explore financial intelligence page

### Sebagai ADMIN
1. Login sebagai Admin
2. Kelola transaksi di Journal Central
3. Approve/reject transaksi pending
4. Manage Chart of Accounts

### Sebagai PEKERJA
1. Login sebagai Pekerja
2. Input data produksi
3. Update inventory
4. Monitor batch tanaman aktif

## 🛠 Tools yang Anda Butuhkan

### Wajib:
- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ PostgreSQL 14+ ([Download](https://postgresql.org))
- ✅ Code editor (VS Code recommended)

### Optional:
- 📊 Prisma Studio (included) - GUI untuk database
- 🐳 Docker (untuk containerization)
- 📱 Postman (untuk testing API)

## 💡 Tips Menggunakan Proyek Ini

### Untuk Belajar
1. **Mulai dari schema**: Baca `prisma/schema.prisma`
2. **Pahami routing**: Explore `src/app/` structure
3. **Study components**: Review `src/components/ui/`
4. **Trace data flow**: Follow dari page → API → database

### Untuk Development
1. **Hot reload**: Changes auto-refresh
2. **Prisma Studio**: Run `npm run prisma:studio` untuk GUI
3. **Type safety**: TypeScript akan warn Anda kalau ada error
4. **API testing**: Use browser DevTools Network tab

### Untuk Production
1. **Environment**: Update `.env` dengan production values
2. **Security**: Ganti `NEXTAUTH_SECRET` dengan key yang aman
3. **Database**: Setup production PostgreSQL
4. **Deploy**: Follow README deployment section

## 🐛 Troubleshooting Cepat

### "Database connection failed"
```bash
# Check PostgreSQL running
pg_isready

# Check DATABASE_URL di .env
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm run dev
```

## 📞 Bantuan & Resources

### Documentation Files
- **SETUP.md** - Quick start guide
- **README.md** - Comprehensive docs  
- **PROJECT_SUMMARY.md** - Project structure

### Code Examples
- Pages: `src/app/(dashboard)/`
- Components: `src/components/`
- API: `src/app/api/`
- Utils: `src/lib/utils.ts`

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

## ✅ Checklist Sebelum Mulai

Pastikan Anda sudah:
- [ ] Install Node.js 18+
- [ ] Install PostgreSQL
- [ ] Clone/download project ini
- [ ] Read SETUP.md atau README.md
- [ ] Siapkan code editor

## 🎉 Ready to Go!

Anda siap memulai! Pilih:

1. **Langsung coba**: Buka `SETUP.md` → ikuti 5 langkah → selesai!
2. **Belajar dulu**: Baca `README.md` → pahami konsep → lalu setup

---

**Selamat coding! 🌿**

*Proyek ini dibuat dengan ❤️ untuk modernisasi perkebunan hidroponik Indonesia*
