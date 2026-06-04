import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, AlertCircle } from 'lucide-react'
import { getRecruiters } from '@/api/recruiters'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function RecruitersPage() {
  const [search, setSearch] = useState('')

  const { data: recruiters = [], isLoading } = useQuery({
    queryKey: ['recruiters'],
    queryFn: getRecruiters,
    retry: false,
  })

  const filtered = recruiters.filter(r =>
    `${r.firstName} ${r.lastName} ${r.company}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">Recruiters</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {recruiters.length > 0 ? `${recruiters.length} contact${recruiters.length !== 1 ? 's' : ''}` : 'Manage your recruiter contacts'}
          </p>
        </div>
        <Button disabled title="Coming soon — backend not yet implemented">
          Add Recruiter
        </Button>
      </div>

      {/* Backend notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-bg-subtle">
        <AlertCircle className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
        <p className="text-sm text-text-secondary">
          Recruiter tracking requires a backend update. Data will appear here once the API is live.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : recruiters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No recruiters yet"
          description="Recruiter contacts will appear here once the API is implemented."
        />
      ) : (
        <>
          <Input
            placeholder="Search recruiters…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map(r => {
              const initials = `${r.firstName.charAt(0)}${r.lastName.charAt(0)}`.toUpperCase()
              return (
                <div key={r.id} className="p-4 rounded-lg border border-border bg-bg-surface space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold shrink-0'
                    )}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">{r.firstName} {r.lastName}</p>
                      {r.title && <p className="text-xs text-text-muted truncate">{r.title}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-bg-subtle text-text-secondary">
                      {r.company}
                    </span>
                    {r.email && (
                      <p className="text-xs text-text-muted truncate">{r.email}</p>
                    )}
                  </div>
                  {r.lastContactDate && (
                    <p className="text-xs text-text-muted">
                      Last contact: {new Date(r.lastContactDate).toLocaleDateString()}
                    </p>
                  )}
                  {r.linkedApplicationIds && r.linkedApplicationIds.length > 0 && (
                    <p className="text-xs text-text-muted">
                      Linked to {r.linkedApplicationIds.length} application{r.linkedApplicationIds.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
