// Crea nueva instancia de un router de express
import {deniedInjections} from "../util/security.js";
import {
    deleteOrderHandler,
    getOrderDetailsHandler,
    getOrderHandler,
    getOrdersHandler,
    registerOrderHandler,
    searchOrdersByClientHandler,
    searchOrdersHandler,
    updateOrderHandler
} from "../controller/ordersController.js";
import express from "express";

const router = express.Router();

// Ruta para crear pedidos
router.post("/", deniedInjections, registerOrderHandler);
// Ruta para actualizar pedidos
router.put("/", deniedInjections, updateOrderHandler);
// Ruta para eliminar pedidos
router.delete("/:id_pedido", deniedInjections, deleteOrderHandler);
// Ruta para buscar pedidos
router.get("/search", deniedInjections, searchOrdersHandler);
// Ruta para buscar pedidos de un cliente
router.get("/client/search", deniedInjections, searchOrdersByClientHandler);
// Ruta para obtener pedidos
router.get("/:id_pedido", deniedInjections, getOrderHandler);
// Ruta para obtener detalles de un pedido
router.get("/details/:id_pedido", deniedInjections, getOrderDetailsHandler);
// Ruta para obtener todos los pedidos filtrados
router.get("/", deniedInjections, getOrdersHandler);

// Exporta el router
export default router;