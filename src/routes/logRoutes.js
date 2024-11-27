import express from "express";
import { getLogsHandler } from "../controls/logControls.js";
import authenticateToken from "../middlewares/authMiddleware.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para obtener logs
router.get("/", authenticateToken, getLogsHandler);

// Exporta el router
export default router;
