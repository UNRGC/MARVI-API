import express from "express";
import { deniedInjections } from "../utils/security.js";
import { loginHandler, logoutHandler, forgotPasswordHandler, closeAllSessionsHandler } from "../controls/loginControls.js";

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
