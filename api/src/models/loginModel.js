import { client } from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para iniciar sesión
export const login = async (usuario) => {
    // Iniciar sesión en la base de datos
    const response = await client.query("SELECT * FROM iniciar_sesion($1);", [usuario]);

    // Retornar
    return response;
};

// Función para cambiar el estado de un usuario
export const changeState = async (data) => {
    // Validar que se hayan recibido los datos necesarios
    if (data.length < 2) {
        throw new Error("Faltan datos para cambiar el estado de un usuario");
    }

    // Insertar un nuevo usuario en la base de datos
    const response = await client.query("CALL cambiar_estado_usuario($1, $2);", [data.usuario, data.estado]);

    // Agregar el mensaje de NOTICE al response
    if (noticeMessage) response.notice = noticeMessage;

    // Retornar
    return response;
};

// Función para recuperar la contraseña
export const forgotPassword = async (correo) => {
    // Recuperar la contraseña en la base de datos
    const response = await client.query("SELECT * FROM recuperar_contrasena($1);", [correo]);

    // Retornar
    return response;
};

// Función para cerrar todas las sesiones
export const closeAllSessions = async () => {
    // Cerrar todas las sesiones de un usuario
    const response = await client.query("CALL cerrar_sesiones()");

    // Agregar el mensaje de NOTICE al response
    response.notice = "Se cerraron todas las sesiones";

    // Retornar
    return response;
};
