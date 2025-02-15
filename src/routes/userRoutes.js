import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { validateFormat } from "../middlewares/credentialsMiddleware.js";
import { createAdminHandler, createUserHandler, updateUserHandler, getAllUsersHandler, getUserEmailHandler, getUserHandler, deleteUserHandler, getUsersOrderHandler, updateUserStatusHandler } from "../controls/userControl.js";
import { getUsersSearch } from "../models/userModel.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear un usuario administrador
router.get("/newAdmin", createAdminHandler);
// Ruta para obtener un usuario
router.get("/:usuario", authenticateToken, getUserHandler);
// Ruta para obtener un usuario por correo
router.get("/email/:correo", getUserEmailHandler);
// Ruta para obtener el número de usuarios
router.get("/", getAllUsersHandler);
// Ruta para crear un usuario
router.post("/", authenticateToken, validateFormat, createUserHandler);
// Ruta para obtener todos los usuarios con ordenamiento
router.post("/order", authenticateToken, getUsersOrderHandler);
// Ruta para obtener usuarios por busqueda
router.post("/search", authenticateToken, getUsersSearch);
// Ruta para actualizar el estado de un usuario
router.put("/status", authenticateToken, updateUserStatusHandler);
// Ruta para actualizar un usuario
router.put("/:id_usuario", authenticateToken, validateFormat, updateUserHandler);
// Ruta para eliminar un usuario
router.delete("/:usuario", authenticateToken, deleteUserHandler);

// Exporta el router
export default router;
