import { z } from 'zod'
import type { Recruiter } from '@/types'

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const isTodayOrPast = (value: string): boolean => {
  if (!value) return true
  return value <= new Date().toISOString().slice(0, 10)
}

export const recruiterSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200, 'Name cannot exceed 200 characters'),
  title: z.string().trim().max(200, 'Title cannot exceed 200 characters').optional().or(z.literal('')),
  company: z.string().trim().min(2, 'Company must be at least 2 characters').max(200, 'Company cannot exceed 200 characters'),
  linkedInProfile: z
    .string()
    .trim()
    .max(500, 'LinkedIn profile cannot exceed 500 characters')
    .refine(
      val => val === '' || isHttpUrl(val),
      'LinkedIn profile must be a valid http(s) URL',
    ),
  email: z
    .string()
    .trim()
    .max(254, 'Email cannot exceed 254 characters')
    .refine(
      val => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Invalid email address',
    ),
  phone: z.string().trim().max(20, 'Phone number cannot exceed 20 characters'),
  notes: z.string().trim().max(2000, 'Notes cannot exceed 2000 characters'),
  lastContactedAt: z
    .string()
    .refine(isTodayOrPast, 'Last contact date cannot be in the future'),
})

export type RecruiterFormValues = z.infer<typeof recruiterSchema>

export const emptyRecruiterForm = (): RecruiterFormValues => ({
  name: '',
  title: '',
  company: '',
  linkedInProfile: '',
  email: '',
  phone: '',
  notes: '',
  lastContactedAt: '',
})

export const toRecruiterForm = (r?: Recruiter | null): RecruiterFormValues => ({
  name: r?.name ?? '',
  title: r?.title ?? '',
  company: r?.company ?? '',
  linkedInProfile: r?.linkedInProfile ?? '',
  email: r?.email ?? '',
  phone: r?.phone ?? '',
  notes: r?.notes ?? '',
  lastContactedAt: r?.lastContactedAt ? r.lastContactedAt.slice(0, 10) : '',
})
