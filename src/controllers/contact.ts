import { NextFunction, Request, Response } from "express";
import Contact from "../models/contact.js"; 

/**
 * Get all messages from the mng db databae.
 * 
 * @function getMessages
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a list of messages or an error message
 */
const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Contact.find();
    if (!messages || messages.length === 0) {
      throw new Error("No messages found");
    }
    res.status(200).json({
      success: true,
      totalMessages: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new message in the database.
 * 
 * @function createMessage
 * @param {Request} req - Express request object containing the message data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns the created message or an error message
 */
const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, message } = req.body;

    if (!username || !email || !message) {
      throw new Error("All fields are required");
    }

     await Contact.create({
      username,
      email,
      message,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};


/**
 * Delete a message by ID from the database.
 * 
 * @function deleteMessage
 * @param {Request} req - Express request object containing the message ID
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a success message or an error message
 */
const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      throw new Error("Message not found");
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getMessages, createMessage, deleteMessage };
