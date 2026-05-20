import { z } from "zod";

export const APPLICATION_STATUSES = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
  "Withdrawn",
];

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
});

export const emptyJobApplicationForm = () => ({
  companyName: "",
  position: "",
  applicationLink: "",
  status: "Applied",
  description: "",
  dateApplied: new Date().toISOString().slice(0, 10),
});

export const toJobApplicationForm = (app) => ({
  companyName: app?.companyName ?? "",
  position: app?.position ?? "",
  applicationLink: app?.applicationLink ?? "",
  status: APPLICATION_STATUSES.includes(app?.status) ? app.status : "Applied",
  description: app?.description ?? "",
  dateApplied: app?.dateApplied
    ? app.dateApplied.slice(0, 10)
    : new Date().toISOString().slice(0, 10),
});
