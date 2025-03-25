import { client } from "../config/db.js";
import { encryptPassword } from "../utils/encryptPassword.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para crear un usuario
export const registerUser = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 8) {
        throw new Error("Faltan datos para registrar un usuario");
    }

    // Insertar un nuevo usuario en la base de datos
    const response = await client.query("CALL registrar_usuario($1, $2, $3, $4, $5, $6, $7);", [data.usuario, data.nombre, data.primer_apellido, data.segundo_apellido, data.correo, data.telefono, data.rol]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para actualizar un usuario
export const updateUser = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 9) {
        throw new Error("Faltan datos para actualizar un usuario");
    }

    // Insertar un nuevo usuario en la base de datos
    const response = await client.query("CALL actualizar_usuario($1::INT, $2, $3, $4, $5, $6, $7, $8, $9);", [data.id_usuario, data.usuario, data.nombre, data.primer_apellido, data.segundo_apellido, data.correo, data.telefono, await encryptPassword(data.contrasena), data.foto_src]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para eliminar un usuario
export const deleteUser = async (usuario) => {
    // Eliminar un usuario de la base de datos
    const response = await client.query("CALL eliminar_usuario($1);", [usuario]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para obtener un usuario
export const getUser = async (usuario) => {
    // Obtener un usuario de la base de datos
    const response = await client.query("SELECT * FROM consultar_usuario($1);", [usuario]);

    // Retornar
    return response;
};

// Función para obtener los usuarios filtrados
export const getUsers = async (data) => {
    // Obtener un usuario de la base de datos
    const response = await client.query("SELECT * FROM filtrar_usuarios($1, $2, $3::INT, $4::INT);", [data.columna_orden, data.orden, data.limit, data.offset]);

    // Retornar
    return response;
};

// función para obtener los usuarios activos
export const getActiveUsers = async () => {
    // Obtener un usuario de la base de datos
    const response = await client.query("SELECT * FROM vst_usuarios_logueados;");

    // Retornar
    return response;
};

// Función para buscar en los usuarios
export const searchUsers = async (data) => {
    // Obtener usuarios de la base de datos
    const response = await client.query("SELECT * FROM buscar_usuarios($1, $2::INT, $3::INT)", [data.busqueda, data.limit, data.offset]);

    // Retornar
    return response;
};

// Función para cambiar el rol de un usuario
export const changeUserRole = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para cambiar el rol de un usuario");
    }

    // Insertar un nuevo usuario en la base de datos
    const response = await client.query("CALL cambiar_rol_usuario($1::INT, $2);", [data.id_usuario, data.rol]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};
