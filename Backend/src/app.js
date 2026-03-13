import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { taskRouter } from "./modules/tasks/task.routes.js";
import { swaggerSpec } from "./docs/swagger.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/error.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => res.json({ message: "Task API is running" }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/tasks", taskRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
