const { getAllUsers, createUser } = require("../models/userModel");
const encryptPassword = require("../utils/encryptPassword"); // Importamos la función para encriptar

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err); // Muestra el error en la consola
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const { usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await encryptPassword(contrasena);

        // Crear el usuario con la contraseña encriptada
        const newUser = await createUser(usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, hashedPassword);

        res.status(201).json(newUser); // Devolver el usuario creado
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
};
