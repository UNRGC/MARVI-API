import { createUser, updateUser, getUser, getUserEmail, getAllUsers } from "../models/userModel.js";
import encryptPassword from "../utils/encryptPassword.js";

export const createUserHandler = async (req, res) => {
    const { usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena } = req.body;

    try {
        const resultUser = await getUser(usuario);
        const resultEmail = await getUserEmail(correo);
        if (resultUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        } else if (resultEmail) {
            res.status(400).json({ message: "El correo ya existe" });
            return;
        }
    } catch (err) {
        console.error("Error obteniendo usuario por usuario o correo:", err);
        res.status(500).json({ message: "Error obteniendo usuario por usuario o correo" });
        return;
    }

    try {
        const hashedPassword = await encryptPassword(contrasena);
        const newUser = await createUser(usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, hashedPassword);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error creando usuario:", err);
        res.status(500).json({ message: "Error creando usuario" });
    }
};

export const updateUserHandler = async (req, res) => {
    const { idUsuario } = req.params;
    const { usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasena } = req.body;

    try {
        const resultUser = await getUser(usuario);
        const resultEmail = await getUserEmail(correo);
        if (resultUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        } else if (resultEmail) {
            res.status(400).json({ message: "El correo ya existe" });
            return;
        }
    } catch (err) {
        console.error("Error obteniendo usuario por usuario o correo:", err);
        res.status(500).json({ message: "Error obteniendo usuario por usuario o correo" });
        return;
    }

    try {
        const hashedPassword = await encryptPassword(contrasena);
        const updatedUser = await updateUser(idUsuario, usuario, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, hashedPassword);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error actualizando usuario:", err);
        res.status(500).json({ message: "Error actualizando usuario" });
    }
};

export const getUserHandler = async (req, res) => {
    const { usuario } = req.params;

    try {
        const user = await getUser(usuario);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error obteniendo usuario por usuario:", err);
        res.status(500).json({ message: "Error obteniendo usuario por usuario" });
    }
};

export const getUserEmailHandler = async (req, res) => {
    const { correo } = req.params;

    try {
        const user = await getUserEmail(correo);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error obteniendo usuario por correo:", err);
        res.status(500).json({ message: "Error obteniendo usuario por correo" });
    }
};

export const getAllUsersHandler = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error obteniendo usuarios:", err);
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
};
