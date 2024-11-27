import { client } from "../config/db.js";

// Función para crear un log
export const createLog = async (usuario, accion) => {
    try {
        // Insertar un nuevo log en la base de datos
        const res = await client.query("INSERT INTO logs (accion, usuario) VALUES ($1, $2) RETURNING *", [accion, usuario]);
        // Retornar el log creado
        return res.rows[0];
    } catch (err) {
        // manejo de errores
        console.error("Error creando log:", err);
        throw err;
    }
};

// Función para obtener todos los logs
export const getLogs = async () => {
    try {
        // Obtener todos los logs de la base de datos
        const res = await client.query("SELECT * FROM logs");
        // Retornar los logs obtenidos
        return res.rows;
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo logs:", err);
        throw err;
    }
};
