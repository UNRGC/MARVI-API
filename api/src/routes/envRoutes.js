import express from "express";
import { envGetHandler, envUpdateHandler } from "../controls/envControls.js";

const router = express.Router();

router.post("/", envUpdateHandler);
router.get("/", envGetHandler);

export default router;
