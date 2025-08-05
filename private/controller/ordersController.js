import {config} from "dotenv";
import {
    deleteOrder, getOrder, getOrderDetails, getOrders, registerOrder, searchOrders, searchOrdersByClient, updateOrder
} from "../model/ordersModel.js";
import moment from "moment-timezone";

config();

// Controlador para crear un pedido
export const registerOrderHandler = async (req, res) => {
    try {
        const response = await registerOrder(req.body);
        res.status(201).json({message: response.notice});
    } catch (error) {
        res.status(500).json({message: `Error al registrar pedido, ${error.message}`});
    }
};

// Controlador para actualizar el estado de un pedido
export const updateOrderHandler = async (req, res) => {
    try {
        const response = await updateOrder(req.body);
        res.status(200).json({message: response.notice});
    } catch (error) {
        res.status(500).json({message: `Error al actualizar estado de pedido, ${error.message}`});
    }
};

// Controlador para eliminar un pedido
export const deleteOrderHandler = async (req, res) => {
    try {
        const response = await deleteOrder(req.params.id_pedido);
        res.status(200).json({message: response.notice});
    } catch (error) {
        res.status(500).json({message: `Error al eliminar pedido, ${error.message}`});
    }
};

// Controlador para obtener un pedido
export const getOrderHandler = async (req, res) => {
    try {
        const response = await getOrder(req.params.id_pedido);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({message: `Error al obtener pedido, ${error.message}`});
    }
}

// Controlador para obtener los detalles de un pedido
export const getOrderDetailsHandler = async (req, res) => {
    try {
        const response = await getOrderDetails(req.params.id_pedido);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({message: `Error al obtener detalles del pedido, ${error.message}`});
    }
};

// Controlador para obtener todos los pedidos filtrados
export const getOrdersHandler = async (req, res) => {
    try {
        const response = await getOrders(req.query);

        response.rows.forEach((pedido) => {
            if (pedido.fecha_pedido) {
                const dateTZFechaPedido = moment.utc(pedido.fecha_pedido).tz(process.env.TIME_ZONE);
                pedido.fecha_pedido = dateTZFechaPedido.format(process.env.DATE_FORMAT);
            }
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({message: `Error al obtener pedidos, ${error.message}`});
    }
};

// Controlador para buscar pedidos
export const searchOrdersHandler = async (req, res) => {
    try {
        const response = await searchOrders(req.query);

        response.rows.forEach((pedido) => {
            if (pedido.fecha_pedido) {
                const dateTZFechaPedido = moment.utc(pedido.fecha_pedido).tz(process.env.TIME_ZONE);
                pedido.fecha_pedido = dateTZFechaPedido.format(process.env.DATE_FORMAT);
            }
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({message: `Error al buscar pedidos, ${error.message}`});
    }
};

// Controlador para buscar pedidos de un cliente
export const searchOrdersByClientHandler = async (req, res) => {
    try {
        const response = await searchOrdersByClient(req.query);

        response.rows.forEach((pedido) => {
            if (pedido.fecha_pedido) {
                const dateTZFechaPedido = moment.utc(pedido.fecha_pedido).tz(process.env.TIME_ZONE);
                pedido.fecha_pedido = dateTZFechaPedido.format(process.env.DATE_FORMAT);
            }
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({message: `Error al buscar pedidos de cliente, ${error.message}`});
    }
}