import express from "express";
import { deniedInjections } from "../utils/security.js";
import sendEmailHandler from "../controller/emailController.js";

const emailRouter = express.Router();

// Ruta para enviar correos
emailRouter.post("/send", deniedInjections, sendEmailHandler);

export default emailRouter;
