import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import router from "./routes/index.js";
import { cloudinary } from "./config/index.js";
import express from "express";
const app = express();
const myCache = new NodeCache({ stdTTL: 3600 });
app.use(express.json());
const allowedOrigins = [
    process.env.DASHBOARD_URL,
    process.env.CLIENT_URL,
    process.env.DEVELOPMENT_URL,
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
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/", async (req, res) => {
    res.send("Happy Coding 🚀");
});
app.use("/api", router);
const PORT = Number(process.env.PORT) || 5000;
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
export default app;
export { myCache };
