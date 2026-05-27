import { z } from "zod";

export const activitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Activity name is required")
    .max(200, "Name must not exceed 200 characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters"),
  importance: z.number().int().min(0).max(3),
  date: z.string().min(1, "Date is required"),
});
