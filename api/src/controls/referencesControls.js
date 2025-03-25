import { registerUnit, updateUnit, deleteUnit, getUnit, getUnits, registerFrequency, updateFrequency, deleteFrequency, getFrequency, getFrequencies } from "../models/referencesModel.js";

// Controlador para crear una unidad
export const registerUnitHandler = async (req, res) => {
    try {
        const response = await registerUnit(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar unidad, ${error.message}` });
    }
};

// Controlador para actualizar una unidad
export const updateUnitHandler = async (req, res) => {
    try {
        const response = await updateUnit(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar unidad, ${error.message}` });
    }
};

// Controlador para eliminar una unidad
export const deleteUnitHandler = async (req, res) => {
    try {
        const response = await deleteUnit(req.params.unidad);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar unidad, ${error.message}` });
    }
};

// Controlador para obtener una unidad
export const getUnitHandler = async (req, res) => {
    try {
        const response = await getUnit(req.params.unidad);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener unidad, ${error.message}` });
    }
};

// Controlador para obtener las unidades
export const getUnitsHandler = async (req, res) => {
    try {
        const response = await getUnits();
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener unidades, ${error.message}` });
    }
};

// Controlador para crear una frecuencia de compra
export const registerFrequencyHandler = async (req, res) => {
    try {
        const response = await registerFrequency(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar frecuencia de compra, ${error.message}` });
    }
};

// Controlador para actualizar una frecuencia de compra
export const updateFrequencyHandler = async (req, res) => {
    try {
        const response = await updateFrequency(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar frecuencia de compra, ${error.message}` });
    }
};

// Controlador para eliminar una frecuencia de compra
export const deleteFrequencyHandler = async (req, res) => {
    try {
        const response = await deleteFrequency(req.params.frecuencia);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar frecuencia de compra, ${error.message}` });
    }
};

// Controlador para obtener una frecuencia de compra
export const getFrequencyHandler = async (req, res) => {
    try {
        const response = await getFrequency(req.params.frecuencia);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener frecuencia de compra, ${error.message}` });
    }
};

// Controlador para obtener las frecuencias de compra
export const getFrequenciesHandler = async (req, res) => {
    try {
        const response = await getFrequencies();
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener frecuencias de compra, ${error.message}` });
    }
};
