import express from "express";
import { login, refreshAccessToken } from "../controls/authControls.js";

const router = express.Router();

router.post("/", login);
router.post("/refresh", refreshAccessToken);

export default router;
