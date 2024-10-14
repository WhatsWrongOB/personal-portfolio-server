import { Schema, model } from "mongoose";
const skillSchema = new Schema({
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
const Skill = model("Skills", skillSchema);
export default Skill;
