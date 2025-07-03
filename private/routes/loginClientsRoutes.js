import express from "express";
import { deniedInjections } from "../utils/security.js";
import { loginClientHandler, resetPasswordClientEmailHandler, resetPasswordClientPageHandler, resetPasswordClientHandler } from "../controller/loginClientsController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para iniciar sesión
router.post("/clients", deniedInjections, loginClientHandler);
// Ruta para enviar un correo de restablecimiento de contraseña
router.post("/clients/reset/password", deniedInjections, resetPasswordClientEmailHandler);
// Ruta para la página de restablecimiento de contraseña
router.get("/clients/reset/password/:correo", deniedInjections, resetPasswordClientPageHandler);
// Ruta para restablecer la contraseña
router.put("/clients/reset/password", deniedInjections, resetPasswordClientHandler);

// Exporta el router
export default router;
