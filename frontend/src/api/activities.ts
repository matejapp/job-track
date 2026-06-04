import { apiRequest } from './httpClient';
import type { Activity, CreateActivityDto, ActivityImportance } from '../types';

// Backend sends PascalCase field names for numeric importance values.
// Map from numeric → string union for ActivityImportance.
const importanceFromNumber = (value: number): ActivityImportance => {
  const map: Record<number, ActivityImportance> = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Urgent',
  };
  return map[value] ?? 'Low';
};

// Backend request body uses PascalCase fields and numeric importance.
interface BackendCreateActivityDto {
  Name: string
  Description: string
  Importance: number
  Date: string
}

const importanceToNumber = (importance: ActivityImportance | string | number): number => {
  if (typeof importance === 'number') return importance;
  const map: Record<ActivityImportance, number> = {
    Low: 0,
    Medium: 1,
    High: 2,
    Urgent: 3,
  };
  return map[importance as ActivityImportance] ?? 0;
};

const toActivityDto = (dto: CreateActivityDto): BackendCreateActivityDto => ({
  Name: dto.name,
  Description: dto.description ?? '',
  Importance: importanceToNumber(dto.importance),
  Date: dto.date,
});

interface GetActivitiesResponse {
  activities?: Activity[]
}

interface GetActivityResponse {
  activity?: Activity
}

export const getActivitiesByJob = async (jobId: string): Promise<Activity[]> => {
  const data = await apiRequest<GetActivitiesResponse>(`/api/activity/job/${jobId}`);
  return data.activities ?? [];
};

export const createActivity = async (jobId: string, dto: CreateActivityDto): Promise<unknown> => {
  return apiRequest(`/api/activity/job/${jobId}`, {
    method: 'POST',
    body: toActivityDto(dto),
  });
};

export const updateActivity = async (id: string, dto: CreateActivityDto): Promise<Activity> => {
  const data = await apiRequest<GetActivityResponse>(`/api/activity/${id}`, {
    method: 'PUT',
    body: toActivityDto(dto),
  });
  return data.activity!;
};

export const toggleActivityComplete = async (id: string): Promise<void> => {
  await apiRequest(`/api/activity/${id}/complete`, {
    method: 'PATCH',
  });
};

export const deleteActivity = async (id: string): Promise<void> => {
  await apiRequest(`/api/activity/${id}`, {
    method: 'DELETE',
  });
};

export const getAllActivities = async (): Promise<Activity[]> => {
  const data = await apiRequest<GetActivitiesResponse>('/api/activity');
  return data.activities ?? [];
};

// Re-export helper in case callers need it for display purposes.
export { importanceFromNumber };
