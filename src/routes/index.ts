import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authentication.js";

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.js";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "../controllers/projects.js";

import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../controllers/contact.js";
import upload from "../config/index.js";

const router = Router();

/*________________ Authentication ______________*/
router.post("/register", registerUser);
router.post("/login", loginUser);

/*________________ Skills ______________*/
router.get("/skills", getSkills);
router.post("/skills",upload.single("icon"), createSkill);
router.patch("/skills/:id",upload.single("icon"), updateSkill);
router.delete("/skills/:id", deleteSkill);

/*________________ Projects ______________*/
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);
router.post("/projects", upload.single("image"), createProject);
router.patch("/projects/:id", upload.single("image"), updateProject);
router.delete("/projects/:id", deleteProject);

/*________________ Messages ______________*/
router.get("/message", getMessages);
router.post("/message", createMessage);
router.delete("/message/:id", deleteMessage);

export default router;
