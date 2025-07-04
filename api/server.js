import express from "express";
import cors from "cors";
import envRoutes from "./src/routes/envRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import loginClientsRoutes from "./src/routes/loginClientsRoutes.js";
import usersRoutes from "./src/routes/usersRoutes.js";
import clientsRoutes from "./src/routes/clientsRoutes.js";
import referencesRoutes from "./src/routes/referencesRoutes.js";
import productsRoutes from "./src/routes/productsRoutes.js";
import servicesRoutes from "./src/routes/servicesRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";
import { connectDB } from "./src/config/db.js";
import { envStart } from "./src/config/env.js";
import htmlStart from "./src/config/html.js";
import os from "os";
import { config } from "dotenv";
import { closeAllSessions } from "./src/models/loginModel.js";

// Cargar las variables de entorno
config();

// Crear la aplicación Express
const app = express();

try {
    if (process.env.ONLINE === "false") {
        // Crear las variables de entorno
        envStart();
    }

    // Crear las plantillas HTML
    htmlStart();
} catch (error) {
    console.error("No se pudo cargar el entorno,", error.message);
}

// Conectar a la base de datos
connectDB();

// Configurar Express para que pueda parsear JSON
app.use(express.json());

// Configurar CORS
app.use(cors());

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
app.use("/env", envRoutes);
app.use("/login", loginRoutes, loginClientsRoutes);
app.use("/users", usersRoutes);
app.use("/clients", clientsRoutes);
app.use("/references", referencesRoutes);
app.use("/products", productsRoutes);
app.use("/services", servicesRoutes);
app.use("/email", emailRoutes);

// Obtener la dirección IP de la máquina
const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
};

let server = null;

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
    const ipAddress = getIPAddress();
    console.debug(`Servidor iniciado en ${ipAddress}:${PORT}`);
});

// Manejar eventos antes de que la API termine
const shutdown = () => {
    console.debug("Cerrando el servidor...");

    // Cerrar conexiones abiertas y liberar recursos
    server.close(async () => {
        // cerrar sesiones de usuarios
        const response = await closeAllSessions();
        console.debug(response.notice);
        console.debug("Servidor cerrado correctamente");
        process.exit(0);
    });

    // Si hay procesos asíncronos, dar tiempo para terminarlos
    setTimeout(() => {
        console.warn("Forzando cierre...");
        process.exit(1);
    }, 5000);
};

// Capturar señales del sistema
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
