import { NextFunction, Request, Response } from "express";
import Skill from "../models/skill.js";
import { uploadDirPath } from "../config/index.js";
import path from "path";
import fs from "fs/promises";
import { imageUrl } from "../index.js";


// const imageUrl = "https://obaidbro.vercel.app";


/**
 * Get all skills from the database.
 *
 * @function getSkills
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a list of skills or an error message
 */

const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skills = await Skill.find();
    if (!skills || skills.length === 0) {
      throw new Error("No skills found");
    }
    res.status(200).json({
      success: true,
      totalSkills: skills.length,
      skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new skill in the database.
 *
 * @function createSkill
 * @param {Request} req - Express request object containing the skill data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the created skill or an error message
 */
const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, proficiency } = req.body;
    const file = req.file;

    if (!file) {
      throw new Error("Icon file is required");
    }

    if (!name || !description || !proficiency) {
      throw new Error("All fields are required");
    }

    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      throw new Error("Skill already exists");
    }

    const icon = `${imageUrl}/uploads/${file.originalname}`;

    await Skill.create({
      icon,
      name,
      description,
      proficiency,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing skill by ID.
 *
 * @function updateSkill
 * @param {Request} req - Express request object containing the skill ID and updated data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the updated skill or an error message
 */
const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, proficiency } = req.body;
    const file = req?.file;

    // Find the existing skill
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }

    let icon;
    if (file) {
      icon = `${imageUrl}/uploads/${file?.originalname}`;

      const iconPath = skill.icon;

      const fullIconPath = path.join(uploadDirPath, path.basename(iconPath));

      await fs.unlink(fullIconPath);
    }

    await Skill.findByIdAndUpdate(
      id,
      { icon, name, description, proficiency },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a skill by ID from the database.
 *
 * @function deleteSkill
 * @param {Request} req - Express request object containing the skill ID
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a success message or an error message
 */
const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      throw new Error("Skill not found");
    }

    const iconPath = deletedSkill.icon;

    const fullIconPath = path.join(uploadDirPath, path.basename(iconPath));

    await fs.unlink(fullIconPath);

    res
      .status(200)
      .json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getSkills, createSkill, updateSkill, deleteSkill, imageUrl };
