import express from "express";
import { deniedInjections } from "../util/security.js";
import { loginHandler, logoutHandler, forgotPasswordHandler, closeAllSessionsHandler } from "../controller/loginUsersController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para iniciar sesión
router.post("/", deniedInjections, loginHandler);
// Ruta para cerrar sesión
router.delete("/", deniedInjections, logoutHandler);
// Ruta para recuperar la contraseña
router.post("/forgot", deniedInjections, forgotPasswordHandler);
// Ruta para cerrar todas las sesiones
router.delete("/logout", deniedInjections, closeAllSessionsHandler);

// Exporta el router
export default router;
