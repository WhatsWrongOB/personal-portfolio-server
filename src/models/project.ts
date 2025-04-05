import { Schema, model } from "mongoose";
import { Project } from "../types/index.js";


const projectSchema = new Schema<Project>({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  tech: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
});

const Project = model<Project>("Projects", projectSchema);

export default Project;
