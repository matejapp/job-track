import { z } from "zod";

export const APPLICATION_STATUSES = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
  "Withdrawn",
];

export const WORK_MODES = ["Remote", "OnSite", "Hybrid"];

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isTodayOrPast = (value) => {
  if (!value) return false;
  return value <= new Date().toISOString().slice(0, 10);
};

export const jobApplicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters"),
  position: z.string().trim().min(2, "Position must be at least 2 characters"),
  applicationLink: z
    .string()
    .trim()
    .refine(isHttpUrl, "Application link must be a valid http(s) URL"),
  status: z.enum(APPLICATION_STATUSES, {
    message: "Choose a valid application status",
  }),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  dateApplied: z
    .string()
    .min(1, "Date applied is required")
    .refine(isTodayOrPast, "Date applied cannot be in the future"),
  location: z
    .string()
    .trim()
    .max(200, "Location must be less than 200 characters"),
  salary: z
    .string()
    .trim()
    .max(100, "Salary must be less than 100 characters"),
  source: z
    .string()
    .trim()
    .max(100, "Source must be less than 100 characters"),
  resumeVersion: z
    .string()
    .trim()
    .max(100, "Resume version must be less than 100 characters"),
  workMode: z.enum(WORK_MODES, {
    message: "Choose a valid work mode",
  }),
});

export const emptyJobApplicationForm = () => ({
  companyName: "",
  position: "",
  applicationLink: "",
  status: "Applied",
  description: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  location: "",
  salary: "",
  source: "",
  resumeVersion: "",
  workMode: "OnSite",
});

const toApplicationStatus = (value) =>
  APPLICATION_STATUSES.find(
    (status) => status.toLowerCase() === String(value ?? "").toLowerCase(),
  ) ?? "Applied";

const toWorkMode = (value) =>
  WORK_MODES.find(
    (mode) => mode.toLowerCase() === String(value ?? "").toLowerCase(),
  ) ?? "OnSite";

export const toJobApplicationForm = (app) => ({
  companyName: app?.companyName ?? "",
  position: app?.position ?? "",
  applicationLink: app?.applicationLink ?? "",
  status: toApplicationStatus(app?.status ?? app?.stage),
  description: app?.description ?? "",
  dateApplied: app?.dateApplied
    ? app.dateApplied.slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  location: app?.location ?? "",
  salary: app?.salary ?? "",
  source: app?.source ?? "",
  resumeVersion: app?.resumeVersion ?? "",
  workMode: toWorkMode(app?.workMode),
});
