import Project from "../models/project.js";
import path from "path";
import { uploadDirPath } from "../config/index.js";
import fs from "fs/promises";
// import { URL } from "../index.js";
const URL = "https://obaidbro.vercel.app";
/**
 * Get all projects from the database.
 *
 * @function getProjects
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a list of projects or an error message
 */
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find();
        if (!projects || projects.length === 0) {
            throw new Error("No projects found");
        }
        res.status(200).json({
            success: true,
            totalProjects: projects.length,
            projects,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get ID project from the database.
 *
 * @function getProjectById
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a list of projects or an error message
 */
const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            throw new Error("No projects found");
        }
        res.status(200).json({
            success: true,
            project,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Create a new project in the database.
 *
 * @function createProject
 * @param {Request} req - Express request object containing the project data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the created project or an error message
 */
const createProject = async (req, res, next) => {
    try {
        const { name, type, tech, description, link } = req.body;
        const file = req?.file;
        if (!file || !name || !type || !tech || !description || !link) {
            throw new Error("All fields are required");
        }
        const image = `${URL}/uploads/${file.originalname}`;
        await Project.create({
            image,
            name,
            type,
            tech,
            description,
            link,
        });
        res
            .status(201)
            .json({ success: true, message: "Project created successfully" });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update an existing project by ID.
 *
 * @function updateProject
 * @param {Request} req - Express request object containing the project ID and updated data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the updated project or an error message
 */
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, type, tech, description, link } = req.body;
        const file = req?.file;
        const project = await Project.findById(id);
        if (!project) {
            throw new Error("Project not found");
        }
        let image;
        if (file) {
            image = `${URL}/uploads/${file?.originalname}`;
            const imagePath = project.image;
            const fullImagePath = path.join(uploadDirPath, path.basename(imagePath));
            await fs.unlink(fullImagePath);
        }
        await Project.findByIdAndUpdate(id, { image, name, type, tech, description, link }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete a project by ID from the database.
 *
 * @function deleteProject
 * @param {Request} req - Express request object containing the project ID
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a success message or an error message
 */
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            throw new Error("Project not found");
        }
        const imagePath = deletedProject.image;
        const fullImagePath = path.join(uploadDirPath, path.basename(imagePath));
        await fs.unlink(fullImagePath);
        res
            .status(200)
            .json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
export { getProjects, createProject, updateProject, deleteProject, getProjectById, };
