import { client } from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para crear un servicio
export const registerService = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 5) {
        throw new Error("Faltan datos para registrar un servicio");
    }

    // Insertar un nuevo servicio en la base de datos
    const response = await client.query("CALL registrar_servicio($1, $2, $3::DECIMAL(10, 2), $4, $5);", [data.codigo, data.nombre, data.precio, data.unidad, data.descripcion]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar un servicio
export const updateService = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 6) {
        throw new Error("Faltan datos para actualizar un servicio");
    }

    // Insertar un nuevo servicio en la base de datos
    const response = await client.query("CALL actualizar_servicio($1::INT, $2, $3, $4::DECIMAL(10, 2), $5, $6);", [data.id_servicio, data.codigo, data.nombre, data.precio, data.unidad, data.descripcion]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar un servicio
export const deleteService = async (codigo) => {
    // Eliminar un servicio de la base de datos
    const response = await client.query("CALL eliminar_servicio($1);", [codigo]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener un servicio
export const getService = async (codigo) => {
    // Obtener un servicio de la base de datos
    const response = await client.query("SELECT * FROM consultar_servicio($1);", [codigo]);

    // Retornar
    return response;
};

// Función para obtener los servicios filtrados
export const getServices = async (data) => {
    // Obtener los servicios de la base de datos
    const response = await client.query("SELECT * FROM filtrar_servicios($1, $2, $3::INT, $4::INT);", [data.columna_orden, data.orden, data.limit, data.offset]);

    // Retornar
    return response;
};

// Función para buscar servicios
export const searchServices = async (data) => {
    // Buscar servicios en la base de datos
    const response = await client.query("SELECT * FROM buscar_servicios($1, $2::INT, $3::INT);", [data.busqueda, data.limit, data.offset]);

    // Retornar
    return response;
};
