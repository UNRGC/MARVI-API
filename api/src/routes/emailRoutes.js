import express from "express";
import { deniedInjections } from "../utils/security.js";
import sendEmailHandler from "../controls/emailControls.js";

const emailRouter = express.Router();

// Ruta para enviar correos
emailRouter.post("/send", deniedInjections, sendEmailHandler);

export default emailRouter;
