import sendEmail from "../model/emailModel.js";
import fs from "fs";

// Controlador para enviar correos
const sendEmailHandler = async (req, res) => {
    try {
        const { destino, asunto, mensaje } = req.body;
        const template = fs.readFileSync("./templates/message_email.html", "utf8");
        const html = template.replace("_asunto", asunto).replace("_mensaje", mensaje);

        await sendEmail({
            destino,
            asunto,
            html,
        });

        res.status(200).json({ message: "Correo enviado correctamente" });
    } catch (error) {
        res.status(500).json({ message: `No se pudo enviar el correo, ${error.message}` });
    }
};

export default sendEmailHandler;
