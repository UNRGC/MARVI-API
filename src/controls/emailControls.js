import sendMailTransporter from "../models/emailModel.js";

// Función para enviar correos
export const sendMailHandler = async (req, res) => {
    // Obtenemos los datos del cuerpo de la petición
    const { destinatario, asunto, mensaje } = req.body;

    // Verificar si los datos requeridos no fueron enviados
    if (!destinatario || !asunto || !mensaje) {
        res.status(400).json({ message: "Faltan datos requeridos." });
        return;
    }

    try {
        // Enviamos el correo
        await sendMailTransporter(destinatario, asunto, mensaje);

        res.status(200).json({ message: "Correo enviado." });
    } catch (error) {
        // manejo de errores
        console.error("Error enviando correo:", error);
        res.status(500).json({ message: "Error enviando correo." });
    }
};
