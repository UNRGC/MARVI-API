import express from "express";
import { deniedInjections } from "../util/security.js";
import { registerServiceHandler, updateServiceHandler, deleteServiceHandler, getServiceHandler, getServicesHandler, searchServicesHandler } from "../controller/servicesController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear servicios
router.post("/", deniedInjections, registerServiceHandler);
// Ruta para actualizar servicios
router.put("/", deniedInjections, updateServiceHandler);
// Ruta para eliminar servicios
router.delete("/:codigo", deniedInjections, deleteServiceHandler);
// Ruta para buscar servicios
router.get("/search", deniedInjections, searchServicesHandler);
// Ruta para obtener servicios
router.get("/:codigo", deniedInjections, getServiceHandler);
// Ruta para obtener todos los servicios filtrados
router.get("/", deniedInjections, getServicesHandler);

// Exporta el router
export default router;
