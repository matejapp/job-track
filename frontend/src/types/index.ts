// ─── Enums (mirror backend C# enums, values sent as strings) ─────────────────

export type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted'
  | 'Withdrawn'

export type ApplicationColor =
  | 'default'
  | 'blue'
  | 'amber'
  | 'red'
  | 'purple'
  | 'rose'
  | 'indigo'
  | 'orange'

export type WorkMode = 'Remote' | 'OnSite' | 'Hybrid'

export type ActivityImportance = 'Low' | 'Medium' | 'High' | 'Urgent'

// ─── Backend DTOs ──────────────────────────────────────────────────────────────

export interface Application {
  id: string
  userId: string
  companyName: string
  position: string
  applicationLink: string
  status: ApplicationStatus
  color?: ApplicationColor
  location: string
  salary: string
  source: string
  resumeVersion: string
  workMode: WorkMode
  documentId?: string
  dateApplied: string     // ISO date string
  dateUpdated: string
  dateCreated: string
}

export interface Activity {
  id: string
  userId: string
  jobId: string
  name: string
  description: string
  importance: ActivityImportance
  date: string            // ISO date string
  dateCreated: string
  dateUpdated: string
  completed: boolean
  isUpcoming: boolean
}

export interface Note {
  id: string
  userId: string
  jobId: string
  content: string
  dateCreated: string
  dateUpdated: string
}

export interface User {
  id: string | null
  name: string
  email: string
}

export interface Recruiter {
  id: string,
  name: string,
  email: string,
  company: string,
  linkedInProfile: string,
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateApplicationDto {
  companyName: string
  position: string
  applicationLink: string
  status: ApplicationStatus
  color?: ApplicationColor
  location: string
  salary: string
  source: string
  resumeVersion: string
  workMode: WorkMode
  dateApplied: string
}

export interface CreateActivityDto {
  name: string
  description: string
  importance: ActivityImportance
  date: string
}

export interface CreateNoteDto {
  content: string
}

export interface CreateRecruiterDto {
  name: string,
  email: string,
  company: string,
  linkedInProfile: string,
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiListResponse<T> {
  data: T[] | null
  error?: { code: string; message: string } | null
  traceId?: string
}

export interface ApiSingleResponse<T> {
  data: T | null
  error?: { code: string; message: string } | null
  traceId?: string
}

export interface LoginResponse {
  token: string
  user: User
}

// ─── Frontend-only types (not from backend) ───────────────────────────────────

/**
 * Missing endpoints — documented mismatch.
 * These types describe what the frontend expects when the backend
 * implements these endpoints (currently unimplemented).
 */
export interface DashboardStats {
  total: number
  inProgress: number
  interviews: number
  offers: number
}

export interface PipelineStage {
  stage: string
  count: number
}

export interface UpcomingEvent {
  id: string
  type: string
  company: string
  date: string
  label: string
}

export interface CalendarDay {
  date: string
  items: { id: string; type: 'application' | 'note'; label: string; status?: ApplicationStatus }[]
}

export interface StatisticsData {
  responseRate: number
  interviewRate: number
  activeApplications: number
  offersReceived: number
  cumulativeData: { date: string; count: number }[]
  funnelData: { stage: string; count: number; percentage: number }[]
  stageData: { stage: string; count: number }[]
  activityGrid: { date: string; count: number }[]
}

// Recruiter & Document — not implemented in backend yet
export interface Recruiter {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  linkedIn?: string
  company: string
  title?: string
  linkedApplicationIds?: string[]
  notes?: string
  lastContactDate?: string
}

export interface Document {
  id: string
  name: string
  type: 'resume' | 'cover_letter'
  version?: string
  fileUrl: string
  fileType: 'pdf' | 'docx'
  usedInApplicationIds?: string[]
  uploadedAt: string
}

// ─── Auth context shape ───────────────────────────────────────────────────────

export interface AuthContextValue {
  token: string | null
  user: User | null
  saveToken: (token: string) => void
  saveUser: (user: User | null) => void
  logout: () => void
}
