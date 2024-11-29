import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { validateFormat } from "../middlewares/credentialsMiddleware.js";
import { createAdminHandler, createUserHandler, updateUserHandler, getAllUsersHandler, getUserEmailHandler, getUserHandler, deleteUserHandler } from "../controls/userControl.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear un usuario administrador
router.get("/newAdmin", createAdminHandler);
// Ruta para crear un usuario
router.post("/", authenticateToken, validateFormat, createUserHandler);
// Ruta para actualizar un usuario
router.put("/:id_usuario", authenticateToken, validateFormat, updateUserHandler);
// Ruta para obtener un usuario
router.get("/:usuario", authenticateToken, getUserHandler);
// Ruta para obtener un usuario por correo
router.get("/email/:correo", authenticateToken, getUserEmailHandler);
// Ruta para obtener todos los usuarios
router.get("/", authenticateToken, getAllUsersHandler);
// Ruta para eliminar un usuario
router.delete("/:id_usuario", authenticateToken, deleteUserHandler);

// Exporta el router
export default router;
