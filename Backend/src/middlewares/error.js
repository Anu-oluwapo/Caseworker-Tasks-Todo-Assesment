import mongoose from "mongoose";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ message: err.message, details: err.details });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .json({ message: "Validation failed", details: err.errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
