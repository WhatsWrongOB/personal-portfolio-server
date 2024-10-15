import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unaurhorized access");
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
