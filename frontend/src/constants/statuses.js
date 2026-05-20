export const STATUSES = [{
    value: 'Applied',
    label: 'Applied',
    color: '#3b82f6',
    bg: '#eff6ff',
    text: '#1d4ed8'
  },
  {
    value: 'Interview',
    label: 'Interview',
    color: '#f97316',
    bg: '#fff7ed',
    text: '#c2410c'
  },
  {
    value: 'Offer',
    label: 'Offer',
    color: '#22c55e',
    bg: '#f0fdf4',
    text: '#15803d'
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    color: '#ef4444',
    bg: '#fef2f2',
    text: '#b91c1c'
  },
  {
    value: 'Ghosted',
    label: 'Ghosted',
    color: '#a78bfa',
    bg: '#f8fafc',
    text: '#7c3aed'
  },
  {
    value: 'Withdrawn',
    label: 'Withdrawn',
    color: '#94a3b8',
    bg: '#f8fafc',
    text: '#475569'
  },
]

export const getStatus = (value) =>
  STATUSES.find((s) => s.value === value) ?? {
    value,
    label: value,
    color: '#94a3b8',
    bg: '#f8fafc',
    text: '#475569',
  };