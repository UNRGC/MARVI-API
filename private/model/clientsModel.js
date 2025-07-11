import {client} from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para registrar un cliente
export const registerClient = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 8) {
        throw new Error("Faltan datos para registrar un cliente");
    }

    // Insertar un nuevo cliente en la base de datos
    const response = await client.query("CALL registrar_cliente($1, $2, $3, $4, $5, $6, $7);", [data.codigo, data.nombre, data.primer_apellido, data.segundo_apellido, data.telefono, data.correo, data.contrasena]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar un cliente
export const updateClient = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 9) {
        throw new Error("Faltan datos para actualizar un cliente");
    }

    const hash = await bcrypt.hash(data.contrasena, 10);
    // Insertar un nuevo cliente en la base de datos
    const response = await client.query("CALL actualizar_cliente($1::INT, $2, $3, $4, $5, $6, $7, $8, $9, $10);", [data.id_cliente, data.codigo, data.nombre, data.primer_apellido, data.segundo_apellido, data.telefono, data.correo, hash, data.foto_src]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar un cliente
export const deleteClient = async (codigo) => {
    // Eliminar un cliente de la base de datos
    const response = await client.query("CALL eliminar_cliente($1);", [codigo]);

    // Agregar el mensaje de NOTICE a la respuesta
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener un cliente
export const getClient = async (codigo) => {
    // Obtener un cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_cliente($1);", [codigo]);
};

// Función para obtener los clientes filtrados
export const getClients = async (data) => {
    // Obtener un cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM filtrar_clientes($1, $2, $3::INT, $4::INT);", [data.columna_orden, data.orden, data.limit, data.offset]);
};

// Función para buscar en los clientes
export const searchClients = async (data) => {
    // Obtener clientes de la base de datos
    // Retornar
    return await client.query("SELECT * FROM buscar_clientes($1, $2::INT, $3::INT)", [data.busqueda, data.limit, data.offset]);
};
