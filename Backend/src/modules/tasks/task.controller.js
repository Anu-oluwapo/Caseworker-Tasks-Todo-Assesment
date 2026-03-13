import { HttpError } from "../../utils/httpError.js";
import { createTaskSchema, updateStatusSchema } from "./task.validation.js";
import * as service from "./task.service.js";

export async function create(req, res) {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success)
    throw new HttpError(400, "Invalid payload", parsed.error.flatten());

  const task = await service.createTask(parsed.data);
  res.status(201).json(task);
}

export async function getById(req, res) {
  const task = await service.getTaskById(req.params.id);
  if (!task) throw new HttpError(404, "Task not found");
  res.json(task);
}

export async function list(_req, res) {
  const tasks = await service.listTasks();
  res.json(tasks);
}

export async function patchStatus(req, res) {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success)
    throw new HttpError(400, "Invalid payload", parsed.error.flatten());

  const updated = await service.updateTaskStatus(
    req.params.id,
    parsed.data.status,
  );
  if (!updated) throw new HttpError(404, "Task not found");
  res.json(updated);
}

export async function remove(req, res) {
  const deleted = await service.deleteTask(req.params.id);
  if (!deleted) throw new HttpError(404, "Task not found");
  res.status(204).send();
}
