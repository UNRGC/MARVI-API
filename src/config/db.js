const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    connectionString: process.env.DB_URI, // URL de conexión que estará en el archivo .env
});

client
    .connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err.stack));

module.exports = client;
