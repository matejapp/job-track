import { apiRequest } from "./httpClient";

// Normalize a raw API application to the shape used by UI components.
// Maps capitalized backend fields → lowercase prototype field names so
// components can use a.stage, a.role, a.name, a.applied consistently.
export function normalizeApp(raw) {
  return {
    ...raw,
    // prototype aliases
    name:    raw.companyName   ?? raw.name    ?? '',
    role:    raw.position      ?? raw.role     ?? '',
    stage:   (raw.status       ?? raw.stage   ?? 'applied').toLowerCase(),
    applied: raw.dateApplied   ?? raw.applied ?? '',
    notes:   raw.description   ?? raw.notes   ?? '',
    // preserve originals so forms still work
    companyName:     raw.companyName,
    position:        raw.position,
    status:          raw.status,
    dateApplied:     raw.dateApplied,
    description:     raw.description,
    applicationLink: raw.applicationLink,
    // logo / color defaults (overrideable by future API fields)
    logo:  (raw.companyName ?? raw.name ?? '?').charAt(0).toUpperCase(),
    color: raw.brandColor ?? '#1a1a1c',
    location:   raw.location   ?? '',
    salary:     raw.salary     ?? '',
    source:     raw.source     ?? '',
    resumeVersion: raw.resumeVersion ?? '',
  };
}

const toJobApplicationDto = ({
  companyName,
  position,
  applicationLink,
  status,
  description,
  dateApplied,
}) => ({
  CompanyName: companyName,
  Position: position,
  ApplicationLink: applicationLink,
  Status: status,
  Description: description,
  DateApplied: dateApplied,
});

export const getJobApplications = async () => {
  const data = await apiRequest("/jobapplication");
  return (data.jobApplications ?? []).map(normalizeApp);
};

export const addApplication = async (form) => {
  return apiRequest("/jobapplication", {
    method: "POST",
    body: toJobApplicationDto(form),
  });
};

export const updateApplication = async ({ id, form }) => {
  return apiRequest(`/jobapplication/${id}`, {
    method: "PUT",
    body: toJobApplicationDto(form),
  });
};

export const deleteApplication = async (id) => {
  return apiRequest(`/jobapplication/${id}`, {
    method: "DELETE",
  });
};
