import { registerService, updateService, deleteService, getService, getServices, searchServices } from "../model/servicesModel.js";

// Controlador para crear un servicio
export const registerServiceHandler = async (req, res) => {
    try {
        const response = await registerService(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar servicio, ${error.message}` });
    }
};

// Controlador para actualizar un servicio
export const updateServiceHandler = async (req, res) => {
    try {
        const response = await updateService(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar servicio, ${error.message}` });
    }
};

// Controlador para eliminar un servicio
export const deleteServiceHandler = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const response = await deleteService(codigo);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar servicio, ${error.message}` });
    }
};

// Controlador para obtener un servicio
export const getServiceHandler = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const response = await getService(codigo);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener servicio, ${error.message}` });
    }
};

// Controlador para obtener todos los servicios filtrados
export const getServicesHandler = async (req, res) => {
    try {
        const response = await getServices(req.query);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener servicios, ${error.message}` });
    }
};

// Controlador para buscar servicios
export const searchServicesHandler = async (req, res) => {
    try {
        const response = await searchServices(req.query);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al buscar servicios, ${error.message}` });
    }
};
