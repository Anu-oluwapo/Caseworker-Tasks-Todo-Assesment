import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  status: taskStatusSchema.optional().default("todo"),
  dueAt: z.coerce.date(),
});

export const updateStatusSchema = z.object({
  status: taskStatusSchema,
});
