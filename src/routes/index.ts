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
import isAuthenticated from "../middlewares/index.js";
import { upload } from "../config/index.js";

const router = Router();

/*________________ Authentication ______________*/
router.post("/register", registerUser);
router.post("/login", loginUser);

/*________________ Skills ______________*/
router.get("/skills", getSkills);
router.post("/skills", isAuthenticated, upload.single("icon"), createSkill);
router.patch(
  "/skills/:id",
  isAuthenticated,
  upload.single("icon"),
  updateSkill
);
router.delete("/skills/:id", isAuthenticated, deleteSkill);

/*________________ Projects ______________*/
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);
router.post(
  "/projects",
  isAuthenticated,
  upload.single("image"),
  createProject
);
router.patch(
  "/projects/:id",
  isAuthenticated,
  upload.single("image"),
  updateProject
);
router.delete("/projects/:id", isAuthenticated, deleteProject);

/*________________ Messages ______________*/
router.get("/message", getMessages);
router.post("/message", createMessage);
router.delete("/message/:id", isAuthenticated, deleteMessage);

export default router;
