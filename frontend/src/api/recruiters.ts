// BACKEND MISMATCH: No Recruiter entity exists in the backend yet.
// These functions will throw an ApiError until the backend implements the recruiter model.
// Tracked endpoints:
//   GET    /api/recruiters         — list all recruiters for the user
//   POST   /api/recruiters         — create a recruiter
//   PUT    /api/recruiters/{id}    — update a recruiter
//   DELETE /api/recruiters/{id}    — delete a recruiter

import { apiRequest } from './httpClient';
import type { Recruiter } from '../types';

type CreateRecruiterDto = Omit<Recruiter, 'id'>

interface GetRecruitersResponse {
  recruiters?: Recruiter[]
}

interface GetRecruiterResponse {
  recruiter?: Recruiter
}

export async function getRecruiters(): Promise<Recruiter[]> {
  const data = await apiRequest<GetRecruitersResponse>('/api/recruiters');
  return data.recruiters ?? [];
}

export async function createRecruiter(dto: CreateRecruiterDto): Promise<Recruiter> {
  const data = await apiRequest<GetRecruiterResponse>('/api/recruiters', {
    method: 'POST',
    body: dto,
  });
  return data.recruiter!;
}

export async function updateRecruiter(id: string, dto: Partial<CreateRecruiterDto>): Promise<Recruiter> {
  const data = await apiRequest<GetRecruiterResponse>(`/api/recruiters/${id}`, {
    method: 'PUT',
    body: dto,
  });
  return data.recruiter!;
}

export async function deleteRecruiter(id: string): Promise<void> {
  await apiRequest(`/api/recruiters/${id}`, {
    method: 'DELETE',
  });
}
