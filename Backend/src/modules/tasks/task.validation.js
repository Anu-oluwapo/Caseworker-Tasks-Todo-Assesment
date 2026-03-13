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

export const updateTaskSchema = z
  .object({
    title: z.string().min(2).max(120).optional(),
    description: z.string().max(2000).optional(),
    status: taskStatusSchema.optional(),
    dueAt: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
