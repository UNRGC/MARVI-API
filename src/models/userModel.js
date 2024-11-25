const client = require("../config/db");

// Función para obtener todos los usuarios
const getAllUsers = async () => {
    const res = await client.query("SELECT * FROM users");
    return res.rows;
};

// Función para crear un nuevo usuario
const createUser = async (name, email) => {
    const res = await client.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
    return res.rows[0];
};

module.exports = {
    getAllUsers,
    createUser,
};
