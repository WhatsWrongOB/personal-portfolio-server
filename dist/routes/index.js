import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authentication.js";
import { getSkills, createSkill, updateSkill, deleteSkill, } from "../controllers/skill.js";
import { getProjects, createProject, updateProject, deleteProject, getProjectById, } from "../controllers/projects.js";
import { getMessages, createMessage, deleteMessage, } from "../controllers/contact.js";
import isAuthenticated from "../middlewares/index.js";
const router = Router();
/*________________ Authentication ______________*/
router.post("/register", registerUser);
router.post("/login", loginUser);
/*________________ Skills ______________*/
router.get("/skills", getSkills);
router.post("/skills", isAuthenticated, createSkill);
router.patch("/skills/:id", isAuthenticated, updateSkill);
router.delete("/skills/:id", isAuthenticated, deleteSkill);
/*________________ Projects ______________*/
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);
router.post("/projects", isAuthenticated, createProject);
router.patch("/projects/:id", isAuthenticated, updateProject);
router.delete("/projects/:id", isAuthenticated, deleteProject);
/*________________ Messages ______________*/
router.get("/message", getMessages);
router.post("/message", createMessage);
router.delete("/message/:id", isAuthenticated, deleteMessage);
export default router;
