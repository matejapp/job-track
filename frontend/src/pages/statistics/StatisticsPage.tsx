import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ActivityCalendar } from 'react-activity-calendar'
import { TrendingUp, Users, Briefcase, Star } from 'lucide-react'
import { getJobApplications } from '@/api/applications'
import { getAllActivities } from '@/api/activities'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ACCENT = 'hsl(153 43% 30%)'
const STAGE_ORDER = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn'] as const

export default function StatisticsPage() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getJobApplications,
  })
  const { data: activities = [] } = useQuery({
    queryKey: ['all-activities'],
    queryFn: getAllActivities,
  })

  const stats = useMemo(() => {
    const total = applications.length
    const responses = applications.filter(a => ['Interview', 'Offer', 'Rejected', 'Ghosted'].includes(a.status)).length
    const interviews = applications.filter(a => ['Interview', 'Offer'].includes(a.status)).length
    const offers = applications.filter(a => a.status === 'Offer').length

    const sorted = [...applications].sort((a, b) => (a.dateApplied ?? '').localeCompare(b.dateApplied ?? ''))
    const cumulativeData = sorted.map((app, i) => ({
      date: app.dateApplied ? format(parseISO(app.dateApplied), 'MMM d') : '',
      count: i + 1,
    }))

    const stageCounts: Record<string, number> = {}
    applications.forEach(a => { stageCounts[a.status] = (stageCounts[a.status] || 0) + 1 })
    const funnelData = STAGE_ORDER.map(stage => ({
      stage,
      count: stageCounts[stage] || 0,
      percentage: total > 0 ? Math.round(((stageCounts[stage] || 0) / total) * 100) : 0,
    }))

    const activityCounts: Record<string, number> = {}
    activities.forEach(a => {
      const key = a.date ? a.date.split('T')[0] : ''
      if (!key) return
      activityCounts[key] = (activityCounts[key] || 0) + 1
    })
    const activityGrid = Object.entries(activityCounts).map(([date, count]) => ({ date, count }))

    return {
      total,
      responseRate: total > 0 ? Math.round((responses / total) * 100) : 0,
      interviewRate: total > 0 ? Math.round((interviews / total) * 100) : 0,
      offers,
      activeApplications: applications.filter(a => ['Applied', 'Interview'].includes(a.status)).length,
      cumulativeData,
      funnelData,
      activityGrid,
      stageData: funnelData,
    }
  }, [applications, activities])

  const calendarData = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const data = stats.activityGrid.map(d => ({
      date: d.date,
      count: d.count,
      level: Math.min(4, d.count) as 0 | 1 | 2 | 3 | 4,
    }))
    if (!data.find(d => d.date === today)) data.push({ date: today, count: 0, level: 0 })
    return data.sort((a, b) => a.date.localeCompare(b.date))
  }, [stats.activityGrid])

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-72" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">Statistics</h1>
        <p className="text-text-secondary text-sm mt-0.5">Your job search at a glance.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Response Rate" value={`${stats.responseRate}%`} icon={TrendingUp} accent />
        <StatCard label="Interview Rate" value={`${stats.interviewRate}%`} icon={Users} />
        <StatCard label="Active Applications" value={stats.activeApplications} icon={Briefcase} />
        <StatCard label="Offers" value={stats.offers} icon={Star} accent />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Cumulative Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.cumulativeData.length < 2 ? (
              <p className="text-sm text-text-muted text-center py-8">Not enough data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats.cumulativeData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Area type="monotone" dataKey="count" stroke={ACCENT} strokeWidth={2} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Conversion Funnel
              <span className="ml-2 font-normal text-text-muted">({stats.total} total)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.funnelData.map((f, i) => (
              <div key={f.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-primary">{f.stage}</span>
                  <span className="text-text-muted">{f.count} · {f.percentage}%</span>
                </div>
                <div className="h-5 rounded bg-bg-subtle overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${Math.max(f.percentage, f.count > 0 ? 3 : 0)}%`,
                      backgroundColor: ACCENT,
                      opacity: 1 - i * 0.12,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">By Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.stageData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border, #e5e7eb)" />
                <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {calendarData.length <= 1 ? (
              <p className="text-sm text-text-muted text-center py-8">No activity data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <ActivityCalendar
                  data={calendarData}
                  blockSize={12}
                  blockRadius={2}
                  blockMargin={3}
                  theme={{ light: ['#EDEDEA', '#D8F3DC', '#74C69D', '#52B788', '#2D6A4F'] }}
                  showWeekdayLabels
                  labels={{ legend: { less: 'Less', more: 'More' } }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
