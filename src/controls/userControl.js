import { createUser, updateUser, getUser, getUserEmail, getAllUsers, deleteUser, getUsersOrder, getUsersSearch, setUserStatus } from "../models/userModel.js";
import { config } from "dotenv";
import { validateUser } from "../middlewares/credentialsMiddleware.js";
import encryptPassword from "../utils/encryptPassword.js";

// Cargar las variables de entorno desde el archivo .env
config();

export const createAdminHandler = async (req, res) => {
    try {
        // Asignar el usuario administrador
        req.body = JSON.parse(process.env.ADMIN);

        // Obtener los datos del cuerpo de la solicitud
        const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol } = req.body;

        // Validar las credenciales del nuevo usuario
        if (await validateUser(req, res)) return;

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
    if (req.user.rol !== "A") {
        res.status(400).json({ message: "No puedes realizar esta accion" });
    } else {
        try {
            // Validar las credenciales del nuevo usuario
            if (await validateUser(req, res)) return;

            // Encriptar la contraseña del nuevo usuario
            const hashedPassword = await encryptPassword(contrasena);

            // Crear el nuevo usuario en la base de datos
            const newUser = await createUser(usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, hashedPassword, rol);

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
    const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, foto_src, rol } = req.body;

    try {
        // Validar las credenciales del usuario que se está actualizando
        if (await validateUser(req, res, id_usuario)) return;

        // Encriptar la nueva contraseña del usuario
        const hashedPassword = await encryptPassword(contrasena);

        // Actualizar el usuario en la base de datos
        const updatedUser = await updateUser(id_usuario, usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, hashedPassword, rol, foto_src);

        // Responder con el usuario actualizado
        res.status(200).json(updatedUser);
    } catch (err) {
        // Manejo de errores
        console.error("Error actualizando usuario:", err);
        res.status(500).json({ message: "Error actualizando usuario." });
    }
};

// Controlador para eliminar un usuario
export const deleteUserHandler = async (req, res) => {
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { usuario } = req.params;

    // Verificar si el usuario autenticado tiene el rol de "Administrador" y no está intentando eliminarse a sí mismo
    if (req.user.rol !== "A" || req.user.usuario === usuario) {
        res.status(400).json({ message: "No puedes realizar esta accion" });
    } else {
        try {
            // Eliminar el usuario de la base de datos
            const user = await deleteUser(usuario);

            // Responder con el usuario eliminado
            res.status(200).json(user);
        } catch (err) {
            // Manejo de errores
            console.error("Error eliminando usuario:", err);
            res.status(500).json({ message: "Error eliminando usuario." });
        }
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
        res.status(500).json({ message: "Correo no encontrado." });
    }
};

// Controlador para obtenerel número de usuarios
export const getAllUsersHandler = async (req, res) => {
    try {
        // Obtener el número de usuarios de la base de datos
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

// Controlador para obtener todos los usuarios
export const getUsersOrderHandler = async (req, res) => {
    // Obtener los parámetros de la solicitud
    const { columna, orden, limite, salto } = req.body;

    try {
        // Obtener todos los usuarios de la base de datos con paginación
        const users = await getUsersOrder(columna, orden, limite, salto);

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

// Controlador para obtener todos los usuarios con una busqueda
export const getUsersSearchHandler = async (req, res) => {
    // Obtener los parámetros de la solicitud
    const { busqueda, columna, orden, limite, salto } = req.body;

    try {
        // Obtener todos los usuarios de la base de datos con paginación
        const users = await getUsersSearch(busqueda, columna, orden, limite, salto);

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

// Controlador para actualizar el estado de un usuario
export const updateUserStatusHandler = async (req, res) => {
    // Obtener el ID del usuario de los parámetros de la solicitud
    const { id_usuario, estado } = req.body;

    try {
        // Actualizar el estado del usuario en la base de datos
        const updatedUser = await setUserStatus(id_usuario, estado);

        // Responder con el usuario actualizado
        res.status(200).json(updatedUser);
    } catch (err) {
        // Manejo de errores
        console.error("Error actualizando usuario:", err);
        res.status(500).json({ message: "Error actualizando usuario." });
    }
};
