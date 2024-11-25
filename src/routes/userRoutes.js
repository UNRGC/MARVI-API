import express from "express";
import { createUserHandler, updateUserHandler, getAllUsersHandler, getUserEmailHandler, getUserHandler } from "../controls/userControl.js";

const router = express.Router();

router.post("/", createUserHandler);
router.put("/:idUsuario", updateUserHandler);
router.get("/:usuario", getUserHandler);
router.get("/email/:correo", getUserEmailHandler);
router.get("/", getAllUsersHandler);

export default router;
