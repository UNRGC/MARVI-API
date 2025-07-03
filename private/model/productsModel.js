import {client} from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para crear un producto
export const registerProduct = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 7) {
        throw new Error("Faltan datos para registrar un producto");
    }

    // Insertar un nuevo producto en la base de datos
    const response = await client.query("CALL registrar_producto($1, $2, $3::DECIMAL(10, 2), $4, $5, $6::BOOLEAN, $7);", [data.codigo, data.nombre, data.precio, data.unidad, data.descripcion, data.recordatorio, data.frecuencia]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar un producto
export const updateProduct = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 8) {
        throw new Error("Faltan datos para actualizar un producto");
    }

    // Insertar un nuevo producto en la base de datos
    const response = await client.query("CALL actualizar_producto($1::INT, $2, $3, $4::DECIMAL(10, 2), $5, $6, $7::BOOLEAN, $8);", [data.id_producto, data.codigo, data.nombre, data.precio, data.unidad, data.descripcion, data.recordatorio, data.frecuencia]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar un producto
export const deleteProduct = async (codigo) => {
    // Eliminar un producto de la base de datos
    const response = await client.query("CALL eliminar_producto($1);", [codigo]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener un producto
export const getProduct = async (codigo) => {
    // Obtener un producto de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_producto($1);", [codigo]);
};

// Función para obtener los productos filtrados
export const getProducts = async (data) => {
    // Obtener los productos de la base de datos
    // Retornar
    return await client.query("SELECT * FROM filtrar_productos($1, $2, $3::INT, $4::INT);", [data.columna_orden, data.orden, data.limit, data.offset]);
};

// Función para buscar productos
export const searchProducts = async (data) => {
    // Obtener los productos de la base de datos
    // Retornar
    return await client.query("SELECT * FROM buscar_productos($1, $2::INT, $3::INT);", [data.busqueda, data.limit, data.offset]);
};

// Función para crear la siguiente compra
export const nextPurchase = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para crear la próxima compra");
    }

    // Insertar la próxima compra en la base de datos
    const response = await client.query("CALL proxima_compra($1, $2);", [data.codigo, data.proxima_compra]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};
