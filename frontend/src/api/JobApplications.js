import { apiRequest } from "./httpClient";

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
  return data.jobApplications;
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
