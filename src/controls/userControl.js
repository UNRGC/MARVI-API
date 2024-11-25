const { getAllUsers, createUser } = require("../models/userModel");

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const newUser = await createUser(name, email);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: "Error creating user" });
    }
};
