"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Sprout,
  Package,
  PackageOpen,
  Users,
  LogOut,
  Wallet,
  ClipboardList,
  BarChart3,
  Leaf,
  ClipboardCheck,
  LayoutTemplate,
  Tent,
  Factory,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/owner",
    icon: LayoutDashboard,
    roles: ["OWNER"],
  },
  {
    title: "Kecerdasan Finansial",
    href: "/owner/financial",
    icon: BarChart3,
    roles: ["OWNER"],
  },
  {
    title: "Penarikan Dana",
    href: "/owner/withdrawals",
    icon: Wallet,
    roles: ["OWNER"],
  },
  {
    title: "Sistem Desain (UI)",
    href: "/owner/design-docs",
    icon: LayoutTemplate,
    roles: ["OWNER"],
  },
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    title: "Manajemen Gudang",
    href: "/admin/inventory",
    icon: Package,
    roles: ["ADMIN"],
  },
  {
    title: "Greenhouse",
    href: "/admin/greenhouse",
    icon: Tent,
    roles: ["ADMIN"],
  },
  {
    title: "Instalasi Rak",
    href: "/admin/instalasi",
    icon: Factory,
    roles: ["ADMIN"],
  },
  {
    title: "Stok Jual",
    href: "/admin/sales-stock",
    icon: PackageOpen,
    roles: ["ADMIN"],
  },
  {
    title: "Pusat Jurnal",
    href: "/admin/journal",
    icon: Receipt,
    roles: ["ADMIN"],
  },
  {
    title: "Bagan Akun",
    href: "/admin/accounts",
    icon: ClipboardList,
    roles: ["ADMIN"],
  },
  {
    title: "Produksi Berjalan",
    href: "/admin/active-production",
    icon: Sprout,
    roles: ["ADMIN"],
  },
  {
    title: "Laporan Panen",
    href: "/admin/production-reports",
    icon: ClipboardCheck,
    roles: ["ADMIN"],
  },
  {
    title: "Penjualan",
    href: "/admin/sales",
    icon: ShoppingCart,
    roles: ["ADMIN"],
  },
  {
    title: "Catatan Saya",
    href: "/worker",
    icon: LayoutDashboard,
    roles: ["PEKERJA"],
  },
  {
    title: "Produksi",
    href: "/worker/production",
    icon: Sprout,
    roles: ["PEKERJA"],
  },
  {
    title: "Inventaris",
    href: "/worker/inventory",
    icon: Package,
    roles: ["PEKERJA"],
  },
  {
    title: "Pengiriman",
    href: "/worker/delivery",
    icon: Truck,
    roles: ["PEKERJA"],
  },
];

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-2 relative",
        "bg-[--s-l0] border-r border-[--border-ui] z-40 tranadminon-colors",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-[22px] lg:h-[64px] border-b border-[--border-ui]">
        <Link href="/" className="flex items-center gap-3 font-semibold group">
          <div className="h-8 w-8 rounded-[9px] flex items-center justify-center bg-[--s-l2] text-[--c-primary] group-hover:-translate-y-0.5 tranadminon-all">
            <Leaf className="h-[14px] w-[14px]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[--c-primary]">
            Kebun <span className="text-[--c-poadminve]">Hijau</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-auto py-4 px-4 custom-scrollbar">
        <p className="overline mb-3 px-3">Menu</p>
        <nav className="flex flex-col gap-1">
          {(() => {
            const activeHref = filteredNavItems
              .filter(
                (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
              )
              .sort((a, b) => b.href.length - a.href.length)[0]?.href;

            return filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-[12px] rounded-[11px] px-[14px] py-[10px] text-[13px] font-bold tranadminon-all duration-200 cursor-pointer",
                    isActive
                      ? "nav-active"
                      : "text-[--c-secondary] hover:bg-[--bg-hover] hover:text-[--c-primary]",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 tranadminon-colors",
                      isActive ? "text-[--c-poadminve]" : "text-[--c-tertiary]",
                    )}
                  />
                  {item.title}
                </Link>
              );
            });
          })()}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[--border-ui]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-[12px] px-[14px] py-[10px] rounded-[11px] text-[13px] font-bold tranadminon-all duration-200 text-[--c-secondary] hover:bg-[--bg-negative-subtle] hover:text-[--c-negative]"
        >
          <LogOut className="h-[18px] w-[18px] text-[--c-tertiary] group-hover:text-[--c-negative]" />
          Keluar
        </button>
      </div>
    </div>
  );
}
