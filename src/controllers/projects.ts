import { NextFunction, Request, Response } from "express";
import Project from "../models/project.js";


/**
 * Get all projects from the database.
 * 
 * @function getProjects
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a list of projects or an error message
 */
const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  } catch (error) {
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
const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params
    const project = await Project.findById(id);
    if (!project) {
      throw new Error("No projects found");
    }
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
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
const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { image, name, type, tech, description, link } = req.body;

    if (!image || !name || !type || !tech || !description || !link) {
      throw new Error("All fields are required");
    }

    const newProject = await Project.create({
      image,
      name,
      type,
      tech,
      description,
      link,
    });

    res.status(201).json({ success: true, message: "Project created successfully"  });
  } catch (error) {
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
const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { image, name, type, tech, description, link } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { image, name, type, tech, description, link },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    res.status(200).json({ success: true, message: "Project updated successfully"  });
  } catch (error) {
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
const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      throw new Error("Project not found");
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export { getProjects, createProject, updateProject, deleteProject, getProjectById };
