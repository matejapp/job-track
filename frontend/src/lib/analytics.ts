import posthog from 'posthog-js'

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

  if (!key) return

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  })
}

export function identifyUser(id: string, props?: { name?: string; email?: string }) {
  posthog.identify(id, props)
}

export function resetUser() {
  posthog.reset()
}

// ─── Typed event helpers ──────────────────────────────────────────────────────

export const track = {
  applicationCreated: (props: { status: string; workMode: string; hasRecruiter: boolean }) =>
    posthog.capture('application_created', props),

  applicationUpdated: (props: { status: string }) =>
    posthog.capture('application_updated', props),

  applicationDeleted: () =>
    posthog.capture('application_deleted'),

  statusChanged: (props: { from: string; to: string }) =>
    posthog.capture('status_changed', props),

  recruiterAdded: () =>
    posthog.capture('recruiter_added'),

  recruiterDeleted: () =>
    posthog.capture('recruiter_deleted'),

  noteCreated: () =>
    posthog.capture('note_created'),

  activityLogged: (props: { importance: string }) =>
    posthog.capture('activity_logged', props),

  userRegistered: () =>
    posthog.capture('user_registered'),

  userLoggedIn: () =>
    posthog.capture('user_logged_in'),
}
