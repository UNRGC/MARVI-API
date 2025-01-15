import { createTransport } from "nodemailer";
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();
const email = JSON.parse(process.env.EMAIL_USER);

// Configura el transporte (puedes usar Gmail, Outlook, o un servidor SMTP propio)
const transporter = createTransport({
    service: "gmail", // Cambia por el servicio que uses (Gmail, Outlook, etc.)
    auth: {
        user: email.correo, // Tu correo electrónico
        pass: email.contrasena, // Tu contraseña o clave de aplicación
    },
});

// Crea una función para enviar correos
const sendMailTransporter = async (destinatario, asunto, mensaje) => {
    try {
        const info = await transporter.sendMail({
            from: "MARVI no-reply", // Remitente
            to: destinatario, // Destinatario
            subject: asunto, // Asunto del correo
            text: mensaje, // Mensaje en texto plano
            // html: '<b>Mensaje en HTML</b>', // Opcional, si quieres enviar HTML
        });

        // skipcq: JS-0002
        console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error enviando el correo:", error);
    }
};

export default sendMailTransporter;
