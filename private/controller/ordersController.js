import {config} from "dotenv";
import {
    deleteOrder, getOrder, getOrderDetails, getOrders, registerOrder, searchOrders, searchOrdersByClient, updateOrder
} from "../model/ordersModel.js";
import moment from "moment-timezone";

config();

// Configuración de la zona horaria y formato de fecha
const dateFormat = (date) => {
    const dateTZFechaPedido = moment.utc(date).tz(process.env.TIME_ZONE);
    return dateTZFechaPedido.format(process.env.DATE_FORMAT);
}

// Normaliza la fecha de entrada a un formato estándar
export const normalizeDate = (date) => {
    const format = ['DD/MM/YYYY'];
    let dateMoment = null;

    for (const formato of format) {
        dateMoment = moment.tz(date, formato, true, process.env.TIME_ZONE);
        if (dateMoment.isValid()) break;
    }

    if (!dateMoment || !dateMoment.isValid()) return date;
    return moment.utc(dateMoment).format('YYYY-MM-DD');
}

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

        response.rows.forEach((pedido) => {
            if (pedido.fecha_pedido) pedido.fecha_pedido = dateFormat(pedido.fecha_pedido);
            if (pedido.fecha_entrega) pedido.fecha_entrega = dateFormat(pedido.fecha_entrega);
        })

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
            if (pedido.fecha_pedido) pedido.fecha_pedido = dateFormat(pedido.fecha_pedido)
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
            if (pedido.fecha_pedido) pedido.fecha_pedido = dateFormat(pedido.fecha_pedido)
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({message: `Error al buscar pedidos, ${error.message}`});
    }
};

// Controlador para buscar pedidos de un cliente
export const searchOrdersByClientHandler = async (req, res) => {
    try {
        const {id_cliente, busqueda} = req.query;
        const data = {
            id_cliente: id_cliente,
            busqueda: normalizeDate(busqueda)
        };
        const response = await searchOrdersByClient(data);

        response.rows.forEach((pedido) => {
            if (pedido.fecha_pedido) pedido.fecha_pedido = dateFormat(pedido.fecha_pedido)
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({message: `Error al buscar pedidos de cliente, ${error.message}`});
    }
}