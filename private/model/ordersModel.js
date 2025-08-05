import {client} from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para crear un pedido
export const registerOrder = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 5) {
        throw new Error("Faltan datos para registrar un pedido");
    }

    // Insertar un nuevo pedido en la base de datos
    const response = await client.query("CALL registrar_pedido($1::INT, $2::INT, $3::JSONB, $4, 5$);", [data.id_cliente, data.id_usuario, data.detalles, data.fecha_entrega, data.observaciones]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar el estado de un pedido
export const updateOrder = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para actualizar el estado de un pedido");
    }

    // Actualizar un pedido en la base de datos
    const response = await client.query("CALL actualizar_estado_pedido($1::INT, $2);", [data.id_pedido, data.estado]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
}

// Función para eliminar un pedido
export const deleteOrder = async (id_pedido) => {
    // Eliminar un pedido de la base de datos
    const response = await client.query("CALL eliminar_pedido($1::INT);", [id_pedido]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
}

// Función para obtener un pedido
export const getOrder = async (id_pedido) => {
    // Obtener un pedido de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_pedido($1::INT);", [id_pedido]);
}

// Función para obtener los detalles de un pedido
export const getOrderDetails = async (id_pedido) => {
    // Obtener los detalles de un pedido de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_detalles_pedido($1::INT);", [id_pedido]);
}

// Función para obtener los pedidos filtrados
export const getOrders = async (data) => {
    // Obtener los pedidos de la base de datos
    // Retornar
    return await client.query("SELECT * FROM filtrar_pedidos($1, $2, $3::INT, $4::INT);", [data.columna_orden, data.orden, data.limit, data.offset]);
}

// Función para buscar pedidos
export const searchOrders = async (data) => {
    // Obtener los pedidos de la base de datos
    // Retornar
    return await client.query("SELECT * FROM buscar_pedidos($1, $2::INT, $3::INT);", [data.busqueda, data.limit, data.offset]);
}

// Función para buscar pedidos de un cliente
export const searchOrdersByClient = async (data) => {
    // Obtener los pedidos de un cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM buscar_pedidos_cliente($1::INT, $2);", [data.id_cliente, data.busqueda]);
}