import { Schema, model } from "mongoose";
import { Skill } from "../types/index.js";


const skillSchema = new Schema<Skill>({
  icon: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
  },
});

const Skill = model<Skill>("Skills", skillSchema);

export default Skill;
