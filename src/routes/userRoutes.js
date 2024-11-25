const express = require("express");
const router = express.Router();
const userController = require("../controls/userControl");

router.get("/", userController.getAllUsers); // Ruta para obtener usuarios
router.post("/", userController.createUser); // Ruta para crear un usuario

module.exports = router;
