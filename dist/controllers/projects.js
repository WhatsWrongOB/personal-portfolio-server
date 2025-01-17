import Project from "../models/project.js";
import { cloudinary } from "../config/index.js";
import getPublicIdFromUrl from "../utils/index.js";
import { myCache } from "../index.js";
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
        const cacheKey = "projects";
        const cachedProjects = myCache.get(cacheKey);
        if (cachedProjects) {
            console.log("Serving from cache");
            res.status(200).json({
                success: true,
                totalProjects: cachedProjects.length,
                projects: cachedProjects,
            });
            return;
        }
        const projects = await Project.find();
        if (!projects || projects.length === 0) {
            throw new Error("No projects found");
        }
        myCache.set(cacheKey, projects);
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
        const image = req.file?.path;
        if (!image || !name || !type || !tech || !description || !link) {
            throw new Error("All fields are required");
        }
        await Project.create({
            image,
            name,
            type,
            tech,
            description,
            link,
        });
        const cacheKey = "projects";
        myCache.del(cacheKey);
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
        // Find the existing project
        const project = await Project.findById(id);
        if (!project) {
            throw new Error("Project not found");
        }
        let image = project.image;
        if (req.file) {
            image = req.file.path;
            const publicId = getPublicIdFromUrl(project.image);
            if (publicId) {
                await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);
            }
            else {
                throw new Error("Invalid image URL");
            }
        }
        await Project.findByIdAndUpdate(id, { image, name, type, tech, description, link }, { new: true, runValidators: true });
        const cacheKey = "projects";
        myCache.del(cacheKey);
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
        const publicId = getPublicIdFromUrl(deletedProject.image);
        if (!publicId) {
            throw new Error("Invalid image URL");
        }
        await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);
        const cacheKey = "projects";
        myCache.del(cacheKey);
        res
            .status(200)
            .json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
export { getProjects, createProject, updateProject, deleteProject, getProjectById, };
