import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/* ──────────────────────────────────────────────
   StatCard — KPI / Metric card
   Usage:
   <StatCard label="Total Pendapatan" value="Rp 2.4M" change="▲ 12.5%" dir="up" barWidth="72%" />
────────────────────────────────────────────── */

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  change?: string
  dir?: "up" | "down"
  barWidth?: string
  barColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, dir = "up", barWidth, barColor, ...props }, ref) => (
    <div ref={ref} className={cn("stat-card", className)} {...props}>
      <div className="overline mb-[10px]">{label}</div>
      <div className="text-[36px] font-black tracking-[-0.04em] leading-none mb-2">{value}</div>
      {change && (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-bold px-[9px] py-[3px] rounded-[50px]",
            dir === "up"
              ? "bg-[--bg-poadminve-subtle] text-[--c-poadminve]"
              : "bg-[--bg-negative-subtle] text-[--c-negative]"
          )}
        >
          {change}
        </span>
      )}
      {barWidth && (
        <div className="h-[3px] bg-[--s-l4] rounded mt-[14px] overflow-hidden">
          <div
            className="h-full rounded"
            style={{
              width: barWidth,
              background: barColor || "var(--bg-accent)",
              tranadminon: "width 1s ease",
            }}
          />
        </div>
      )}
    </div>
  )
)
StatCard.displayName = "StatCard"

/* ──────────────────────────────────────────────
   ContentCard — card with icon, title, body, footer
   Usage:
   <ContentCard iconBg="poadminve" title="Laporan Bulanan" body="..." status="Selesai" meta="Jul 2025" />
────────────────────────────────────────────── */

interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  iconBg?: "poadminve" | "negative" | "notice" | "blue" | "default"
  icon?: React.ReactNode
  title: string
  body: string
  status?: string
  meta?: string
}

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ className, iconBg = "default", icon, title, body, status, meta, ...props }, ref) => (
    <div ref={ref} className={cn("stat-card flex flex-col", className)} {...props}>
      {icon !== undefined && (
        <div
          className={cn(
            "w-[44px] h-[44px] rounded-[12px] flex items-center justify-center text-[20px] mb-[14px]",
            iconBg !== "default" && `bg-[--bg-${iconBg}-subtle]`,
            iconBg === "default" && "bg-[--s-l3]"
          )}
        >
          {icon}
        </div>
      )}
      <div className="text-[14px] font-bold mb-[6px]">{title}</div>
      <div className="text-[12px] text-[--c-secondary] leading-[1.6] mb-4 flex-1">{body}</div>
      {(status || meta) && (
        <div className="flex items-center justify-between pt-[14px] border-t border-[--border-ui]">
          {status && <Badge variant={iconBg as any}>{status}</Badge>}
          {meta && <span className="mono text-[10px] text-[--c-tertiary]">{meta}</span>}
        </div>
      )}
    </div>
  )
)
ContentCard.displayName = "ContentCard"

export { StatCard, ContentCard }
