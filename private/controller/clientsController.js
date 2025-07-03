import {
    deleteClient,
    getClient,
    getClients,
    registerClient,
    searchClients,
    updateClient
} from "../model/clientsModel.js";
import {config} from "dotenv";
import moment from "moment-timezone";

config();

// Controlador para registrar un cliente
export const registerClientHandler = async (req, res) => {
    try {
        const response = await registerClient(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar cliente, ${error.message}` });
    }
};

// Controlador para actualizar un cliente
export const updateClientHandler = async (req, res) => {
    try {
        const response = await updateClient(req.body);
        res.status(200).json({ message: response.notice });
        console.log(response.notice);
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar cliente, ${error.message}` });
    }
};

// Controlador para eliminar un cliente
export const deleteClientHandler = async (req, res) => {
    try {
        const cliente = req.params.cliente;
        const response = await deleteClient(cliente);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar cliente, ${error.message}` });
    }
};

// Controlador para obtener un cliente
export const getClientHandler = async (req, res) => {
    try {
        const cliente = req.params.cliente;
        const response = await getClient(cliente);

        const dateTZFechaRegistro = moment.utc(response.rows[0].fecha_registro).tz(process.env.TIME_ZONE);
        response.rows[0].fecha_registro = dateTZFechaRegistro.format(process.env.DATE_FORMAT);

        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener cliente, ${error.message}` });
    }
};

// Controlador para obtener todos los clientes filtrados
export const getClientsHandler = async (req, res) => {
    try {
        const response = await getClients(req.query);
        response.rows.forEach((cliente) => {
            const dateTZ = moment.utc(cliente.fecha_registro).tz(process.env.TIME_ZONE);
            cliente.fecha_registro = dateTZ.format(process.env.DATE_FORMAT);
        });
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener clientes, ${error.message}` });
    }
};

// Controlador para obtener todos los clientes encontrados
export const getSearchClientsHandler = async (req, res) => {
    try {
        const response = await searchClients(req.query);
        response.rows.forEach((cliente) => {
            const dateTZ = moment.utc(cliente.fecha_registro).tz(process.env.TIME_ZONE);
            cliente.fecha_registro = dateTZ.format(process.env.DATE_FORMAT);
        });
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener clientes, ${error.message}` });
    }
};
