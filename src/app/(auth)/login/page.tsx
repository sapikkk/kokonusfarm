"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Eye, EyeOff, Moon, Sun } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.toggle('dark')
    setIsDark(isDarkMode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[--bg-page] text-[--c-primary] tranadminon-colors relative">
      <div className="absolute top-6 right-6 z-50">
        <Button variant="secondary" size="icon" className="rounded-full" onClick={toggleTheme}>
          {isDark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
        </Button>
      </div>

      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 forest-gradient relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[--bg-poadminve-subtle]">
            <Leaf className="h-5 w-5 text-[--c-poadminve]" />
          </div>
          <span className="text-white text-xl font-bold">Kebun <span className="text-lime-brand">Hijau</span></span>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-[48px] font-black tracking-[-0.05em] italic uppercase leading-none text-white">
              Kelola Kebun<br />
              <span className="text-lime-brand">Lebih Cerdas.</span>
            </h2>
            <p className="text-[14px] text-white/60 max-w-md mt-4">
              Platform manajemen hidroponik terintegrasi untuk produksi, inventaris, dan keuangan.
            </p>
          </div>

          <div className="flex gap-8 pt-4">
            {[
              { label: 'Batch Aktif', value: '12+' },
              { label: 'Item Inventaris', value: '40+' },
              { label: 'Tingkat Keberhasilan', value: '94%' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[28px] font-bold text-lime-brand">{stat.value}</p>
                <p className="text-[12px] text-white/50 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] font-bold mono text-white/30 relative z-10 tracking-[0.18em] uppercase">© 2025 KOKONUS FARM. ALL RIGHTS RESERVED.</p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 bg-[--s-l1]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-[12px] flex items-center justify-center bg-[--bg-accent]">
              <Leaf className="h-5 w-5 text-[--c-inverse]" />
            </div>
            <span className="text-xl font-bold text-[--c-primary]">Kebun Hijau</span>
          </div>

          <div>
            <h1 className="text-[28px] font-bold text-[--c-primary] tracking-[-0.03em]">Selamat Datang Kembali</h1>
            <p className="mt-1 text-[13px] text-[--c-secondary]">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert-negative p-3 rounded-[11px] text-[12px] font-medium font-sans">
                {error}
              </div>
            )}

            <div className="field">
              <Label htmlFor="email" className="field-label">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@kebunhijau.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-[42px] text-[13px]"
              />
            </div>

            <div className="field mt-4">
              <Label htmlFor="password" className="field-label">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-[42px] pr-10 text-[13px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-[3px] w-[36px] h-[36px] border-0 hover:bg-transparent text-[--c-tertiary] hover:text-[--c-primary]"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full h-[44px] mt-6 !rounded-[12px] text-[14px]"
              size="lg"
            >
              {!isLoading && "Masuk ke Akun"}
            </Button>
          </form>

          <div className="p-5 mt-8 rounded-[14px] border border-dashed border-[--border-ui] bg-[--s-l2] text-[12px]">
            <p className="font-bold text-[--c-secondary] mb-[10px] uppercase tracking-[0.06em] text-[10px]">Demo Akun:</p>
            <div className="space-y-[8px] text-[--c-tertiary] mono text-[11px]">
              <div className="flex items-center gap-2"><span className="font-bold text-[--c-primary] min-w-[60px]">Owner</span> owner@kebunhijau.com / password123</div>
              <div className="flex items-center gap-2"><span className="font-bold text-[--c-primary] min-w-[60px]">Admin</span> admin@kebunhijau.com / password123</div>
              <div className="flex items-center gap-2"><span className="font-bold text-[--c-primary] min-w-[60px]">Pekerja</span> worker@kebunhijau.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
