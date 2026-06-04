import type { ApplicationStatus } from '@/types'

interface StatusConfig {
  label: string
  bg: string
  text: string
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  Applied:   { label: 'Applied',     bg: 'bg-info/15',              text: 'text-info' },
  Interview: { label: 'Interviewing',bg: 'bg-warning/15',           text: 'text-warning' },
  Offer:     { label: 'Offered',     bg: 'bg-accent/15',            text: 'text-accent' },
  Rejected:  { label: 'Rejected',    bg: 'bg-text-muted/10',        text: 'text-text-muted' },
  Ghosted:   { label: 'Ghosted',     bg: 'bg-text-muted/10',        text: 'text-text-muted' },
  Withdrawn: { label: 'Withdrawn',   bg: 'bg-text-muted/10',        text: 'text-text-muted' },
}

export const ALL_STATUSES: ApplicationStatus[] = [
  'Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn',
]

export function getStatusConfig(status: ApplicationStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.Applied
}
