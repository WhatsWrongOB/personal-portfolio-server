import { Schema, model } from "mongoose";

interface Message {
  username: string;
  email: string;
  message: string;
}

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
