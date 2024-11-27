import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createAdminHandler, createUserHandler, updateUserHandler, getAllUsersHandler, getUserEmailHandler, getUserHandler, deleteUserHandler } from "../controls/userControl.js";

const router = express.Router();

router.get("/admin", createAdminHandler);
router.post("/", authenticateToken, createUserHandler);
router.put("/:id_usuario", authenticateToken, updateUserHandler);
router.get("/:usuario", authenticateToken, getUserHandler);
router.get("/email/:correo", authenticateToken, getUserEmailHandler);
router.get("/", authenticateToken, getAllUsersHandler);
router.delete("/:id_usuario", authenticateToken, deleteUserHandler);

export default router;
