import { client } from "../config/db.js";
import bcrypt from "bcrypt";

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

// Función para verificar un correo electrónico de cliente
export const getClientEmail = async (correo) => {
    // Obtener un cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_correo_cliente($1);", [correo]);
};

// Función para verificar un código de cliente
export const getClientCode = async (codigo) => {
    // Obtener un cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM consultar_codigo_cliente($1);", [codigo]);
};

// Función para restablecer la contraseña de un cliente
export const resetPasswordClient = async (correo, contrasena) => {
    const hash = await bcrypt.hash(contrasena, 10);
    // Obtener el cliente de la base de datos
    // Retornar
    return await client.query("SELECT * FROM restablecer_contrasena_cliente($1, $2);", [correo, hash]);
};
