import express from "express";
import { getLogsHandler } from "../controls/logControls.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getLogsHandler);

export default router;
