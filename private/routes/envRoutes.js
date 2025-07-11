import express from "express";
import { deniedInjections } from "../util/security.js";
import { envGetHandler, envUpdateHandler } from "../controller/envController.js";

const router = express.Router();

router.post("/", deniedInjections, envUpdateHandler);
router.get("/", deniedInjections, envGetHandler);

export default router;
