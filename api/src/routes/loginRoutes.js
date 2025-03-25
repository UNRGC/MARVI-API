import express from "express";
import { loginHandler, logoutHandler, forgotPasswordHandler, closeAllSessionsHandler } from "../controls/loginControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para iniciar sesión
router.post("/", loginHandler);
// Ruta para cerrar sesión
router.delete("/", logoutHandler);
// Ruta para recuperar la contraseña
router.post("/forgot", forgotPasswordHandler);
// Ruta para cerrar todas las sesiones
router.delete("/logout", closeAllSessionsHandler);

// Exporta el router
export default router;
