import { envGet, envUpdate } from "../models/envModel.js";

export const envGetHandler = (req, res) => {
    try {
        const envVariables = envGet();
        res.status(200).json(envVariables);
    } catch (error) {
        res.status(500).json({ message: `No se pudieron obtener las variables de entorno, ${error.message}` });
    }
};

export const envUpdateHandler = (req, res) => {
    try {
        envUpdate(req.body);
        res.status(200).json({ message: "Conexión actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ message: `No se pudo actualizar la conexión, ${error.message}` });
    }
};
