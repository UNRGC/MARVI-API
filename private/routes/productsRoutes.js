import express from "express";
import { deniedInjections } from "../util/security.js";
import { registerProductHandler, updateProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, searchProductsHandler, nextPurchaseHandler } from "../controller/productsController.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear productos
router.post("/", deniedInjections, registerProductHandler);
// Ruta para actualizar productos
router.put("/", deniedInjections, updateProductHandler);
// Ruta para eliminar productos
router.delete("/:codigo", deniedInjections, deleteProductHandler);
// Ruta para buscar productos
router.get("/search", deniedInjections, searchProductsHandler);
// Ruta para obtener productos
router.get("/:codigo", deniedInjections, getProductHandler);
// Ruta para obtener todos los productos filtrados
router.get("/", deniedInjections, getProductsHandler);
// Ruta para crear la próxima compra
router.post("/nextPurchase", deniedInjections, nextPurchaseHandler);

// Exporta el router
export default router;
