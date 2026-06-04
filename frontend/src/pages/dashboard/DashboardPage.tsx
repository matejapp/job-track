import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Briefcase, TrendingUp, Calendar, Star, ArrowRight } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/shared/StatCard'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import { useAuth } from '@/providers/AuthProvider'
import { getJobApplications } from '@/api/applications'
import { getActivitiesByJob } from '@/api/activities'
import { STATUS_CONFIG, ALL_STATUSES } from '@/lib/status'
import type { ApplicationStatus } from '@/types'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function timeRemaining(dateStr: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d ago`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 7) return `In ${diff}d`
  return `In ${Math.floor(diff / 7)}w`
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getJobApplications,
  })

  // Upcoming activities — fetch per-job is not practical here, show none if no jobs
  // The activity endpoint requires a jobId, so we show a placeholder for now
  const upcomingActivities: { id: string; name: string; date: string; jobId: string; companyName: string; position: string }[] = []

  const stats = useMemo(() => ({
    total: applications.length,
    inProgress: applications.filter(a => ['Applied', 'Interview'].includes(a.status)).length,
    interviews: applications.filter(a => a.status === 'Interview').length,
    offers: applications.filter(a => a.status === 'Offer').length,
  }), [applications])

  const pipeline = useMemo(() => {
    const counts: Record<string, number> = {}
    applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1 })
    return ALL_STATUSES.map(stage => ({ stage, count: counts[stage] || 0 }))
  }, [applications])

  const maxPipeline = Math.max(...pipeline.map(p => p.count), 1)

  const recentApps = useMemo(() =>
    [...applications]
      .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
      .slice(0, 8),
    [applications]
  )

  const userName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-semibold text-text-primary">
          {greeting()}, {userName}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard label="Total Applications" value={stats.total} icon={Briefcase} />
            <StatCard label="In Progress" value={stats.inProgress} icon={TrendingUp} />
            <StatCard label="Interviews" value={stats.interviews} icon={Calendar} />
            <StatCard label="Offers" value={stats.offers} icon={Star} accent />
          </>
        )}
      </div>

      {/* Pipeline + Up Next */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pipeline */}
        <Card className="lg:col-span-3 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-text-primary">Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-6" />
                </div>
              ))
            ) : (
              pipeline.map(({ stage, count }) => {
                const cfg = STATUS_CONFIG[stage as ApplicationStatus]
                const pct = (count / maxPipeline) * 100
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary w-20 shrink-0">{cfg.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-bg-subtle overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.bg.replace('/15', '')}`}
                        style={{ width: count > 0 ? `${Math.max(pct, 3)}%` : '0%' }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-muted w-4 text-right">{count}</span>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Up Next */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-text-primary">Up Next</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-text-muted h-7 px-2"
              onClick={() => navigate('/calendar')}>
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingActivities.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8 italic">
                No upcoming activities
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingActivities.map(act => (
                  <div
                    key={act.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle cursor-pointer transition-colors"
                    onClick={() => navigate(`/applications/${act.jobId}`)}
                  >
                    <div className="text-center shrink-0 w-8">
                      <div className="text-sm font-semibold text-text-primary leading-none">
                        {format(parseISO(act.date), 'd')}
                      </div>
                      <div className="text-xs text-text-muted">
                        {format(parseISO(act.date), 'MMM')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{act.name}</p>
                      <p className="text-xs text-text-secondary truncate">{act.companyName}</p>
                    </div>
                    <span className="text-xs text-text-muted shrink-0">{timeRemaining(act.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-text-primary">Recent Applications</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-text-muted h-7 px-2"
            onClick={() => navigate('/applications')}>
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Add your first job application to get started."
                action={{ label: 'Add Application', onClick: () => navigate('/applications') }}
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentApps.map(app => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-bg-subtle cursor-pointer transition-colors"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{app.companyName}</p>
                    <p className="text-xs text-text-secondary truncate">{app.position}</p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                  <span className="text-xs text-text-muted shrink-0 hidden sm:block">
                    {app.dateApplied ? format(parseISO(app.dateApplied), 'MMM d, yyyy') : '—'}
                  </span>
                  {app.location && (
                    <span className="text-xs text-text-muted shrink-0 hidden md:block">{app.location}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
