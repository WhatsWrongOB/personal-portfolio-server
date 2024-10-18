import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/index.js";
import express, { Request, NextFunction, Response, Application } from "express";
import { cloudinary, upload } from "./config/index.js";

const app: Application = express();
app.use(express.json());

const allowedOrigins: string[] = [
  process.env.DASHBOARD_URL as string,
  process.env.CLIENT_URL as string,
  process.env.DEVELOPMENT_URL as string,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string, 
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

app.get("/", async (req: Request, res: Response) => {
  res.send("Happy Coding 🚀");
});

app.use("/api", router);


const PORT = Number(process.env.PORT) || 5000;

mongoose
  .connect(process.env.MONGODB as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express running → On http://localhost:${PORT}  🚀`);
    });
  })
  .catch((err: Error) => {
    console.log("Error connecting to MongoDB:", err.message);
  });

interface MyError extends Error {
  statusCode?: number;
  message: string;
}

app.use((err: MyError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 400;
  const message = err.message || "Internal Server Error";
 
  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;
