import jwt from "jsonwebtoken";
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();

// Obtener la clave secreta del archivo de variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para autenticar el token
export const authenticateToken = (req, res, next) => {
    // Obtener el encabezado de autorización de la solicitud
    const authHeader = req.headers.authorization;

    // Verificar si el encabezado de autorización está presente
    if (!authHeader) {
        // Si no está presente, responder con un error 401 (No autorizado)
        res.status(401).json({ message: "Token requerido" });
        return;
    }

    // Extraer el token del encabezado de autorización
    const token = authHeader.split(" ")[1];

    try {
        // Verificar y decodificar el token
        const user = jwt.verify(token, JWT_SECRET);
        // Adjuntar la información del usuario a la solicitud
        req.user = user;
        // Pasar al siguiente middleware o controlador
        next();
    } catch (err) {
        // Manejo errores
        console.error(err);
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};
