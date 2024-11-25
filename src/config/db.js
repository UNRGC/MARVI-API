const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    connectionString: process.env.DB_URI, // Asegúrate de que esta variable esté definida en .env
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL");
    } catch (err) {
        console.error("Connection error", err.stack);
        process.exit(1); // Si hay error, salimos del proceso
    }
};

module.exports = { client, connectDB }; // Exportamos tanto el cliente como la función
