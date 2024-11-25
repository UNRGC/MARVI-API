import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

// Conectar a la base de datos
connectDB();

// Rutas
app.use(express.json());
app.use("/users", userRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // Necesario para informar al desarrollador sobre la URL del servidor durante el desarrollo y las pruebas
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // skipcq: JS-0002
});
