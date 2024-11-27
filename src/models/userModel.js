import { client } from "../config/db.js";

// Función para crear un usuario
export const createUser = async (usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol) => {
    try {
        // Insertar un nuevo usuario en la base de datos
        const res = await client.query("INSERT INTO usuarios (usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol]);
        // Retornar el usuario creado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error creando usuario:", err);
        throw err;
    }
};

// Función para obtener un usuario por id
export const updateUser = async (id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol) => {
    try {
        // Actualizar un usuario en la base de datos
        const res = await client.query("UPDATE usuarios SET usuario = $2, nombre = $3, primer_apellido = $4, segundo_apellido = $5, correo = $6, telefono = $7, contrasena = $8, rol = $9 WHERE id_usuario = $1 RETURNING *", [id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol]);
        // Retornar el usuario actualizado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error actualizando usuario:", err);
        throw err;
    }
};

// Función para obtener un usuario por id
export const getUser = async (usuario) => {
    try {
        // Obtener un usuario de la base de datos
        const res = await client.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
        // Retornar el usuario obtenido
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuario por usuario:", err);
        throw err;
    }
};

// Función para obtener un usuario por id
export const getUserEmail = async (correo) => {
    try {
        // Obtener un usuario de la base de datos
        const res = await client.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        // Retornar el usuario obtenido
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuario por correo:", err);
        throw err;
    }
};

// Función para obtener un usuario por id
export const getAllUsers = async () => {
    try {
        // Obtener un usuario de la base de datos
        const res = await client.query("SELECT * FROM usuarios");
        // Retornar el usuario obtenido
        return res.rows;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};

// Función para obtener un usuario por id
export const deleteUser = async (id_usuario) => {
    try {
        // Eliminar un usuario de la base de datos
        const res = await client.query("DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *", [id_usuario]);
        // Retornar el usuario eliminado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error eliminando usuario:", err);
        throw err;
    }
};
