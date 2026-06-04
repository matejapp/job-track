// BACKEND MISMATCH: No statistics endpoint exists in the backend yet.
// This function will throw an ApiError until the backend implements it.
// Tracked endpoint:
//   GET /api/statistics — aggregated statistics for the authenticated user

import { apiRequest } from './httpClient';
import type { StatisticsData } from '../types';

interface GetStatisticsResponse {
  statistics?: StatisticsData
}

export async function getStatistics(): Promise<StatisticsData> {
  const data = await apiRequest<GetStatisticsResponse>('/api/statistics');
  return data.statistics!;
}
