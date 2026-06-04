import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Activity as ActivityIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getJobApplications } from '@/api/applications'
import { getAllActivities } from '@/api/activities'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

interface CalendarItem {
  id: string
  type: 'application' | 'activity'
  label: string
  status?: ApplicationStatus
  appId?: string
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function buildMonthGrid(currentDate: Date) {
  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start, end })
  const startWeekday = (getDay(start) + 6) % 7 // Mon=0
  const prefix: null[] = Array(startWeekday).fill(null)
  const allCells = [...prefix, ...days]
  while (allCells.length % 7 !== 0) allCells.push(null)
  return allCells
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const navigate = useNavigate()

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: getJobApplications,
  })
  const { data: activities = [] } = useQuery({
    queryKey: ['all-activities'],
    queryFn: getAllActivities,
  })

  const calendarItems = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {}
    applications.forEach(app => {
      if (!app.dateApplied) return
      const key = app.dateApplied.split('T')[0]
      map[key] = [...(map[key] ?? []), {
        id: app.id,
        type: 'application',
        label: app.companyName,
        status: app.status,
        appId: app.id,
      }]
    })
    activities.forEach(act => {
      if (!act.date) return
      const key = act.date.split('T')[0]
      map[key] = [...(map[key] ?? []), {
        id: act.id,
        type: 'activity',
        label: act.name,
        appId: act.jobId,
      }]
    })
    return map
  }, [applications, activities])

  const cells = buildMonthGrid(currentDate)

  const selectedKey = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null
  const selectedItems = selectedKey ? (calendarItems[selectedKey] ?? []) : []

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl font-semibold text-text-primary flex-1">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => subMonths(d, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addMonths(d, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border border-border overflow-hidden bg-bg-surface">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_HEADERS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-text-muted">{d}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return (
              <div key={`empty-${i}`} className="min-h-28 border-r border-b border-border bg-bg-subtle/30 last:border-r-0" />
            )
            const key = format(day, 'yyyy-MM-dd')
            const items = calendarItems[key] ?? []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const todayCell = isToday(day)
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false
            return (
              <div
                key={key}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
                className={cn(
                  'min-h-28 border-r border-b border-border p-1.5 cursor-pointer transition-colors last:border-r-0',
                  !isCurrentMonth && 'bg-bg-subtle/30',
                  isSelected && 'bg-accent/5',
                  'hover:bg-bg-subtle/50',
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1',
                  todayCell ? 'bg-accent text-white' : !isCurrentMonth ? 'text-text-muted' : 'text-text-primary',
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {items.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      onClick={e => { e.stopPropagation(); if (item.appId) navigate(`/applications/${item.appId}`) }}
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded truncate cursor-pointer',
                        item.type === 'application'
                          ? 'bg-accent/10 text-accent hover:bg-accent/20'
                          : 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80',
                      )}
                    >
                      {item.label}
                    </div>
                  ))}
                  {items.length > 2 && (
                    <div className="text-xs text-text-muted px-1">+{items.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day detail sheet */}
      <Sheet open={!!selectedDay} onOpenChange={open => !open && setSelectedDay(null)}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-display text-base">
              {selectedDay ? format(selectedDay, 'EEEE, MMMM d') : ''}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {selectedItems.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">Nothing scheduled</p>
            ) : (
              selectedItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => { if (item.appId) navigate(`/applications/${item.appId}`) }}
                  className="p-3 rounded-lg border border-border bg-bg-surface hover:bg-bg-subtle cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'application'
                      ? <Calendar className="h-3.5 w-3.5 text-accent" />
                      : <ActivityIcon className="h-3.5 w-3.5 text-text-muted" />
                    }
                    <p className="text-sm font-medium text-text-primary truncate">{item.label}</p>
                  </div>
                  {item.status && <StatusBadge status={item.status} size="sm" />}
                  <p className="text-xs text-text-muted mt-1 capitalize">{item.type}</p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
