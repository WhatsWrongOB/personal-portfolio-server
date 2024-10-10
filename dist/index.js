import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";
import express from "express";
import Project from "./models/project.js";
/* @** Intializing Express */
const app = express();
/* @** Middlewares & Caching*/
dotenv.config();
app.use(express.json({ limit: "10mb" }));
/* @** CORS configuration */
const allowedOrigins = [
    "http://localhost:5500",
    "http://localhost:5173",
    "https://obaidbro.netlify.app",
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
const portfolioData = [
    {
        name: "⚙️ Express App Generator",
        image: "./assets/images/project-9.png",
        link: "https://github.com/WhatsWrongOB/express-app-generator",
        description: "🚀 npx create-ob-app is a powerful CLI tool that simplifies the process of generating a fully functional Express.js application. It supports various configurations, enabling developers to tailor their setup according to specific project requirements. With options for middleware, and environmental configurations, this tool saves significant time and effort.",
        tech: "JavaScript, Node.js",
        type: "CLI",
    },
    {
        name: "🛒 E-commerce Platform",
        image: "./assets/images/project-1.jpg",
        link: "https://github.com/WhatsWrongOB/mern-ecommerce",
        description: "🌐 Developed a full-featured e-commerce platform using the MERN stack. This platform supports comprehensive product management, from browsing and filtering products to purchasing and order tracking. The user experience is enhanced by dynamic product recommendations, an intuitive shopping cart system, and secure payment gateways",
        tech: "⚛️ React, Node.js, Express, MongoDB",
        type: "Web Development",
    },
    {
        name: "📚 LMS Backend",
        image: "./assets/images/project-2.png",
        link: "https://github.com/WhatsWrongOB/lms-server-typescript",
        description: "🔧 Built the backend of a Learning Management System (LMS) using modern technologies such as Node.js, Express, and MongoDB. The system enables users to enroll in courses. The backend architecture ensures robust authentication, course management, and real-time notifications. Admins can manage courses, users, and assignments",
        tech: "Node.js, Express, MongoDB",
        type: "Web Development",
    },
    {
        name: "🌍 Travel Website",
        image: "./assets/images/project-3.jpg",
        link: "https://github.com/WhatsWrongOB/travel-ui-html",
        description: "🏖️ Created a sleek, visually appealing travel website using HTML and CSS. The site showcases destinations with a modern layout, featuring dynamic image sliders, interactive navigation menus, and well-structured content. The design is fully responsive, ensuring optimal performance across all devices. The site is ideal for promoting travel packages",
        tech: "HTML, CSS",
        type: "Web Development",
    },
    {
        name: "🔒 Authentication",
        image: "./assets/images/project-4.png",
        link: "https://github.com/WhatsWrongOB/mern-authentication",
        description: "🔐 This application allows users to register, log in, and manage their sessions through a secure, token-based authentication system using JWT. The backend is protected with role-based access control, ensuring sensitive data and endpoints are accessible only to authorized users. This project also supports features such as password recovery, email verification",
        tech: "⚛️ React, Node.js, Express, MongoDB",
        type: "Web Development",
    },
    {
        name: "🛍️ Shopery - E-commerce",
        image: "./assets/images/project-5.png",
        link: "https://github.com/WhatsWrongOB/Weather-app",
        description: "🛒 Shopery is an advanced e-commerce website built with Next.js. It features dynamic product listings fetched from an external API. Users can explore various categories, filter products by price, rating, or category, and navigate through paginated results. The platform is designed to handle large datasets efficiently, making it ideal for stores with vast inventories",
        tech: "JavaScript, Next.js",
        type: "Web Development",
    },
    {
        name: "📸 Memories App",
        image: "./assets/images/project-6.png",
        link: "https://github.com/WhatsWrongOB/mern-memories",
        description: "💭 Memories is a personal diary-like application where users can create, store, and manage their memories. Built using the MERN stack, the app allows users to post entries with specific dates, delete old memories, and track their journey over time. It also features a modern, minimalist UI that makes it easy for users to navigate and manage their memories. ",
        tech: "React, Node.js, Express, MongoDB",
        type: "Web Development",
    },
    {
        name: "💻 Learnify - Project Hub",
        image: "./assets/images/project-7.png",
        link: "https://github.com/WhatsWrongOB/Web_Projects",
        description: "📚 Learnify is a comprehensive platform offering a collection of beginner-friendly projects, designed to help new developers enhance their skills through hands-on experience. The platform includes an intuitive admin panel for managing content, tracking user progress, and curating project categories. With a user-friendly interface and clean codebase,",
        tech: "React, Node.js, Express, MongoDB",
        type: "Web Development",
    },
    {
        name: "📚 LMS Frontend",
        image: "./assets/images/project-8.jpg",
        link: "https://github.com/WhatsWrongOB/lms-client-typescript",
        description: "🎓 Developed the frontend of a Learning Management System (LMS) using React and TypeScript. The user interface provides a seamless experience for students to browse and enroll in courses, take quizzes, and track their progress. The system is designed with scalability in mind, ensuring that the UI remains responsive and intuitive even as the user base grows. ",
        tech: "React, TypeScript",
        type: "Web Development",
    },
];
/* @** Routes */
app.get("/", async (req, res) => {
    res.send("Happy Coding 🚀");
    await Project.insertMany(portfolioData);
    console.log("Created");
});
app.use("/api", router);
/* @** Mongo connection & Server */
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
