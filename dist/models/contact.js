import { Schema, model } from "mongoose";
const contactSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
const Contact = model("Messages", contactSchema);
export default Contact;
