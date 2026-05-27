import { apiRequest } from "./httpClient";

export const getAllActivities = async () => {
  const data = await apiRequest("/activity");
  return data.activities ?? [];
};

export const getActivitiesByJob = async (jobId) => {
  const data = await apiRequest(`/activity/job/${jobId}`);
  return data.activities ?? [];
};

export const getActivityById = async (id) => {
  const data = await apiRequest(`/activity/${id}`);
  return data.activity;
};

export const createActivity = async ({ jobId, dto }) => {
  return apiRequest(`/activity/job/${jobId}`, {
    method: "POST",
    body: {
      Name: dto.name,
      Description: dto.description ?? "",
      Importance: Number(dto.importance ?? 0),
      Date: dto.date,
    },
  });
};

export const updateActivity = async ({ id, dto }) => {
  return apiRequest(`/activity/${id}`, {
    method: "PUT",
    body: {
      Name: dto.name,
      Description: dto.description ?? "",
      Importance: Number(dto.importance ?? 0),
      Date: dto.date,
    },
  });
};

export const toggleActivityComplete = async (id) => {
  return apiRequest(`/activity/${id}/complete`, {
    method: "PATCH",
  });
};

export const deleteActivity = async (id) => {
  return apiRequest(`/activity/${id}`, {
    method: "DELETE",
  });
};
