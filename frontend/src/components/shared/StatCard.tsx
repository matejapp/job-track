import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon?: LucideIcon
  accent?: boolean
}

export default function StatCard({ label, value, delta, deltaLabel, icon: Icon, accent }: Props) {
  const positive = delta === undefined || delta >= 0
  return (
    <Card className={cn('border-border', accent && 'border-l-4 border-l-accent')}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-secondary font-medium">{label}</p>
            <p className="mt-1 text-3xl font-display font-semibold text-text-primary">{value}</p>
            {delta !== undefined && (
              <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', positive ? 'text-accent' : 'text-danger')}>
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(delta)}{deltaLabel}</span>
              </div>
            )}
          </div>
          {Icon && <div className="p-2 rounded-lg bg-bg-subtle"><Icon className="h-4 w-4 text-text-muted" /></div>}
        </div>
      </CardContent>
    </Card>
  )
}
