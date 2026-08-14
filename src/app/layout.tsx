import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Space_Grotesk, DM_Mono } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Kebun Hijau - Sistem Manajemen Hidroponik",
  description: "Platform digital untuk memodernisasi operasional perkebunan hidroponik",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${spaceGrotesk.variable} ${dmMono.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
