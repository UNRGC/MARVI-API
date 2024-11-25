import { client } from "../config/db.js";

export const createUser = async (usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena) => {
    try {
        const res = await client.query("INSERT INTO usuarios (usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena]);
        return res.rows[0];
    } catch (err) {
        console.error("Error creando usuario:", err);
        throw err;
    }
};

export const updateUser = async (idUsuario, usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena) => {
    try {
        const res = await client.query("UPDATE usuarios SET usuario = $2, nombre = $3, apellidoPaterno = $4, apellidoMaterno = $5, correo = $6, telefono = $7, contrasena = $8 WHERE idUsuario = $1 RETURNING *", [idUsuario, usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena]);
        return res.rows[0];
    } catch (err) {
        console.error("Error actualizando usuario:", err);
        throw err;
    }
};

export const getUser = async (usuario) => {
    try {
        const res = await client.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
        return res.rows[0];
    } catch (err) {
        console.error("Error obteniendo usuario por usuario:", err);
        throw err;
    }
};

export const getUserEmail = async (correo) => {
    try {
        const res = await client.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        return res.rows[0];
    } catch (err) {
        console.error("Error obteniendo usuario por correo:", err);
        throw err;
    }
};

export const getAllUsers = async () => {
    try {
        const res = await client.query("SELECT * FROM usuarios");
        return res.rows;
    } catch (err) {
        console.error("Error obteniendo usuarios:", err);
        throw err;
    }
};
