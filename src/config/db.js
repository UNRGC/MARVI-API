import pkg from "pg";
const { Client } = pkg;
import { config } from "dotenv";

config();

const client = new Client({
    connectionString: process.env.DB_URI,
});

export const connectDB = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error("Error al conectar a PostgreSQL:", error.message);
        throw error;
    }
};

export { client };
