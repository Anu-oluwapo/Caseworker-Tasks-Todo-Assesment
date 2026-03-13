import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: { type: String, required: false, trim: true, maxlength: 2000 },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    dueAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", TaskSchema);
