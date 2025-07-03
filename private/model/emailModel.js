import { createTransport } from "nodemailer";
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();

// Configurar el transporte para enviar correos
const transporter = createTransport({
    service: process.env.SERVER_EMAIL,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

// Crea una función para enviar correos
const sendEmail = async (data) => {
    try {
        const info = await transporter.sendMail({
            from: "Lavandería MARVI <no-reply>",
            to: data.destino,
            subject: data.asunto,
            html: data.html,
            attachments: [
                {
                    filename: "Logo.svg",
                    path: "public/Logo.svg",
                    cid: "logo",
                },
            ],
        });

        console.debug("Correo enviado: %s", info.messageId);
    } catch (error) {
        console.error("No se pudo enviar el correo,", error.message);
    }
};

export default sendEmail;
