import { NextFunction, Request, Response } from "express";
import Skill from "../models/skill.js";
import { cloudinary } from "../config/index.js";
import getPublicIdFromUrl from "../utils/index.js";
import { myCache } from "../index.js";
import { Skill as SkillType } from "../types/index.js";

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
    const cacheKey = "skills";

    const cachedSkills = myCache.get<SkillType[]>(cacheKey);

    if (cachedSkills) {
      console.log("Serving from cache");
      res.status(200).json({
        success: true,
        totalSkills: cachedSkills.length,
        skills: cachedSkills,
      });
      return;
    }

    const skills = await Skill.find();

    if (!skills || skills.length === 0) {
      throw new Error("No skills found");
    }

    myCache.set(cacheKey, skills);

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

    const icon = req.file?.path;

    if (!icon || !name || !description || !proficiency) {
      throw new Error("All fields are required");
    }

    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      throw new Error("Skill already exists");
    }

    await Skill.create({
      icon,
      name,
      description,
      proficiency,
    });

    const cacheKey = "skills";

    myCache.del(cacheKey);

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
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }

    let icon = skill.icon;

    if (req.file) {
      icon = req.file.path;

      const publicId = getPublicIdFromUrl(skill.icon);
      if (publicId) {
       
        await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);
       
      } else {
        throw new Error("Invalid image URL");
      }
    }

    await Skill.findByIdAndUpdate(
      id,
      { icon, name, description, proficiency },
      { new: true, runValidators: true }
    );

    const cacheKey = "skills";

    myCache.del(cacheKey);

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

    const publicId = getPublicIdFromUrl(deletedSkill.icon);

    if (!publicId) {
      throw new Error("Invalid image URL");
    }

    await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);

    const cacheKey = "skills";

    myCache.del(cacheKey);

    res
      .status(200)
      .json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getSkills, createSkill, updateSkill, deleteSkill };
