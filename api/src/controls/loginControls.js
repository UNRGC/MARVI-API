import sendEmail from "../models/emailModel.js";
import { login, changeState, forgotPassword, closeAllSessions } from "../models/loginModel.js";
import { getUser } from "../models/usersModel.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import fs from "fs";
import moment from "moment-timezone";

config();

// Controlador para iniciar sesión
export const loginHandler = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const response = await login(usuario);
        const userResponse = await getUser(usuario);

        const dateTZFechaRegistro = moment.utc(userResponse.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        const formattedDateFechaRegistro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);
        userResponse.rows[0].fecha_registro = formattedDateFechaRegistro;

        const dateTZUltimaActividad = moment.utc(userResponse.rows[0].ultima_actividad).tz(process.env.TIME_ZONE);
        const formattedDateUltimaActividad = dateTZUltimaActividad.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
        userResponse.rows[0].ultima_actividad = formattedDateUltimaActividad;

        if (!response.rows[0].temporal && (await bcrypt.compare(contrasena, response.rows[0].contrasena))) {
            const loginResponse = await changeState({ usuario, estado: "Activo" });
            console.debug(loginResponse.notice);
            res.status(200).json(userResponse.rows[0]);
        } else if (response.rows[0].temporal && contrasena === response.rows[0].contrasena) {
            const loginResponse = await changeState({ usuario, estado: "Activo" });
            console.debug(loginResponse.notice);
            res.status(200).json(userResponse.rows[0]);
        } else res.status(401).json({ message: "Error de autenticación, las credenciales son invalidas" });
    } catch (error) {
        if (error.message === "El usuario no existe") res.status(500).json({ message: "Error de autenticación, las credenciales son invalidas" });
        else res.status(500).json({ message: `Error al iniciar sesión, ${error.message}` });
    }
};

// Controlador para cerrar sesión
export const logoutHandler = async (req, res) => {
    try {
        const { usuario } = req.body;
        const response = await changeState({ usuario, estado: "Inactivo" });
        console.debug(response.notice);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al cerrar sesión, ${error.message}` });
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

        res.status(200).json({ message: "Correo de recuperación enviado, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña" });
    } catch (error) {
        if (error.message === "El correo no existe") res.status(500).json({ message: "Error al recuperar la contraseña, el correo no está registrado en el sistema" });
        else res.status(500).json({ message: `Error al recuperar la contraseña, ${error.message}` });
    }
};

// Controlador para cerrar todas las sesiones
export const closeAllSessionsHandler = async (req, res) => {
    try {
        const response = await closeAllSessions();
        console.debug(response.notice);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al cerrar todas las sesiones, ${error.message}` });
    }
};
