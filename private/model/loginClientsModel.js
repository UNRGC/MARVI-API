import {client} from "../config/db.js";

let noticeMessage = null;

// Listener para capturar mensajes de RAISE NOTICE
client.on("notice", (msg) => {
    noticeMessage = msg.message;
});

// Función para iniciar sesión de un cliente
export const loginClient = async (correo) => {
    // Iniciar sesión en la base de datos
    // Retornar
    return await client.query("SELECT * FROM iniciar_sesion_clientes($1);", [correo]);
};

// Función para recuperar la contraseña de un cliente
export const resetPasswordClient = async (correo, nuevaContrasena) => {
    // Obtener el cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM recuperar_contrasena_cliente($1, $2);", [correo, nuevaContrasena]);
};
