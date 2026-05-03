import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { Activity, TrendingUp, TrendingDown, Package, Sprout } from "lucide-react"

interface ActivityItem {
  id: string
  type: 'transaction' | 'production' | 'inventory'
  title: string
  description: string
  timestamp: Date
  amount?: number
  status?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityIcons = {
  transaction: TrendingUp,
  production: Sprout,
  inventory: Package,
}

const activityColors = {
  transaction: "text-blue-600",
  production: "text-green-600",
  inventory: "text-orange-600",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
        <CardDescription>
          Update terkini dari sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Belum ada aktivitas</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              return (
                <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className={`rounded-full bg-muted p-2 ${activityColors[activity.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                      {activity.status && (
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className={`text-sm font-medium ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.amount > 0 ? '+' : ''}{activity.amount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
