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

// Función para actualizar un usuario
export const updateUser = async (id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol, foto_src) => {
    try {
        // Actualizar un usuario en la base de datos
        const res = await client.query("UPDATE usuarios SET usuario = $2, nombre = $3, primer_apellido = $4, segundo_apellido = $5, correo = $6, telefono = $7, contrasena = $8, rol = $9, foto_src = $10 WHERE id_usuario = $1 RETURNING *", [id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol, foto_src]);
        // Retornar el usuario actualizado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error actualizando usuario:", err);
        throw err;
    }
};

// Función para eliminar un usuario
export const deleteUser = async (usuario) => {
    try {
        // Eliminar un usuario de la base de datos
        const res = await client.query("DELETE FROM usuarios WHERE usuario = $1 RETURNING *", [usuario]);
        // Retornar el usuario eliminado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error eliminando usuario:", err);
        throw err;
    }
};

// Función para obtener un usuario por nombre de usuario
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

// Función para obtener un usuario por correo electrónico
export const getUserEmail = async (correo) => {
    try {
        // Obtener un usuario de la base de datos
        const res = await client.query("SELECT usuario, correo FROM usuarios WHERE correo = $1", [correo]);
        // Retornar el usuario obtenido
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo correo:", err);
        throw err;
    }
};

// Función para obtener el número de usuarios
export const getAllUsers = async () => {
    try {
        // Obtener el número de usuarios de la base de datos
        const res = await client.query("SELECT COUNT(*) FROM usuarios");
        // Retornar el número de usuarios obtenidos
        return res.rows[0].count;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};

// Función para obtener los usuarios y ordenarlos por columna y dirección
export const getUsersOrder = async (columna, orden, limite, salto) => {
    try {
        // Obtener todos los usuarios de la base de datos con paginación
        const res = await client.query(`SELECT * FROM usuarios ORDER BY ${columna} ${orden} LIMIT $1 OFFSET $2`, [limite, salto]);
        // Retornar los usuarios obtenidos
        return res.rows;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};

// Función para obetener el usuario con un texto de búsqueda
export const getUsersSearch = async (busqueda, columna, orden, limite, salto) => {
    try {
        // Obtener todos los usuarios de la base de datos con paginación y búsqueda
        const res = await client.query(`SELECT * FROM usuarios WHERE usuario ILIKE $1 OR nombre ILIKE $1 OR primer_apellido ILIKE $1 OR segundo_apellido ILIKE $1 OR correo ILIKE $1 OR telefono ILIKE $1 ORDER BY ${columna} ${orden} LIMIT $2 OFFSET $3`, [`%${busqueda}%`, limite, salto]);
        // Retornar los usuarios obtenidos
        return res.rows;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};

// Función para obtener la vista de los datos unicos de usuarios
export const getUsersUnique = async () => {
    try {
        // Obtener todos los usuarios de la base de datos
        const res = await client.query("SELECT * FROM vst_usuarios");
        // Retornar los usuarios obtenidos
        return res.rows;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};

// Función para actualizar el estado de un usuario
export const setUserStatus = async (id_usuario, estado) => {
    try {
        // Actualizar un usuario en la base de datos
        const res = await client.query("UPDATE usuarios SET estado = $2 WHERE id_usuario = $1 RETURNING *", [id_usuario, estado]);
        // Retornar el usuario actualizado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error actualizando usuario:", err);
        throw err;
    }
};
