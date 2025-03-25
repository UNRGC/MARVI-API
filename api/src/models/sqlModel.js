import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { clientInit, client } from "../config/db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

export const viewAllDB = async () => {
    try {
        const response = await clientInit.query("SELECT datname FROM pg_database;");
        return response.rows;
    } catch (error) {
        console.error("No se pudieron obtener las bases de datos,", error.message);
        throw error;
    }
};

export const createDB = async () => {
    console.debug(`Creando la base de datos ${process.env.DB_NAME}`);

    try {
        await clientInit.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.debug(`Base de datos ${process.env.DB_NAME} creada con éxito`);
    } catch (error) {
        console.error("No se pudo crear la base de datos,", error.message);
    }
};

export const startDB = async () => {
    try {
        console.debug("Creando tablas en la base de datos");

        const sqlFilePath = path.join(__dirname, "../sql/MARVI.sql");
        const sqlScript = fs.readFileSync(sqlFilePath, "utf8");

        await client.query(sqlScript);

        console.debug("Tablas creadas con éxito");
    } catch (error) {
        console.error("No se pudieron crear las tablas,", error.message);
    }
};
