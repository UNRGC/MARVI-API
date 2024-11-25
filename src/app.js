const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const { connectDB } = require("./config/db"); // Desestructuramos para obtener connectDB

dotenv.config(); // Cargar las variables de entorno

const app = express();

connectDB(); // Conectar a la base de datos PostgreSQL

app.use(express.json()); // Para parsear los cuerpos JSON
app.use("/users", userRoutes); // Rutas de usuarios

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
