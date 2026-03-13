import { Task } from "./task.model.js";

export async function createTask(input) {
  return Task.create(input);
}

export async function getTaskById(id) {
  return Task.findById(id);
}

export async function listTasks() {
  return Task.find().sort({ dueAt: 1, createdAt: -1 });
}

export async function updateTaskStatus(id, status) {
  return Task.findByIdAndUpdate(id, { status }, { new: true });
}

export async function updateTask(id, data) {
  return Task.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteTask(id) {
  return Task.findByIdAndDelete(id);
}
