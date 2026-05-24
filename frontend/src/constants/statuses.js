// Canonical stage metadata. Keys are lowercase to match the API normalizer.
export const STAGE_META = {
  applied:   { label: 'Applied',   color: 'var(--st-applied)',   cssClass: 'applied' },
  interview: { label: 'Interview', color: 'var(--st-interview)', cssClass: 'interview' },
  offer:     { label: 'Offer',     color: 'var(--st-offer)',     cssClass: 'offer' },
  rejected:  { label: 'Rejected',  color: 'var(--st-rejected)',  cssClass: 'rejected' },
  ghosted:   { label: 'Ghosted',   color: 'var(--st-ghosted)',   cssClass: 'ghosted' },
  withdrawn: { label: 'Withdrawn', color: 'var(--st-withdrawn)', cssClass: 'withdrawn' },
};

// The ordered list used for filter tabs and kanban columns
export const STAGES = Object.keys(STAGE_META);

// Backward-compat: legacy components may still reference STATUSES
export const STATUSES = Object.entries(STAGE_META).map(([value, m]) => ({
  value,
  label: m.label,
  color: m.color,
  cssClass: m.cssClass,
}));

export function getStage(value) {
  const key = (value || '').toLowerCase();
  return STAGE_META[key] ?? STAGE_META.applied;
}

export function funnelCounts(apps) {
  const counts = { applied: 0, interview: 0, offer: 0, rejected: 0, ghosted: 0, withdrawn: 0 };
  apps.forEach(a => {
    const key = (a.stage || a.status || '').toLowerCase();
    if (key in counts) counts[key]++;
  });
  return counts;
}
