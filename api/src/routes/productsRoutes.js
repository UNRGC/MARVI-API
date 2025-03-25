import express from "express";
import { registerProductHandler, updateProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, searchProductsHandler, nextPurchaseHandler } from "../controls/productsControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear productos
router.post("/", registerProductHandler);
// Ruta para actualizar productos
router.put("/", updateProductHandler);
// Ruta para eliminar productos
router.delete("/:codigo", deleteProductHandler);
// Ruta para buscar productos
router.get("/search", searchProductsHandler);
// Ruta para obtener productos
router.get("/:codigo", getProductHandler);
// Ruta para obtener todos los productos filtrados
router.get("/", getProductsHandler);
// Ruta para crear la próxima compra
router.post("/nextPurchase", nextPurchaseHandler);

// Exporta el router
export default router;
