import express from "express";
import cors from "cors";
import os from "os";
import moment from "moment-timezone";
import envRoutes from "./private/routes/envRoutes.js";
import loginRoutes from "./private/routes/loginUsersRoutes.js";
import loginClientsRoutes from "./private/routes/loginClientsRoutes.js";
import usersRoutes from "./private/routes/usersRoutes.js";
import clientsRoutes from "./private/routes/clientsRoutes.js";
import referencesRoutes from "./private/routes/referencesRoutes.js";
import productsRoutes from "./private/routes/productsRoutes.js";
import servicesRoutes from "./private/routes/servicesRoutes.js";
import emailRoutes from "./private/routes/emailRoutes.js";
import {config} from "dotenv";
import {envStart} from "./private/config/env.js";
import {createServer} from "http";
import {WebSocketServer} from "ws";
import {connectDB} from "./private/config/db.js";
import {closeAllSessions} from "./private/model/loginUsersModel.js";

// Cargar las variables de entorno
config();

// Crear la aplicación Express
const app = express();

// Verificar si el entorno ya ha sido creado
try {
    if (process.env.CREATED) {
        console.debug("Cargando el entorno...");
    } else {
        console.debug("Creando el entorno...");
        envStart();
    }
} catch (error) {
    console.error("No se pudo cargar el entorno,", error.message);
}

// Configurar Express para que pueda parsear JSON
app.use(express.json());

// Configurar CORS
app.use(cors());

// Middleware para manejar errores de JSON mal formados
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error("Error de JSON mal formado:", err.message);
        res.status(400).json({message: "JSON mal formado"});
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

// Archivos estáticos
app.use(express.static("public"));

// Obtener la dirección IP de la máquina
const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const face of interfaces[name]) {
            if (face.family === "IPv4" && !face.internal) {
                return face.address;
            }
        }
    }
    return "localhost";
};

// Configurar el puerto y el servidor
const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Crear el servidor WebSocket
const logs = [];
const wss = new WebSocketServer({server});

// Reemplazar los métodos de consola
const originalDebug = console.debug;
const originalError = console.error;

// Función para obtener la fecha y hora con zona horaria
const dateTZ = () => {
    const date = new Date();
    const timeZone = process.env.TIME_ZONE || "UTC";
    const timeFormat = process.env.TIME_FORMAT || "HH:mm:ss";
    const dateFormat = process.env.DATE_FORMAT || "DD/MM/YYYY";

    const dateTZFechaRegistro = moment.utc(date.toISOString()).tz(timeZone);
    return dateTZFechaRegistro.format(`${dateFormat} ${timeFormat}`);
}

// Manejar conexiones WebSocket
const broadcastLog = (type, originalFn, ...args) => {
    const message = args.map(arg => typeof arg === "string" ? arg : JSON.stringify(arg)).join(" ");
    const logLine = `${dateTZ()} [${type}] - ${message}`;
    logs.push(logLine);
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(logLine);
        }
    });
    originalFn.apply(console, args);
}

console.debug = function (...args) {
    broadcastLog("DEBUG", originalDebug, ...args);
};
console.error = function (...args) {
    broadcastLog("ERROR", originalError, ...args);
};
wss.on('connection', ws => {
    // Envía todos los logs previos al nuevo cliente
    logs.forEach(log => ws.send(log));
});

// Iniciar el servidor
server.listen(PORT, () => {
    const ipAddress = getIPAddress();
    console.debug(`Servidor iniciado en ${ipAddress}:${PORT}`);
});

// Conectar a la base de datos
connectDB().catch(
    error => {
        console.error(error.message);
        process.exit(1);
    }
)

// Manejar eventos antes de que la API termine
const shutdown = () => {
    console.debug("Cerrando el servidor...");

    server.close(async () => {
        const response = await closeAllSessions();
        console.debug(response.notice);
        console.debug("Servidor cerrado correctamente");
        process.exit(0);
    });

    setTimeout(() => {
        console.warn("Forzando cierre...");
        process.exit(1);
    }, 5000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
