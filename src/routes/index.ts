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
} from "../controllers/projects.js";

import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../controllers/contact.js";

const router = Router();

/*________________ Authentication ______________*/
router.post("/register", registerUser);
router.post("/login", loginUser);

/*________________ Skills ______________*/
router.get("/skills", getSkills);
router.post("/skills", createSkill);
router.patch("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

/*________________ Projects ______________*/
router.get("/projects", getProjects);
router.post("/projects", createProject);
router.patch("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

/*________________ Messages ______________*/
router.get("/message", getMessages);
router.post("/message", createMessage);
router.delete("/message/:id", deleteMessage);

export default router;
