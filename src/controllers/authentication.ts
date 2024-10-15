import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.js";

/**
 * Register a new user.
 *
 * @function registerUser
 * @param {Request} req - Express request object containing user data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the newly created user or an error message
 */
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    res.status(201).json({ success: true, newUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Login a user.
 *
 * @function loginUser
 * @param {Request} req - Express request object containing user credentials
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a success message or an error message
 */
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
