import pkg from "pg";
const { Client } = pkg;
import { config } from "dotenv";
import { createDB, startDB, viewAllDB } from "../models/sqlModel.js";

// Cargar las variables de entorno desde el archivo .env
config();

export const clientInit = new Client({
    connectionString: process.env.DB_URI,
});

export const client = new Client({
    connectionString: `${process.env.DB_URI}/${process.env.DB_NAME}`,
});

// Conectar a la base de datos
export const connectDB = async () => {
    try {
        // Conectar a la base de datos
        await clientInit.connect();
        const databases = await viewAllDB();
        if (databases.find((db) => db.datname === process.env.DB_NAME)) {
            // Utilizar la base de datos especificada en la variable de entorno DB_NAME
            clientInit.end();
            client.connect();
            console.debug(`Conectado a la base de datos ${process.env.DB_NAME}`);
        } else {
            // Crear la base de datos si no existe
            await createDB();
            clientInit.end();
            client.connect();
            console.debug(`Conectado a la base de datos ${process.env.DB_NAME}`);
            await startDB();
        }
    } catch (error) {
        if (error.message.includes("client password must be a string")) {
            console.error("No existen credenciales para la base de datos en el apartado conexión");
            return;
        } else console.error("No se pudo establecer conexión con la base de datos, ", error.message);
    }
};
