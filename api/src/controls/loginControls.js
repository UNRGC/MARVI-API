import sendEmail from "../models/emailModel.js";
import { login, changeState, forgotPassword, closeAllSessions } from "../models/loginModel.js";
import { getUser } from "../models/usersModel.js";
import { comparePassword } from "../utils/encryptPassword.js";
import { config } from "dotenv";
import fs from "fs";
import moment from "moment-timezone";

config();

// Controlador para iniciar sesión
export const loginHandler = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const response = await login(usuario);
        const loginResponse = await changeState({ usuario, estado: "Activo" });
        const userResponse = await getUser(usuario);

        const dateTZFechaRegistro = moment.utc(userResponse.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        const formattedDateFechaRegistro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);
        userResponse.rows[0].fecha_registro = formattedDateFechaRegistro;

        const dateTZUltimaActividad = moment.utc(userResponse.rows[0].ultima_actividad).tz(process.env.TIME_ZONE);
        const formattedDateUltimaActividad = dateTZUltimaActividad.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
        userResponse.rows[0].ultima_actividad = formattedDateUltimaActividad;

        if (!response.rows[0].temporal && (await comparePassword(contrasena, response.rows[0].contrasena))) {
            console.debug(loginResponse.notice);
            res.status(200).json(userResponse.rows[0]);
        } else if (response.rows[0].temporal && contrasena === response.rows[0].contrasena) {
            console.debug(loginResponse.notice);
            res.status(200).json(userResponse.rows[0]);
        } else res.status(401).json({ message: "Credenciales incorrectas" });
    } catch (err) {
        res.status(500).json({ message: `Error al iniciar sesión, ${err.message}` });
    }
};

// Controlador para cerrar sesión
export const logoutHandler = async (req, res) => {
    try {
        const { usuario } = req.body;
        const response = await changeState({ usuario, estado: "Inactivo" });
        console.debug(response.notice);
        res.status(200).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al cerrar sesión, ${err.message}` });
    }
};

// Controlador para recuperar la contraseña
export const forgotPasswordHandler = async (req, res) => {
    try {
        const { correo } = req.body;
        const response = await forgotPassword(correo);
        const template = fs.readFileSync("templates/recovery.html", "utf8");
        const htmlContent = template.replace("_temp", response.rows[0].contrasena);

        await sendEmail({
            destino: correo,
            asunto: "Recuperación de contraseña",
            html: htmlContent,
        });

        res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (err) {
        res.status(500).json({ message: `Error al recuperar la contraseña, ${err.message}` });
    }
};

// Controlador para cerrar todas las sesiones
export const closeAllSessionsHandler = async (req, res) => {
    try {
        const response = await closeAllSessions();
        console.debug(response.notice);
        res.status(200).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al cerrar todas las sesiones, ${err.message}` });
    }
};
