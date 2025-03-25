import express from "express";
import sendEmailHandler from "../controls/emailControls.js";

const emailRouter = express.Router();

// Ruta para enviar correos
emailRouter.post("/send", sendEmailHandler);

export default emailRouter;
