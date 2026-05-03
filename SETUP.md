# 🚀 Quick Setup Guide - Kebun Hijau

Panduan singkat untuk menjalankan aplikasi dalam 5 menit.

## ⚡ Prerequisites

- Node.js 18+ terinstall
- PostgreSQL 14+ running
- Terminal/Command line

## 📝 Langkah Setup

### 1. Install Dependencies (2 menit)

```bash
cd kebun-hijau
npm install
```

### 2. Setup Database (1 menit)

Buat database PostgreSQL:

```bash
createdb kebun_hijau
```

### 3. Configure Environment (30 detik)

Buat file `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kebun_hijau"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kebun-hijau-secret-key-2024"
NODE_ENV="development"
```

⚠️ **Ganti**:
- `postgres:password` dengan kredensial PostgreSQL Anda
- `NEXTAUTH_SECRET` dengan key yang lebih aman untuk production

### 4. Initialize Database (1 menit)

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Run Application (30 detik)

```bash
npm run dev
```

## ✅ Verifikasi

Buka browser: `http://localhost:3000`

Login dengan:
- **Owner**: owner@kebunhijau.com / password123
- **Admin**: admin@kebunhijau.com / password123
- **Pekerja**: worker@kebunhijau.com / password123

## 🎯 Next Steps

### Explore Features

1. **Owner Dashboard** - Lihat metrics finansial
2. **Admin Journal** - Kelola transaksi akuntansi
3. **Worker Production** - Input data produksi

### Customize

- Edit color theme di `tailwind.config.ts`
- Tambah akun di `prisma/seed.ts`
- Kustomisasi dashboard components

### Database Management

```bash
# Open Prisma Studio (GUI)
npm run prisma:studio

# View database schema
npx prisma studio
```

## 🐛 Troubleshooting Cepat

### Database Error
```bash
# Reset database
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

### Port Conflict
```bash
# Use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- Full documentation: `README.md`
- Database schema: `prisma/schema.prisma`
- API routes: `src/app/api/`

---

**Ready to go! 🌿** Visit the app and start exploring.
