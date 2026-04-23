import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    titleEn: { type: String },
    description: { type: String, required: true },
    descriptionEn: { type: String },
    images: [{ type: String }],
    status: { type: String, enum: ["completed", "in-progress"], default: "completed" },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
