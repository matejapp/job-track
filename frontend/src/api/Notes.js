import { apiRequest } from "./httpClient";

export const getNotes = async (jobId) => {
  const data = await apiRequest(`/jobapplications/${jobId}/notes`);
  return data.notes ?? [];
};

export const createNote = async ({ jobId, content }) => {
  return apiRequest(`/jobapplications/${jobId}/notes`, {
    method: "POST",
    body: { Content: content },
  });
};

export const updateNote = async ({ jobId, id, content }) => {
  return apiRequest(`/jobapplications/${jobId}/notes/${id}`, {
    method: "PUT",
    body: { Content: content },
  });
};

export const deleteNote = async ({ jobId, id }) => {
  return apiRequest(`/jobapplications/${jobId}/notes/${id}`, {
    method: "DELETE",
  });
};
