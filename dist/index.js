import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import express from "express";
import multer from "multer";
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
    "http://localhost:5500",
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
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        return callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        console.log(file);
        return callback(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });
app.use("/api", router);
app.post("/", upload.single("image"), (req, res) => {
    console.log(req.file);
});
const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGODB as string)
//   .then(() => {
app.listen(PORT, () => {
    console.log(`Express running → On http://localhost:${PORT}  🚀`);
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 400;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
});
