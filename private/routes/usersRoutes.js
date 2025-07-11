import express from "express";
import { deniedInjections } from "../util/security.js";
import { deleteUserHandler, registerUserHandler, updateUserHandler, getUserHandler, getUsersHandler, getActiveUsersHandler, getSearchUsersHandler, changeUserRoleHandler } from "../controller/usersController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear usuarios
router.post("/", deniedInjections, registerUserHandler);
// Ruta para actualizar usuarios
router.put("/", deniedInjections, updateUserHandler);
// Ruta para eliminar usuarios
router.delete("/:usuario", deniedInjections, deleteUserHandler);
// Ruta para obtener los usuarios activos
router.get("/active", deniedInjections, getActiveUsersHandler);
// Ruta para obtener todos los usuarios filtrados
router.get("/", deniedInjections, getUsersHandler);
// Ruta para buscar usuarios
router.get("/search", deniedInjections, getSearchUsersHandler);
// Ruta para obtener usuarios
router.get("/:usuario", deniedInjections, getUserHandler);
// Ruta para cambiar el rol de un usuario
router.put("/role", deniedInjections, changeUserRoleHandler);

// Exporta el router
export default router;
