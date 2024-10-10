import ProjectModel from "../models/project.js";
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
        const projects = await ProjectModel.find();
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
        const { image, name, type, tech, description, link } = req.body;
        if (!image || !name || !type || !tech || !description || !link) {
            throw new Error("All fields are required");
        }
        const newProject = await ProjectModel.create({
            image,
            name,
            type,
            tech,
            description,
            link,
        });
        res.status(201).json({ success: true, newProject });
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
        const { image, name, type, tech, description, link } = req.body;
        const updatedProject = await ProjectModel.findByIdAndUpdate(id, { image, name, type, tech, description, link }, { new: true, runValidators: true });
        if (!updatedProject) {
            throw new Error("Project not found");
        }
        res.status(200).json({ success: true, updatedProject });
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
        const deletedProject = await ProjectModel.findByIdAndDelete(id);
        if (!deletedProject) {
            throw new Error("Project not found");
        }
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
export { getProjects, createProject, updateProject, deleteProject };
