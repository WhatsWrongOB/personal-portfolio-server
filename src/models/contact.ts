import { Schema, model } from "mongoose";
import { Message } from "../types";



const contactSchema = new Schema<Message>({
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

const Contact = model<Message>("Messages", contactSchema);

export default Contact;
