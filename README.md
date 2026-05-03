# 🌿 Kebun Hijau - Sistem Manajemen Hidroponik

Platform digital modern untuk memodernisasi operasional perkebunan hidroponik dengan sistem akuntansi finansial terintegrasi dan pelacakan hasil produksi (Sistem DWC).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi Database](#-konfigurasi-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Proyek](#-struktur-proyek)
- [Arsitektur Database \& Flowchart](#-arsitektur-database--flowchart)
- [Role \& Permissions](#-role--permissions)
- [API Endpoints](#-api-endpoints)
- [Demo Accounts](#-demo-accounts)
- [Tema \& Styling](#-tema--styling)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)

## ✨ Fitur Utama

### 1. **Sistem Akuntansi Double-Entry \& HPP**
- ✅ Chart of Accounts (Bagan Akun) yang terstruktur.
- ✅ Jurnal transaksi dengan validasi debit-kredit.
- ✅ Approval workflow untuk transaksi.
- ✅ Perhitungan Harga Pokok Produksi (HPP) berbasis Activity-Based Costing (ABC) otomatis.
- ✅ Laporan keuangan real-time.

### 2. **Pelacakan Produksi (DWC System)**
- ✅ Manajemen siklus hidup tanaman (Semai → Bibit → Tanam → Panen).
- ✅ Batch tracking dengan kode unik.
- ✅ Monitoring yield efficiency dan loss percentage.
- ✅ Pencatatan siklus panen melalui Harvest Report dengan approval admin.
- ✅ Terhubung ke Greenhouse dan Instalasi untuk alokasi Fixed Cost.

### 3. **Manajemen Inventaris \& Bahan Baku**
- ✅ Tracking stok nutrisi, media tanam, dan benih.
- ✅ Active Pack Lifecycle untuk mengukur cost per unit (benih & rockwool).
- ✅ Alert otomatis untuk stok rendah.
- ✅ Inventory movement logs (IN/OUT/ADJUST).

### 4. **Role-Based Access Control**
- ✅ **OWNER**: Dashboard finansial, analytics, dan penarikan dana.
- ✅ **ADMIN**: Jurnal akuntansi, approval, penetapan HPP, dan COA management.
- ✅ **PEKERJA**: Input produksi, submit harvest report, inventaris, dan aktivitas harian.

### 5. **UI/UX Modern**
- ✅ Tema "Botanical Green" dengan glassmorphism.
- ✅ Dark/Light mode support.
- ✅ Responsive design untuk mobile dan desktop.
- ✅ Animasi halus dan micro-interactions.

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Premium component library
- **Lucide React** - Icon set
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless API
- **NextAuth.js** - Authentication
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **Bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Zod** - Schema validation

## 📦 Persyaratan Sistem

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 atau **yarn** >= 1.22.0
- **PostgreSQL** >= 14.0

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd kebun-hijau
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kebun_hijau?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# App
NODE_ENV="development"
```

**⚠️ PENTING**: Ganti `NEXTAUTH_SECRET` dengan key yang aman. Generate dengan:
```bash
openssl rand -base64 32
```

## 🗄 Konfigurasi Database

### 1. Buat Database PostgreSQL

```bash
createdb kebun_hijau
```

Atau melalui psql:
```sql
CREATE DATABASE kebun_hijau;
```

### 2. Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database (Optional - untuk data demo)

```bash
npx tsx prisma/seed.ts
```

Ini akan membuat:
- 3 user demo (Owner, Admin, Pekerja)
- Chart of Accounts lengkap
- Data Greenhouse & Instalasi
- Sample inventory items
- Sample production cycles
- Sample transactions

## 🎯 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Database Management

```bash
# Buka Prisma Studio untuk GUI database
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Create migration
npm run prisma:migrate
```

## 📁 Struktur Proyek

```
kebun-hijau/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── owner/         # Owner-specific pages
│   │   │   ├── admin/         # Admin-specific pages
│   │   │   └── worker/        # Worker-specific pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth routes
│   │   │   ├── transactions/  # Transaction API
│   │   │   ├── production/    # Production API
│   │   │   ├── inventory/     # Inventory API
│   │   │   └── accounts/      # Accounts API
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   ├── layouts/           # Layout components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── forms/             # Form components
│   │   └── charts/            # Chart components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   └── utils.ts           # Utility functions
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🗃 Arsitektur Database & Flowchart

### Database Entity Relationship Diagram (ERD)

Arsitektur database dirancang untuk mendukung pelacakan dari mulai input barang inventaris, proses tanam, hingga menjadi entri akuntansi (Double-Entry).

```mermaid
erDiagram
    User {
        String id PK
        String email
        String role
    }
    
    Account {
        String id PK
        String type
        String code
        String parentId FK
    }
    
    Transaction {
        String id PK
        String status
        String userId FK
    }
    
    JournalLine {
        String id PK
        Decimal debit
        Decimal credit
        String accountId FK
        String transactionId FK
    }

    Greenhouse {
        String id PK
        Decimal fixedCostElectricity
    }

    Installation {
        String id PK
        String greenhouseId FK
        Decimal fixedCostNutrient
    }

    ProductionCycle {
        String id PK
        String phase
        String installationId FK
        String activeSeedPackId FK
        String activeMediaPackId FK
    }

    ProductionLog {
        String id PK
        String cycleId FK
        String action
        String userId FK
    }

    HarvestReport {
        String id PK
        String cycleId FK
        String status
        Decimal hppPerUnit
        String submittedById FK
        String reviewedById FK
    }

    InventoryItem {
        String id PK
        String category
        Decimal currentStock
    }

    InventoryLog {
        String id PK
        String itemId FK
        String movement
        String userId FK
    }

    ActivePack {
        String id PK
        String itemId FK
        String status
        Decimal costPerUnit
    }

    %% RELATIONS
    User ||--o{ Transaction : "creates"
    User ||--o{ ProductionLog : "creates"
    User ||--o{ InventoryLog : "creates"
    User ||--o{ HarvestReport : "submits/reviews"

    Account ||--o{ Account : "has sub-accounts"
    Account ||--o{ JournalLine : "recorded in"

    Transaction ||--|{ JournalLine : "contains"

    Greenhouse ||--|{ Installation : "houses"
    
    Installation ||--o{ ProductionCycle : "hosts"

    ProductionCycle ||--|{ ProductionLog : "has logs"
    ProductionCycle ||--o{ HarvestReport : "generates"

    InventoryItem ||--o{ InventoryLog : "has movements"
    InventoryItem ||--o{ ActivePack : "tracked via"

    ActivePack ||--o{ ProductionCycle : "used in"
```

### Flowchart Integrasi HPP & Akuntansi (ABC Costing)

```mermaid
flowchart TD
    subgraph INVENTARIS ["📦 Modul Inventaris"]
        A1(Pembelian Benih & Rockwool) -->|Masuk Stok| A2(Buka Active Pack)
        A2 -->|Catat Harga/Pack| A3(Lifecycle Pack)
    end

    subgraph PRODUKSI ["🌱 Modul Produksi (DWC)"]
        B1(Buat Batch Semai)
        A3 -->|Assign Pack ke Batch| B1
        B1 -->|Fase Semai -> Bibit| B2(Pindah ke Instalasi)
    end

    subgraph INFRASTRUKTUR ["🏗️ Modul Infrastruktur"]
        C1(Greenhouse) -->|Beban Listrik| C2(Instalasi)
        C2 -->|Beban Nutrisi| B2
    end

    subgraph PANEN ["🌾 Modul Panen (Pekerja & Admin)"]
        B2 -->|Fase Panen| D1(Pekerja Submit Harvest Report)
        D1 -->|Review Data & Yield| D2(Admin Approve & Tentukan HPP)
    end

    subgraph AKUNTANSI ["📊 Modul Akuntansi"]
        D2 -->|Generate Jurnal| E1(Otomatis Buat Transaksi Double-Entry)
        E1 --> E2(Update Chart of Accounts)
    end
```

## 👥 Role & Permissions

### OWNER (Pemilik)
**Dashboard**: Financial Intelligence
- ✅ View all financial reports (Laba rugi, neraca)
- ✅ Access to analytics and trends
- ✅ Manage withdrawals (Prive)
- ✅ Full read access to all data
- ❌ Cannot directly create transactions

### ADMIN (Pembukuan / Manajer)
**Dashboard**: Journal Central & Approval
- ✅ Create, edit, approve transactions
- ✅ Manage Chart of Accounts
- ✅ Approve Harvest Reports & Tetapkan HPP
- ✅ View and verify all logs
- ✅ Access to accounting reports
- ❌ Cannot access owner-specific analytics

### PEKERJA (Operator Lapangan)
**Dashboard**: My Records
- ✅ Record production activities & phase changes
- ✅ Update inventory movements & active packs
- ✅ Submit Harvest Reports
- ✅ View own activities
- ❌ Cannot approve transactions / harvest reports
- ❌ Cannot access financial reports

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/signin          # Login
POST /api/auth/signout         # Logout
GET  /api/auth/session         # Get session
```

### Transactions
```
GET  /api/transactions         # List transactions
POST /api/transactions         # Create transaction
GET  /api/transactions/[id]    # Get transaction detail
PUT  /api/transactions/[id]    # Update transaction
```

### Production
```
GET  /api/production           # List production cycles
POST /api/production           # Create new cycle
PUT  /api/production/[id]      # Update cycle
```

### Inventory
```
GET  /api/inventory            # List inventory items
POST /api/inventory            # Create item
PUT  /api/inventory/[id]       # Update stock
```

### Accounts
```
GET  /api/accounts             # List accounts (COA)
POST /api/accounts             # Create account
PUT  /api/accounts/[id]        # Update account
```

## 🔐 Demo Accounts

Setelah running seed:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Owner** | owner@kebunhijau.com | password123 | Full analytics & reports |
| **Admin** | admin@kebunhijau.com | password123 | Accounting & approval |
| **Pekerja** | worker@kebunhijau.com | password123 | Production & inventory |

## 🎨 Tema & Styling

### Color Palette

**Botanical Green Theme**:
- Primary: `#16a34a` (botanical-600)
- Secondary: `#14b8a6` (mint-500)
- Accent: `#f0f0b0` (cream-500)

### Design Tokens

CSS Variables tersedia di `globals.css`:
```css
--primary: 142 76% 36%;
--accent: 160 84% 39%;
```

### Custom Components

Semua komponen menggunakan design system "Botanical Green":
- **Glass Cards**: Backdrop blur dengan transparency
- **Stat Cards**: Animated metrics dengan trend indicators
- **Phase Badges**: Color-coded untuk production phases
- **Status Badges**: Visual status indicators

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Setup environment variables di Vercel dashboard
```

### Docker (Alternative)

```dockerfile
# Coming soon - Docker configuration
```

### Environment Variables untuk Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="secure-random-key-for-production"
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL format
postgresql://username:password@host:port/database
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### NextAuth Session Issues

```bash
# Clear browser cookies
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 🤝 Kontribusi

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed with ❤️ for modern hydroponic farm management.

---

**🌿 Kebun Hijau** - Modernizing Hydroponic Operations
