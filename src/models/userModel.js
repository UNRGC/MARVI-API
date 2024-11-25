const { client } = require("../config/db");

// Función para obtener todos los usuarios
const getAllUsers = async () => {
    try {
        const res = await client.query("SELECT * FROM usuarios");
        return res.rows; // Devuelve los usuarios encontrados
    } catch (err) {
        console.error("Error fetching users", err);
        throw err; // Lanza el error para manejarlo en el controlador
    }
};

// Función para crear un nuevo usuario
const createUser = async (usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena) => {
    try {
        const res = await client.query("INSERT INTO usuarios (usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena]);
        return res.rows[0]; // Devuelve el usuario creado
    } catch (err) {
        console.error("Error creating user", err);
        throw err;
    }
};

module.exports = {
    getAllUsers,
    createUser,
};
