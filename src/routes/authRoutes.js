import express from "express";
import { login, refreshAccessToken } from "../controls/authControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para iniciar sesión
router.post("/", login);
// Ruta para refrescar token
router.post("/refresh", refreshAccessToken);

// Exporta el router
export default router;
