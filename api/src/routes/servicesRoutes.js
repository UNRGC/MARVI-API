import express from "express";
import { registerServiceHandler, updateServiceHandler, deleteServiceHandler, getServiceHandler, getServicesHandler, searchServicesHandler } from "../controls/servicesControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear servicios
router.post("/", registerServiceHandler);
// Ruta para actualizar servicios
router.put("/", updateServiceHandler);
// Ruta para eliminar servicios
router.delete("/:codigo", deleteServiceHandler);
// Ruta para buscar servicios
router.get("/search", searchServicesHandler);
// Ruta para obtener servicios
router.get("/:codigo", getServiceHandler);
// Ruta para obtener todos los servicios filtrados
router.get("/", getServicesHandler);

// Exporta el router
export default router;
