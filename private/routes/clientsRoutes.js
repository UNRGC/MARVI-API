import express from "express";
import { deniedInjections } from "../utils/security.js";
import { registerClientHandler, updateClientHandler, deleteClientHandler, getClientHandler, getClientsHandler, getSearchClientsHandler } from "../controller/clientsController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para registrar clientes
router.post("/", deniedInjections, registerClientHandler);
// Ruta para actualizar clientes
router.put("/", deniedInjections, updateClientHandler);
// Ruta para eliminar clientes
router.delete("/:cliente", deniedInjections, deleteClientHandler);
// Ruta para obtener todos los clientes filtrados
router.get("/", deniedInjections, getClientsHandler);
// Ruta para buscar clientes
router.get("/search", deniedInjections, getSearchClientsHandler);
// Ruta para obtener clientes
router.get("/:cliente", deniedInjections, getClientHandler);

// Exporta el router
export default router;
