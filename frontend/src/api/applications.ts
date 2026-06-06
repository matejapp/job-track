import { apiRequest } from './httpClient';
import type { Application, ApplicationStatus, WorkMode, CreateApplicationDto } from '../types';

// Raw shape returned by backend (PascalCase fields).
interface RawApplication {
  id?: string
  userId?: string
  CompanyName?: string
  companyName?: string
  name?: string
  Position?: string
  position?: string
  role?: string
  Status?: ApplicationStatus
  status?: ApplicationStatus | string
  stage?: string
  DateApplied?: string
  dateApplied?: string
  applied?: string
  Description?: string
  description?: string
  notes?: string
  ApplicationLink?: string
  applicationLink?: string
  Location?: string
  location?: string
  Salary?: string
  salary?: string
  Source?: string
  source?: string
  ResumeVersion?: string
  resumeVersion?: string
  WorkMode?: WorkMode
  workMode?: WorkMode
  brandColor?: string
  recruiterId?: string
  dateUpdated?: string
  dateCreated?: string
}

// Normalized application shape used by UI components.
// Maps PascalCase backend fields → camelCase frontend aliases so components
// can use app.stage, app.role, app.name, app.applied consistently.
export interface NormalizedApplication extends Application {
  // Alias fields for UI convenience
  name: string
  role: string
  stage: string
  applied: string
  notes: string
  // Computed display fields
  logo: string
  color: string
}

export function normalizeApp(raw: RawApplication): NormalizedApplication {
  const companyName = raw.CompanyName ?? raw.companyName ?? '';
  const position = raw.Position ?? raw.position ?? '';
  const status = (raw.Status ?? raw.status) as ApplicationStatus | undefined;
  const dateApplied = raw.DateApplied ?? raw.dateApplied ?? '';
  const description = raw.Description ?? raw.description ?? '';
  const applicationLink = raw.ApplicationLink ?? raw.applicationLink ?? '';
  const location = raw.Location ?? raw.location ?? '';
  const salary = raw.Salary ?? raw.salary ?? '';
  const source = raw.Source ?? raw.source ?? '';
  const resumeVersion = raw.ResumeVersion ?? raw.resumeVersion ?? '';
  const workMode = raw.WorkMode ?? raw.workMode ?? 'OnSite';

  return {
    // Standard Application fields
    id: raw.id ?? '',
    userId: raw.userId ?? '',
    companyName,
    position,
    applicationLink,
    status: status ?? 'Applied',
    location,
    salary,
    source,
    resumeVersion,
    workMode,
    recruiterId: raw.recruiterId,
    dateApplied,
    dateUpdated: raw.dateUpdated ?? '',
    dateCreated: raw.dateCreated ?? '',
    // UI alias fields
    name: companyName || (raw.name ?? ''),
    role: position || (raw.role ?? ''),
    stage: (status ?? raw.stage ?? 'applied').toLowerCase(),
    applied: dateApplied || (raw.applied ?? ''),
    notes: description || (raw.notes ?? ''),
    // Computed display
    logo: (companyName || raw.name || '?').charAt(0).toUpperCase(),
    color: raw.brandColor ?? '#1a1a1c',
  };
}

// Maps our camelCase CreateApplicationDto → backend PascalCase request body.
interface BackendCreateJobApplicationDto {
  RecruiterId?: string
  CompanyName: string
  Position: string
  ApplicationLink: string
  Status: ApplicationStatus
  Description: string
  DateApplied: string
  Location: string
  Salary: string
  Source: string
  ResumeVersion: string
  WorkMode: WorkMode
}

const toJobApplicationDto = (dto: CreateApplicationDto): BackendCreateJobApplicationDto => ({
  RecruiterId: dto.recruiterId ?? undefined,
  CompanyName: dto.companyName,
  Position: dto.position,
  ApplicationLink: dto.applicationLink,
  Status: dto.status,
  Description: '',
  DateApplied: dto.dateApplied,
  Location: dto.location ?? '',
  Salary: dto.salary ?? '',
  Source: dto.source ?? '',
  ResumeVersion: dto.resumeVersion ?? '',
  WorkMode: dto.workMode || 'OnSite',
});

interface GetJobApplicationsResponse {
  jobApplications?: RawApplication[]
}

export const getJobApplications = async (): Promise<NormalizedApplication[]> => {
  const data = await apiRequest<GetJobApplicationsResponse>('/api/jobapplication');
  return (data.jobApplications ?? []).map(normalizeApp);
};

interface GetJobApplicationResponse {
  jobApplication?: RawApplication
}

export const getJobApplication = async (id: string): Promise<NormalizedApplication> => {
  const data = await apiRequest<GetJobApplicationResponse>(`/api/jobapplication/${id}`);
  return normalizeApp(data.jobApplication ?? {});
};

export const addApplication = async (dto: CreateApplicationDto): Promise<unknown> => {
  return apiRequest('/api/jobapplication', {
    method: 'POST',
    body: toJobApplicationDto(dto),
  });
};

export const updateApplication = async (id: string, dto: CreateApplicationDto): Promise<unknown> => {
  return apiRequest(`/api/jobapplication/${id}`, {
    method: 'PUT',
    body: toJobApplicationDto(dto),
  });
};

export const deleteApplication = async (id: string): Promise<void> => {
  await apiRequest(`/api/jobapplication/${id}`, {
    method: 'DELETE',
  });
};
