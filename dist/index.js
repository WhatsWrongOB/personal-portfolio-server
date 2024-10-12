import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";
import express from "express";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
    "http://localhost:5500",
    "http://localhost:5173",
    "https://obaidbro.netlify.app",
    "https://acdemicdashboard.netlify.app",
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
}));
app.get("/", async (req, res) => {
    res.send("Happy Coding 🚀");
});
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use("/api", router);
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGODB)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Express running → On http://localhost:${PORT}  🚀`);
    });
})
    .catch((err) => {
    console.log("Error connecting to MongoDB:", err.message);
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 400;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
});
