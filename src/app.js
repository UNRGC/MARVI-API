import express from "express";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";

// Crear la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Configurar Express para que pueda parsear JSON
app.use(express.json());

// Middleware para manejar errores de JSON mal formados
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error("Error de JSON mal formado:", err.message);
        res.status(400).json({ message: "JSON mal formado" });
        return;
    }
    next();
});

// Rutas
app.use("/logs", logRoutes);
app.use("/login", authRoutes);
app.use("/users", userRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // Necesario para informar al desarrollador sobre la URL del servidor durante el desarrollo y las pruebas
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // skipcq: JS-0002
});
