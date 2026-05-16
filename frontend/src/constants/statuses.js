export const STATUSES = [
  { value: 'Applied',    label: 'Applied',    color: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
  { value: 'Screening',  label: 'Screening',  color: '#06b6d4', bg: '#ecfeff', text: '#0e7490' },
  { value: 'Interview',  label: 'Interview',  color: '#f97316', bg: '#fff7ed', text: '#c2410c' },
  { value: 'Assessment', label: 'Assessment', color: '#f59e0b', bg: '#fffbeb', text: '#b45309' },
  { value: 'Offer',      label: 'Offer',      color: '#22c55e', bg: '#f0fdf4', text: '#15803d' },
  { value: 'Rejected',   label: 'Rejected',   color: '#ef4444', bg: '#fef2f2', text: '#b91c1c' },
]

export const getStatus = (value) =>
  STATUSES.find((s) => s.value === value) ?? {
    value, label: value, color: '#94a3b8', bg: '#f8fafc', text: '#475569',
  }
