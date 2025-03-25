import express from "express";
import { deleteUserHandler, registerUserHandler, updateUserHandler, getUserHandler, getUsersHandler, getActiveUsersHandler, getSearchUsersHandler, changeUserRoleHandler } from "../controls/usersControl.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear usuarios
router.post("/", registerUserHandler);
// Ruta para actualizar usuarios
router.put("/", updateUserHandler);
// Ruta para eliminar usuarios
router.delete("/:usuario", deleteUserHandler);
// Ruta para obtener los usuarios activos
router.get("/active", getActiveUsersHandler);
// Ruta para obtener todos los usuarios filtrados
router.get("/", getUsersHandler);
// Ruta para buscar usuarios
router.get("/search", getSearchUsersHandler);
// Ruta para obtener usuarios
router.get("/:usuario", getUserHandler);
// Ruta para cambiar el rol de un usuario
router.put("/role", changeUserRoleHandler);

// Exporta el router
export default router;
