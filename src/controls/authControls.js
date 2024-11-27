import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { getUser } from "../models/userModel.js";
import { client } from "../config/db.js";

// Cargar las variables de entorno desde el archivo .env
config();

// Configuración de los tiempos de expiración de los tokens
const JWT_SECRET = process.env.JWT_SECRET; // Clave secreta para firmar los tokens
const JWT_EXPIRES_IN = "1h"; // Access Token de 1 hora
const REFRESH_EXPIRES_IN = "1d"; // Refresh Token de 1 día

// Función de inicio de sesión
export const login = async (req, res) => {
    // Obtener las credenciales de la solicitud
    const { usuario, contrasena } = req.body;

    try {
        // Obtener el usuario de la base de datos
        const user = await getUser(usuario);
        // Si el usuario no existe, responder con un error 404
        if (!user) {
            res.status(404).json({ message: "Credenciales inválidas" });
            return;
        }

        // Comparar la contraseña proporcionada con la contraseña almacenada
        const hashedPassword = await bcrypt.compare(contrasena, user.contrasena);
        // Si la contraseña no coincide, responder con un error 401
        if (!hashedPassword) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }

        // Verificar si ya existe un refresh token para el usuario
        const {
            rows: [existingToken],
        } = await client.query("SELECT refresh_token FROM tokens WHERE id_usuario = $1 AND expira > NOW()", [user.id_usuario]);

        let refreshToken = "";

        // Si existe un refresh token válido, usarlo
        if (existingToken) refreshToken = existingToken.refresh_token;
        else {
            // Si no existe un refresh token, crear uno nuevo
            refreshToken = jwt.sign({ id_usuario: user.id_usuario }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
            await client.query("INSERT INTO tokens (id_usuario, refresh_token, expira) VALUES ($1, $2, NOW() + interval '1 days')", [user.id_usuario, refreshToken]);
        }

        // Crear un nuevo access token
        const accessToken = jwt.sign({ id_usuario: user.id_usuario, usuario: user.usuario, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Responder con los tokens de acceso y actualización
        res.json({ access: accessToken, refresh: refreshToken });
    } catch (err) {
        // Manejo de errores
        console.error("Error en login:", err);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Función de nuevo token de acceso
export const refreshAccessToken = async (req, res) => {
    // Obtener el refresh token de la solicitud
    const { refreshToken } = req.body;

    try {
        // Verificar si el refresh token está presente en la solicitud
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token requerido" });
            return;
        }

        // Verificar y decodificar el refresh token
        const { id_usuario } = jwt.verify(refreshToken, JWT_SECRET);

        // Consultar la base de datos para verificar si el refresh token es válido y no ha expirado
        const {
            rows: [storedToken],
        } = await client.query("SELECT * FROM tokens WHERE refresh_token = $1 AND expira > NOW()", [refreshToken]);

        // Si no se encuentra un token válido, responder con un error 403
        if (!storedToken) {
            res.status(403).json({ message: "Refresh token inválido o expirado" });
            return;
        }

        // Generar un nuevo access token
        const newAccessToken = jwt.sign({ id_usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Responder con el nuevo access token
        res.json({ access: newAccessToken });
    } catch (error) {
        // Manejo de errores
        console.error("Error al renovar token:", error.message);
        res.status(403).json({ message: "Token inválido." });
    }
};
