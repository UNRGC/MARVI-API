import express from "express";
import { validateInjectionsEmail } from "../middlewares/credentialsMiddleware.js";
import { sendMailHandler } from "../controls/emailControls.js";

const emailRouter = express.Router();

// Ruta para enviar correos
emailRouter.post("/send", validateInjectionsEmail, sendMailHandler);

export default emailRouter;
