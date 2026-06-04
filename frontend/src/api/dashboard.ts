// BACKEND MISMATCH: The following endpoints are NOT yet implemented in the backend.
// These functions will throw an ApiError until the backend adds them.
// Tracked endpoints:
//   GET /api/dashboard/stats    — aggregate counts (total, inProgress, interviews, offers)
//   GET /api/dashboard/pipeline — per-stage breakdown
//   GET /api/dashboard/upcoming — upcoming activities/events for the user

import { apiRequest } from './httpClient';
import type { DashboardStats, PipelineStage, UpcomingEvent } from '../types';

interface GetDashboardStatsResponse {
  stats?: DashboardStats
}

interface GetDashboardPipelineResponse {
  pipeline?: PipelineStage[]
}

interface GetDashboardUpcomingResponse {
  upcoming?: UpcomingEvent[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await apiRequest<GetDashboardStatsResponse>('/api/dashboard/stats');
  return data.stats!;
}

export async function getDashboardPipeline(): Promise<PipelineStage[]> {
  const data = await apiRequest<GetDashboardPipelineResponse>('/api/dashboard/pipeline');
  return data.pipeline ?? [];
}

export async function getDashboardUpcoming(): Promise<UpcomingEvent[]> {
  const data = await apiRequest<GetDashboardUpcomingResponse>('/api/dashboard/upcoming');
  return data.upcoming ?? [];
}
