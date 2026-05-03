import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPoadminve: boolean
  }
  className?: string
  glass?: boolean
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  glass = true,
}: StatCardProps) {
  return (
    <Card className={cn("stat-card border-0", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight animate-count-up text-foreground">
                {value}
              </h2>
              {trend && (
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: trend.isPoadminve ? 'rgba(159,232,112,0.2)' : 'rgba(239,68,68,0.1)',
                    color: trend.isPoadminve ? '#2a7015' : '#dc2626'
                  }}
                >
                  {trend.isPoadminve ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="rounded-xl p-2.5 shrink-0" style={{ background: 'rgba(159,232,112,0.15)' }}>
            <Icon className="h-5 w-5" style={{ color: '#2a7015' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

