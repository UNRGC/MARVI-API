import express from "express";
import { registerUnitHandler, updateUnitHandler, deleteUnitHandler, getUnitHandler, getUnitsHandler, registerFrequencyHandler, updateFrequencyHandler, deleteFrequencyHandler, getFrequencyHandler, getFrequenciesHandler } from "../controls/referencesControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear una unidad
router.post("/unit", registerUnitHandler);
// Ruta para actualizar una unidad
router.put("/unit", updateUnitHandler);
// Ruta para eliminar una unidad
router.delete("/unit/:unidad", deleteUnitHandler);
// Ruta para obtener una unidad
router.get("/unit/:unidad", getUnitHandler);
// Ruta para obtener las unidades
router.get("/unit", getUnitsHandler);

// Ruta para crear una frecuencia de compra
router.post("/frequency", registerFrequencyHandler);
// Ruta para actualizar una frecuencia de compra
router.put("/frequency", updateFrequencyHandler);
// Ruta para eliminar una frecuencia de compra
router.delete("/frequency/:frecuencia", deleteFrequencyHandler);
// Ruta para obtener una frecuencia de compra
router.get("/frequency/:frecuencia", getFrequencyHandler);
// Ruta para obtener las frecuencias de compra
router.get("/frequency", getFrequenciesHandler);

// Exporta el router
export default router;
