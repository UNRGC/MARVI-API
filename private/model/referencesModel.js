import {client} from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para crear una unidad
export const registerUnit = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para registrar una unidad");
    }

    // Insertar una nueva unidad en la base de datos
    const response = await client.query("CALL agregar_unidad($1, $2);", [data.unidad, data.nombre]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar una unidad
export const updateUnit = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para actualizar una unidad");
    }

    // Insertar una nueva unidad en la base de datos
    const response = await client.query("CALL actualizar_unidad($1, $2);", [data.unidad, data.nombre]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar una unidad
export const deleteUnit = async (unidad) => {
    // Eliminar una unidad de la base de datos
    const response = await client.query("CALL eliminar_unidad($1);", [unidad]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener una unidad
export const getUnit = async (unidad) => {
    // Obtener una unidad de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_unidad($1);", [unidad]);
};

// Función para obtener las unidades
export const getUnits = async () => {
    // Obtener las unidades de la base de datos
    // Retornar
    return await client.query("SELECT * FROM vst_unidades;");
};

// Función para crear una frecuencia
export const registerFrequency = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 4) {
        throw new Error("Faltan datos para registrar una frecuencia de compra");
    }

    // Insertar una nueva frecuencia en la base de datos
    const response = await client.query("CALL agregar_frecuencia_compra($1, $2, $3::INT, $4);", [data.frecuencia, data.nombre, data.dias, data.descripcion]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar una frecuencia de compra
export const updateFrequency = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 4) {
        throw new Error("Faltan datos para actualizar una frecuencia de compra");
    }

    // Insertar una nueva frecuencia en la base de datos
    const response = await client.query("CALL actualizar_frecuencia_compra($1, $2, $3::INT, $4);", [data.frecuencia, data.nombre, data.dias, data.descripcion]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar una frecuencia de compra
export const deleteFrequency = async (frecuencia) => {
    // Eliminar una frecuencia de la base de datos
    const response = await client.query("CALL eliminar_frecuencia_compra($1);", [frecuencia]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener una frecuencia de compra
export const getFrequency = async (frecuencia) => {
    // Obtener una frecuencia de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_frecuencia_compra($1);", [frecuencia]);
};

// Función para obtener las frecuencias
export const getFrequencies = async () => {
    // Obtener las frecuencias de la base de datos
    // Retornar
    return await client.query("SELECT * FROM vst_frecuencia_compras;");
};
