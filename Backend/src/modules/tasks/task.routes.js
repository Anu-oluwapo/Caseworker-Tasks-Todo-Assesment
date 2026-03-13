import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as controller from "./task.controller.js";

export const taskRouter = Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *   get:
 *     summary: Retrieve all tasks
 */
taskRouter.get("/", asyncHandler(controller.list));
taskRouter.post("/", asyncHandler(controller.create));

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *   delete:
 *     summary: Delete a task
 */
taskRouter.get("/:id", asyncHandler(controller.getById));
taskRouter.patch("/:id", asyncHandler(controller.patchTask));
taskRouter.delete("/:id", asyncHandler(controller.remove));

/**
 * @openapi
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update status of a task
 */
taskRouter.patch("/:id/status", asyncHandler(controller.patchStatus));
