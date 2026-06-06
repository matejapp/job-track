import { apiRequest } from './httpClient';
import type { Recruiter, CreateRecruiterDto } from '../types';

interface RawRecruiter {
  id?: string
  name?: string
  email?: string
  phone?: string
  title?: string
  company?: string
  linkedInProfile?: string
  notes?: string
  lastContactedAt?: string | null
  updatedAt?: string
  createdAt?: string
}

function normalizeRecruiter(raw: RawRecruiter): Recruiter {
  return {
    id: raw.id ?? '',
    name: raw.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    title: raw.title ?? '',
    company: raw.company ?? '',
    linkedInProfile: raw.linkedInProfile ?? '',
    notes: raw.notes ?? '',
    lastContactedAt: raw.lastContactedAt ?? null,
    updatedAt: raw.updatedAt ?? '',
    createdAt: raw.createdAt ?? '',
  }
}

const toBackendDto = (dto: CreateRecruiterDto) => ({
  Name: dto.name,
  Email: dto.email,
  Phone: dto.phone,
  Title: dto.title,
  Company: dto.company,
  LinkedInProfile: dto.linkedInProfile,
  Notes: dto.notes,
  LastContactedAt: dto.lastContactedAt ?? null,
})

interface GetRecruitersResponse {
  recruiters?: RawRecruiter[]
}

interface GetRecruiterResponse {
  recruiter?: RawRecruiter
}

export async function getRecruiters(): Promise<Recruiter[]> {
  const data = await apiRequest<GetRecruitersResponse>('/api/recruiter');
  return (data.recruiters ?? []).map(normalizeRecruiter);
}

export async function getRecruiter(id: string): Promise<Recruiter> {
  const data = await apiRequest<GetRecruiterResponse>(`/api/recruiter/${id}`);
  return normalizeRecruiter(data.recruiter ?? {});
}

export async function createRecruiter(dto: CreateRecruiterDto): Promise<Recruiter> {
  const data = await apiRequest<GetRecruiterResponse>('/api/recruiter', {
    method: 'POST',
    body: toBackendDto(dto),
  });
  return normalizeRecruiter(data.recruiter ?? {});
}

export async function updateRecruiter(id: string, dto: CreateRecruiterDto): Promise<Recruiter> {
  const data = await apiRequest<GetRecruiterResponse>(`/api/recruiter/${id}`, {
    method: 'PUT',
    body: toBackendDto(dto),
  });
  return normalizeRecruiter(data.recruiter ?? {});
}

export async function deleteRecruiter(id: string): Promise<void> {
  await apiRequest(`/api/recruiter/${id}`, { method: 'DELETE' });
}
