import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
    process.env.DEVELOPMENT_URL,
    process.env.CLIENT_URL,
    process.env.DASHBOARD_URL,
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
app.use("/api", router);
app.use("/uploads", express.static(`${__dirname}/uploads`));
const PORT = process.env.PORT || 5000;
// const URL =
//   process.env.DOMAIN?.trim() === "DEVELOPMENT"
//     ? `http://localhost:${PORT}`
//     : process.env.SERVER_URL;
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
// export { URL };
