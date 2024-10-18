import { Schema, model } from "mongoose";
import { User } from "../types";



const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<User>("Users", userSchema);

export default User;
