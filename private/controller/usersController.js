import {
    changeUserRole,
    deleteUser,
    getActiveUsers,
    getUser,
    getUsers,
    registerUser,
    searchUsers,
    updateUser
} from "../model/usersModel.js";
import {config} from "dotenv";
import moment from "moment-timezone";

config();

// Controlador para crear un usuario
export const registerUserHandler = async (req, res) => {
    try {
        const response = await registerUser(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar usuario, ${error.message}` });
    }
};

// Controlador para actualizar un usuario
export const updateUserHandler = async (req, res) => {
    try {
        const response = await updateUser(req.body);
        res.status(200).json({ message: response.notice });
        console.log(response.notice);
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar usuario, ${error.message}` });
    }
};

// Controlador para eliminar un usuario
export const deleteUserHandler = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const response = await deleteUser(usuario);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar usuario, ${error.message}` });
    }
};

// Controlador para obtener un usuario
export const getUserHandler = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const response = await getUser(usuario);

        const dateTZFechaRegistro = moment.utc(response.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        response.rows[0].fecha_registro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);

        const dateTZUltimaActividad = moment.utc(response.rows[0].ultima_actividad).tz(process.env.TIME_ZONE);
        response.rows[0].ultima_actividad = dateTZUltimaActividad.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener usuario, ${error.message}` });
    }
};

// Controlador para obtener todos los usuarios filtrados
export const getUsersHandler = async (req, res) => {
    try {
        const response = await getUsers(req.query);
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.fecha_registro).tz(process.env.TIME_ZONE);
            usuario.fecha_registro = dateTZ.format(process.env.DATE_FORMAT);
        });
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener usuarios, ${error.message}` });
    }
};

// Controlador para obtener los usuarios activos
export const getActiveUsersHandler = async (req, res) => {
    try {
        const response = await getActiveUsers();
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.ultima_actividad).tz(process.env.TIME_ZONE);
            usuario.ultima_actividad = dateTZ.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
        });
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener usuarios, ${error.message}` });
    }
};

// Controlador para obtener todos los usuarios encontrados
export const getSearchUsersHandler = async (req, res) => {
    try {
        const response = await searchUsers(req.query);
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.fecha_registro).tz(process.env.TIME_ZONE);
            usuario.fecha_registro = dateTZ.format(process.env.DATE_FORMAT);
        });
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener usuarios, ${error.message}` });
    }
};

// Controlador para cambiar el rol de un usuario
export const changeUserRoleHandler = async (req, res) => {
    try {
        const response = await changeUserRole(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al cambiar el rol de usuario, ${error.message}` });
    }
};
