import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { MoreHorizontal, Eye, Trash2, Briefcase } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import type { Application } from '@/types'

interface Props {
  applications: Application[]
  isLoading: boolean
  onDelete: (id: string) => void
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-8 rounded" /></td>
    </tr>
  )
}

function safeDate(dateStr: string): string {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'MMM d, yyyy') }
  catch { return '—' }
}

export default function ListView({ applications, isLoading, onDelete }: Props) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide">Position</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide">Date Applied</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden md:table-cell">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden lg:table-cell">Work Mode</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4">
                  <EmptyState
                    icon={Briefcase}
                    title="No applications found"
                    description="Try adjusting your filters or add a new application."
                  />
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr
                  key={app.id}
                  className="hover:bg-bg-subtle cursor-pointer transition-colors"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                        {app.companyName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-text-primary">{app.companyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{app.position}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {safeDate(app.dateApplied)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    {app.location || '—'}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                    {app.workMode || '—'}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/applications/${app.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-danger focus:text-danger"
                          onClick={() => onDelete(app.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
