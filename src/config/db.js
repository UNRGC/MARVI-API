import pkg from "pg";
const { Client } = pkg;
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();

// Configuración de la conexión a la base de datos
const client = new Client({
    // Utilizar la variable de entorno DB_URI como cadena de conexión
    connectionString: process.env.DB_URI,
});

// Conectar a la base de datos
export const connectDB = async () => {
    try {
        // Conectar a la base de datos
        await client.connect();
    } catch (error) {
        // Manejo de errores
        console.error("Error al conectar a PostgreSQL:", error.message);
        throw error;
    }
};

// Exportar el cliente de la base de datos
export { client };
