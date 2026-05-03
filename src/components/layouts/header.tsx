"use client"

import { Bell, Moon, Sun, User, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRoleLabel } from "@/lib/utils"

interface HeaderProps {
  userName: string
  userRole: string
}

export function Header({ userName, userRole }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className={[
      "sticky top-0 z-40 flex h-14 items-center gap-4 px-[22px] lg:h-[64px]",
      "bg-[--s-l0]",
      "border-b border-[--border-ui]",
      "tranadminon-colors"
    ].join(" ")}
    >
      {/* Welcome text */}
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[--c-tertiary] mb-0.5">Selamat Datang Kembali,</p>
        <h1 className="text-[18px] font-bold leading-tight text-[--c-primary]">
          {userName}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark / Light Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[--c-secondary] hover:text-[--c-primary]"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {/* Sun — visible in light mode */}
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 tranadminon-all dark:-rotate-90 dark:scale-0" />
          {/* Moon — visible in dark mode */}
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 tranadminon-all dark:rotate-0 dark:scale-100 text-[--c-poadminve]" />
        </Button>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[--c-secondary] hover:text-[--c-primary]"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-[6px] w-[6px] rounded-full bg-[--bg-negative]" />
        </Button>

        <div className="w-[1px] h-[32px] bg-[--border-ui] mx-1" />

        {/* User avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-[50px] p-1 pr-4 tranadminon-all hover:bg-[--bg-hover] outline-none border border-transparent focus-visible:border-[--border-ui]">
              <Avatar size="sm" colorVariant="green">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-[13px] font-bold text-[--c-primary] leading-none mb-1">
                  {userName}
                </span>
                <span className="overline text-[--c-poadminve]">
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>
              Akun Saya
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3">
              <div className="w-6 h-6 rounded-[6px] bg-[--s-l3] flex flex-col items-center justify-center text-[--c-primary]">
                <User className="h-3 w-3" />
              </div>
              <span className="font-bold">Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <div className="w-6 h-6 rounded-[6px] bg-[--s-l3] flex flex-col items-center justify-center text-[--c-primary]">
                <Settings className="h-3 w-3" />
              </div>
              <span className="font-bold">Pengaturan</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
