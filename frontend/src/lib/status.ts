import type { ApplicationStatus, ApplicationColor } from '@/types'

interface StatusConfig {
  label: string
  bg: string
  text: string
}

interface ColorConfig {
  bg: string
  text: string
  label: string
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  Applied:   { label: 'Applied',      bg: 'bg-info/15',        text: 'text-info' },
  Interview: { label: 'Interviewing', bg: 'bg-warning/15',     text: 'text-warning' },
  Offer:     { label: 'Offered',      bg: 'bg-accent/15',      text: 'text-accent' },
  Rejected:  { label: 'Rejected',     bg: 'bg-danger/15',      text: 'text-danger' },
  Ghosted:   { label: 'Ghosted',      bg: 'bg-text-muted/10',  text: 'text-text-muted' },
  Withdrawn: { label: 'Withdrawn',    bg: 'bg-text-muted/10',  text: 'text-text-muted' },
}

export const COLOR_CONFIG: Record<ApplicationColor, ColorConfig> = {
  default: { bg: 'bg-accent/15',        text: 'text-accent',        label: 'Green' },
  blue:    { bg: 'bg-info/15',          text: 'text-info',          label: 'Blue' },
  amber:   { bg: 'bg-warning/15',       text: 'text-warning',       label: 'Amber' },
  red:     { bg: 'bg-danger/15',        text: 'text-danger',        label: 'Red' },
  purple:  { bg: 'bg-purple-500/15',    text: 'text-purple-500',    label: 'Purple' },
  rose:    { bg: 'bg-rose-500/15',      text: 'text-rose-500',      label: 'Rose' },
  indigo:  { bg: 'bg-indigo-500/15',    text: 'text-indigo-500',    label: 'Indigo' },
  orange:  { bg: 'bg-orange-500/15',    text: 'text-orange-500',    label: 'Orange' },
}

export const ALL_STATUSES: ApplicationStatus[] = [
  'Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn',
]

export const ALL_COLORS: ApplicationColor[] = [
  'default', 'blue', 'amber', 'red', 'purple', 'rose', 'indigo', 'orange',
]

export function getStatusConfig(status: ApplicationStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.Applied
}

export function getColorConfig(color?: ApplicationColor | null): ColorConfig {
  return COLOR_CONFIG[color as ApplicationColor] ?? COLOR_CONFIG['default']
}
