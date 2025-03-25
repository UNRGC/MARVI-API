import { deleteUser, getUser, getUsers, getActiveUsers, registerUser, updateUser, searchUsers, changeUserRole } from "../models/usersModel.js";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

// Controlador para crear un usuario
export const registerUserHandler = async (req, res) => {
    try {
        const response = await registerUser(req.body);
        res.status(201).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al registrar usuario, ${err.message}` });
    }
};

// Controlador para actualizar un usuario
export const updateUserHandler = async (req, res) => {
    try {
        const response = await updateUser(req.body);
        res.status(200).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al actualizar usuario, ${err.message}` });
    }
};

// Controlador para eliminar un usuario
export const deleteUserHandler = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const response = await deleteUser(usuario);
        res.status(200).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al eliminar usuario, ${err.message}` });
    }
};

// Controlador para obtener un usuario
export const getUserHandler = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const response = await getUser(usuario);

        const dateTZFechaRegistro = moment.utc(response.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        const formattedDateFechaRegistro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);
        response.rows[0].fecha_registro = formattedDateFechaRegistro;

        const dateTZUltimaActividad = moment.utc(response.rows[0].ultima_actividad).tz(process.env.TIME_ZONE);
        const formattedDateUltimaActividad = dateTZUltimaActividad.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
        response.rows[0].ultima_actividad = formattedDateUltimaActividad;
        res.status(200).json(response.rows[0]);
    } catch (err) {
        res.status(500).json({ message: `Error al obtener usuario, ${err.message}` });
    }
};

// Controlador para obtener todos los usuarios filtrados
export const getUsersHandler = async (req, res) => {
    try {
        const response = await getUsers(req.body);
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.fecha_registro).tz(process.env.TIME_ZONE);
            const formattedDate = dateTZ.format(process.env.DATE_FORMAT);
            usuario.fecha_registro = formattedDate;
        });
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json({ message: `Error al obtener usuarios, ${err.message}` });
    }
};

// Controlador para obtener los usuarios activos
export const getActiveUsersHandler = async (req, res) => {
    try {
        const response = await getActiveUsers();
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.ultima_actividad).tz(process.env.TIME_ZONE);
            const formattedDate = dateTZ.format(`${process.env.DATE_FORMAT} ${process.env.TIME_FORMAT}`);
            usuario.ultima_actividad = formattedDate;
        });
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json({ message: `Error al obtener usuarios, ${err.message}` });
    }
};

// Controlador para obtener todos los usuarios encontrados
export const getSearchUsersHandler = async (req, res) => {
    try {
        const response = await searchUsers(req.body);
        response.rows.forEach((usuario) => {
            const dateTZ = moment.utc(usuario.fecha_registro).tz(process.env.TIME_ZONE);
            const formattedDate = dateTZ.format(process.env.DATE_FORMAT);
            usuario.fecha_registro = formattedDate;
        });
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json({ message: `Error al obtener usuarios, ${err.message}` });
    }
};

// Controlador para cambiar el rol de un usuario
export const changeUserRoleHandler = async (req, res) => {
    try {
        const response = await changeUserRole(req.body);
        res.status(200).json({ message: response.notice });
    } catch (err) {
        res.status(500).json({ message: `Error al cambiar el rol de usuario, ${err.message}` });
    }
};
