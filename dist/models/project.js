import { Schema, model } from "mongoose";
const projectSchema = new Schema({
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
});
const Project = model("Projects", projectSchema);
export default Project;
