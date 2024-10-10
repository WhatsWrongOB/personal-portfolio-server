import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";
import express, { Request, NextFunction, Response, Application } from "express";


/* @** Intializing Express */

const app: Application = express();

/* @** Middlewares & Caching*/

dotenv.config();
app.use(express.json({ limit: "10mb" }));

/* @** CORS configuration */

const allowedOrigins: string[] = [
  "http://localhost:5500",
  "http://localhost:5173/",
  "https://obaidbro.netlify.app",
  "https://acdemicdashboard.netlify.app",
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


/* @** Routes */

app.get("/", async (req: Request, res: Response) => {
  res.send("Happy Coding 🚀");
});

app.use("/api", router);


/* @** Mongo connection & Server */

const PORT = process.env.PORT || 5000;

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

/* @** Error Middleware */

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

export default MyError;
