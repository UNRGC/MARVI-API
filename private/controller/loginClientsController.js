import sendEmail from "../model/emailModel.js";
import {config} from "dotenv";
import {getClientByEmail} from "../model/clientsModel.js";
import {loginClient, resetPasswordClient} from "../model/loginClientsModel.js";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import fs from "fs";

config();

// Controlador para iniciar sesión de un cliente
export const loginClientHandler = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const response = await loginClient(correo);
        const clientResponse = await getClientByEmail(correo);

        const dateTZFechaRegistro = moment.utc(clientResponse.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        clientResponse.rows[0].fecha_registro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);

        if (await bcrypt.compare(contrasena, response.rows[0].contrasena)) {
            res.status(200).json(clientResponse.rows[0]);
        } else res.status(401).json({ message: "Error de autenticación, las credenciales son invalidas" });
    } catch (error) {
        if (error.message === "El usuario no existe") res.status(500).json({ message: "Error de autenticación, las credenciales son invalidas" });
        else res.status(500).json({ message: `Error al iniciar sesión, ${error.message}` });
    }
};

// Controlador para enviar un correo de restablecimiento de contraseña a un cliente
export const resetPasswordClientEmailHandler = async (req, res) => {
    try {
        const { correo } = req.body;
        const response = await getClientByEmail(correo);
        const template = fs.readFileSync("templates/reset_password_client_email.html", "utf8");
        const htmlContent = template.replace("_link", `https://marvi-api.onrender.com/login/clients/reset/password/${response.rows[0].correo}`);

        await sendEmail({
            destino: correo,
            asunto: "MARVI - Restablece tu contraseña",
            html: htmlContent,
        });

        res.status(200).json({ message: "Correo de restablecimiento enviado, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña" });
    } catch (error) {
        if (error.message === "El usuario no existe") res.status(500).json({ message: "Error al restablecer la contraseña, el correo no está registrado en el sistema" });
        else res.status(500).json({ message: `Error al restablecer la contraseña, ${error.message}` });
    }
};

// Controlador para página de restablecimiento de contraseña
export const resetPasswordClientPageHandler = async (req, res) => {
    try {
        const { correo } = req.params;
        const template = fs.readFileSync("templates/reset_password_client.html", "utf8");
        const htmlContent = template.replace("_email", correo);

        res.status(200).send(htmlContent);
    } catch (error) {
        res.status(500).json({ message: `Error al cargar la página de restablecimiento de contraseña, ${error.message}` });
    }
};

// Controlador para restablecer la contraseña de un cliente
export const resetPasswordClientHandler = async (req, res) => {
    try {
        const { correo, nuevaContrasena } = req.body;
        const response = await resetPasswordClient(correo, nuevaContrasena);
        res.status(200).json({ message: response.rows[0] });
    } catch (error) {
        if (error.message === "El usuario no existe") res.status(500).json({ message: "Error al restablecer la contraseña, el correo no está registrado en el sistema" });
        else res.status(500).json({ message: `Error al restablecer la contraseña, ${error.message}` });
    }
};
