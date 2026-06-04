import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/shared/StatusBadge'
import { STATUS_CONFIG, ALL_STATUSES } from '@/lib/status'
import { updateApplication } from '@/api/applications'
import type { Application, ApplicationStatus } from '@/types'
import type { NormalizedApplication } from '@/api/applications'
import AddApplicationDialog from './AddApplicationDialog'

interface Props {
  applications: Application[]
}

interface CardProps {
  app: Application
  dragging?: boolean
}

function ApplicationCard({ app, dragging = false }: CardProps) {
  const navigate = useNavigate()
  return (
    <div
      className={`bg-bg-surface border border-border rounded-lg p-3 cursor-pointer transition-all ${
        dragging ? 'shadow-lg opacity-90 rotate-1' : 'hover:shadow-md hover:border-border'
      }`}
      onClick={() => !dragging && navigate(`/applications/${app.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-text-primary truncate">{app.companyName}</p>
          <p className="text-xs text-text-secondary truncate mt-0.5">{app.position}</p>
        </div>
        <StatusBadge status={app.status} size="sm" />
      </div>
      {app.dateApplied && (
        <p className="text-xs text-text-muted mt-2">
          {(() => { try { return format(parseISO(app.dateApplied), 'MMM d') } catch { return '' } })()}
        </p>
      )}
    </div>
  )
}

function SortableCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...listeners}
        {...attributes}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 p-1"
        onClick={e => e.stopPropagation()}
      >
        <GripVertical className="h-3 w-3 text-text-muted" />
      </div>
      <div className="pl-4">
        <ApplicationCard app={app} />
      </div>
    </div>
  )
}

function Column({
  status,
  apps,
  onAddClick,
}: {
  status: ApplicationStatus
  apps: Application[]
  onAddClick: (status: ApplicationStatus) => void
}) {
  const cfg = STATUS_CONFIG[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border transition-colors min-w-[240px] w-[240px] ${
        isOver ? 'border-accent bg-accent/5' : 'border-border bg-bg-subtle'
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-bg-base text-xs font-medium text-text-muted">
            {apps.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        <SortableContext items={apps.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {apps.map(app => <SortableCard key={app.id} app={app} />)}
        </SortableContext>
      </div>

      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-text-muted hover:text-text-secondary h-7 text-xs"
          onClick={() => onAddClick(status)}
        >
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}

export default function KanbanView({ applications }: Props) {
  const queryClient = useQueryClient()
  const [activeApp, setActiveApp] = useState<Application | null>(null)
  const [addDialogStatus, setAddDialogStatus] = useState<ApplicationStatus | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const mutation = useMutation({
    mutationFn: ({ id, app }: { id: string; app: NormalizedApplication }) =>
      updateApplication(id, {
        companyName: app.companyName,
        position: app.position,
        applicationLink: app.applicationLink,
        status: app.status,
        location: app.location,
        salary: app.salary,
        source: app.source,
        resumeVersion: app.resumeVersion,
        workMode: app.workMode,
        dateApplied: app.dateApplied,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
    onError: (err: Error) => toast.error(err.message),
  })

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find(a => a.id === event.active.id)
    setActiveApp(app ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveApp(null)
    if (!over || active.id === over.id) return

    const app = applications.find(a => a.id === active.id) as NormalizedApplication | undefined
    const newStatus = over.id as ApplicationStatus

    if (!app || !ALL_STATUSES.includes(newStatus) || app.status === newStatus) return

    mutation.mutate({ id: app.id, app: { ...app, status: newStatus } })
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {ALL_STATUSES.map(status => (
            <Column
              key={status}
              status={status}
              apps={applications.filter(a => a.status === status)}
              onAddClick={s => setAddDialogStatus(s)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeApp && <ApplicationCard app={activeApp} dragging />}
        </DragOverlay>
      </DndContext>

      {addDialogStatus && (
        <AddApplicationDialog
          open={!!addDialogStatus}
          onOpenChange={o => !o && setAddDialogStatus(null)}
          defaultStatus={addDialogStatus}
        />
      )}
    </>
  )
}
