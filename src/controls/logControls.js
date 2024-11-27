import { getLogs } from "../models/logModel.js";

// Función para obtener los logs
export const getLogsHandler = async (req, res) => {
    try {
        // Obtenemos los logs
        const logs = await getLogs();

        // Verificar si no se encontraron logs
        if (logs.length === 0) {
            res.status(404).json({ message: "No se ah registrado ningún log." });
            return;
        } else res.status(200).json(logs); // Responder con los logs obtenidos
    } catch (err) {
        // manejo de errores
        console.error("Error obteniendo logs:", err);
        res.status(500).json({ message: "Error obteniendo logs." });
    }
};
