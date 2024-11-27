import { createUser, updateUser, getUser, getUserEmail, getAllUsers, deleteUser } from "../models/userModel.js";
import { createLog } from "../models/logModel.js";
import encryptPassword from "../utils/encryptPassword.js";
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();

// Función para validar las credenciales de usuario
const validateCredentials = async (req, res, id_usuario = null) => {
    // Obtener los datos del cuerpo de la solicitud
    const { usuario, correo } = req.body;
    /// Obtener todos los usuarios de la base de datos
    const usuarios = await getAllUsers();

    // Convertir id_usuario a número si no es nulo
    const id_usuarioNum = id_usuario !== null ? Number(id_usuario) : null;

    // Verificar si el nombre de usuario ya existe y no es el mismo usuario que se está actualizando
    const usuarioExists = usuarios.find((user) => user.usuario === usuario && user.id_usuario !== id_usuarioNum);
    // Verificar si el correo ya existe y no es el mismo usuario que se está actualizando
    const correoExists = usuarios.find((user) => user.correo === correo && user.id_usuario !== id_usuarioNum);

    // Si el nombre de usuario ya existe, responder con un error 400
    if (usuarioExists) {
        res.status(400).json({ message: "El usuario ya existe." });
        return true;
    }

    // Si el correo ya existe, responder con un error 400
    if (correoExists) {
        res.status(400).json({ message: "El correo ya existe." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

export const createAdminHandler = async (req, res) => {
    try {
        // Asignar el usuario administrador
        req.body = JSON.parse(process.env.ADMIN);
        // Obtener los datos del cuerpo de la solicitud
        const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol } = req.body;
        // Validar las credenciales del nuevo usuario
        if (await validateCredentials(req, res)) return;
        // Encriptar la contraseña del nuevo usuario
        const hashedPassword = await encryptPassword(contrasena);
        // Crear el nuevo usuario en la base de datos
        const newUser = await createUser(usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, hashedPassword, rol);
        // Responder con el nuevo usuario creado
        res.status(201).json(newUser);
    } catch (err) {
        // Manejo de errores
        console.error("Error creando usuario:", err);
        res.status(500).json({ message: "Error creando usuario o el usuario Administrador ya existe." });
    }
};

// Controlador para crear un usuario
export const createUserHandler = async (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol } = req.body;

    // Verificar si el usuario autenticado tiene el rol de "Administrador"
    if (req.user.rol !== "Administrador") {
        res.status(400).json({ message: "No puedes realizar esta accion" });
    } else {
        try {
            // Validar las credenciales del nuevo usuario
            if (await validateCredentials(req, res)) return;
            // Encriptar la contraseña del nuevo usuario
            const hashedPassword = await encryptPassword(contrasena);
            // Crear el nuevo usuario en la base de datos
            const newUser = await createUser(usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, hashedPassword, rol);
            // Crear un registro de log para la creación del usuario
            await createLog(req.user.usuario, `Usuario creado: ${usuario}`);
            // Responder con el nuevo usuario creado
            res.status(201).json(newUser);
        } catch (err) {
            // Manejo de errores
            console.error("Error creando usuario:", err);
            res.status(500).json({ message: "Error creando usuario." });
        }
    }
};

// Controlador para actualizar un usuario
export const updateUserHandler = async (req, res) => {
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { id_usuario } = req.params;
    // Obtener los datos del cuerpo de la solicitud
    const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol } = req.body;

    try {
        // Validar las credenciales del usuario que se está actualizando
        if (await validateCredentials(req, res, id_usuario)) return;

        // Encriptar la nueva contraseña del usuario
        const hashedPassword = await encryptPassword(contrasena);

        // Actualizar el usuario en la base de datos
        const updatedUser = await updateUser(id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, hashedPassword, rol);

        // Crear un registro de log para la actualización del usuario
        await createLog(req.user.usuario, `Usuario actualizado: ${usuario}`);

        // Responder con el usuario actualizado
        res.status(200).json(updatedUser);
    } catch (err) {
        // Manejo de errores
        console.error("Error actualizando usuario:", err);
        res.status(500).json({ message: "Error actualizando usuario." });
    }
};

// Controlador para obtener un usuario por nombre de usuario
export const getUserHandler = async (req, res) => {
    // Obtener el nombre de usuario de los parámetros de la solicitud
    const { usuario } = req.params;

    try {
        // Obtener el usuario de la base de datos por su nombre de usuario
        const user = await getUser(usuario);

        // Verificar si el usuario no fue encontrado
        if (user.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        } else res.status(200).json(user); // Responder con el usuario obtenido
    } catch (err) {
        // Manejo de errores
        console.error("Error obteniendo usuario por usuario:", err);
        res.status(500).json({ message: "Error obteniendo usuario por usuario." });
    }
};

// Controlador para obtener un usuario por correo electrónico
export const getUserEmailHandler = async (req, res) => {
    // Obtener el correo del usuario de los parámetros de la solicitud
    const { correo } = req.params;

    try {
        // Obtener el usuario de la base de datos por su correo
        const user = await getUserEmail(correo);

        // Verificar si el usuario no fue encontrado
        if (user.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        } else res.status(200).json(user); // Responder con el usuario obtenido
    } catch (err) {
        // Manejo de errores
        console.error("Error obteniendo usuario por correo:", err);
        res.status(500).json({ message: "Error obteniendo usuario por correo" });
    }
};

// Controlador para obtener todos los usuarios
export const getAllUsersHandler = async (req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const users = await getAllUsers();

        // Verificar si no se encontraron usuarios
        if (users.length === 0) {
            res.status(404).json({ message: "No se ah registrado ningún usuario." });
            return;
        } else res.status(200).json(users); // Responder con los usuarios obtenidos
    } catch (err) {
        // Manejo de errores
        console.error("Error obteniendo usuarios:", err);
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
};

// Controlador para eliminar un usuario
export const deleteUserHandler = async (req, res) => {
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { id_usuario } = req.params;

    // Verificar si el usuario autenticado tiene el rol de "Administrador" y no está intentando eliminarse a sí mismo
    if (req.user.rol !== "Administrador" || req.user.id_usuario === Number(id_usuario)) {
        res.status(400).json({ message: "No puedes realizar esta accion" });
    } else {
        try {
            // Eliminar el usuario de la base de datos
            const user = await deleteUser(id_usuario);

            // Crear un registro de log para la eliminación del usuario
            await createLog(req.user.usuario, `Usuario eliminado: ${user.usuario}`);

            // Responder con el usuario eliminado
            res.status(200).json({ message: `Usuario eliminado: ${user.usuario}.` });
        } catch (err) {
            // Manejo de errores
            console.error("Error eliminando usuario:", err);
            res.status(500).json({ message: "Error eliminando usuario." });
        }
    }
};
