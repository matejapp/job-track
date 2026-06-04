import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LayoutList, Columns, Plus, Search } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { ALL_STATUSES, STATUS_CONFIG } from '@/lib/status'
import { getJobApplications, deleteApplication } from '@/api/applications'
import type { Application, ApplicationStatus } from '@/types'

import ListView from './ListView'
import KanbanView from './KanbanView'
import AddApplicationDialog from './AddApplicationDialog'

type View = 'list' | 'kanban'

const SORT_OPTIONS = [
  { value: 'dateApplied:desc', label: 'Newest first' },
  { value: 'dateApplied:asc', label: 'Oldest first' },
  { value: 'companyName:asc', label: 'Company A–Z' },
  { value: 'companyName:desc', label: 'Company Z–A' },
]

export default function ApplicationsPage() {
  const [view, setView] = useState<View>('list')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('dateApplied:desc')
  const [addOpen, setAddOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getJobApplications,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application deleted')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const filtered = useMemo(() => {
    let list: Application[] = applications
    if (statusFilter !== 'all') {
      list = list.filter(a => a.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.companyName.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q)
      )
    }
    const [field, dir] = sort.split(':')
    return [...list].sort((a, b) => {
      const va = (a[field as keyof Application] as string) ?? ''
      const vb = (b[field as keyof Application] as string) ?? ''
      return dir === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
    })
  }, [applications, statusFilter, search, sort])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-display font-semibold text-text-primary">Applications</h1>
          <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-bg-subtle text-xs font-medium text-text-secondary">
            {applications.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={v => v && setView(v as View)}
            className="border border-border rounded-lg p-0.5"
          >
            <ToggleGroupItem value="list" className="h-7 w-7 p-0 data-[state=on]:bg-bg-subtle" aria-label="List view">
              <LayoutList className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="kanban" className="h-7 w-7 p-0 data-[state=on]:bg-bg-subtle" aria-label="Kanban view">
              <Columns className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="space-y-2">
        {/* Status pills — horizontally scrollable on mobile */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0',
              statusFilter === 'all'
                ? 'bg-accent/15 text-accent'
                : 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80'
            )}
          >
            All
          </button>
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s]
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0',
                  statusFilter === s
                    ? `${cfg.bg} ${cfg.text}`
                    : 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80'
                )}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 w-full sm:w-48 text-sm"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 w-36 text-xs flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Views */}
      {view === 'list' ? (
        <ListView
          applications={filtered}
          isLoading={isLoading}
          onDelete={id => deleteMutation.mutate(id)}
        />
      ) : (
        <KanbanView applications={filtered} />
      )}

      <AddApplicationDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
