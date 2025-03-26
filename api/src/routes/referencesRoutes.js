import express from "express";
import { deniedInjections } from "../utils/security.js";
import { registerUnitHandler, updateUnitHandler, deleteUnitHandler, getUnitHandler, getUnitsHandler, registerFrequencyHandler, updateFrequencyHandler, deleteFrequencyHandler, getFrequencyHandler, getFrequenciesHandler } from "../controls/referencesControls.js";

// Crea nueva instancia de un router de express
const router = express.Router();

// Ruta para crear una unidad
router.post("/unit", deniedInjections, registerUnitHandler);
// Ruta para actualizar una unidad
router.put("/unit", deniedInjections, updateUnitHandler);
// Ruta para eliminar una unidad
router.delete("/unit/:unidad", deniedInjections, deleteUnitHandler);
// Ruta para obtener una unidad
router.get("/unit/:unidad", deniedInjections, getUnitHandler);
// Ruta para obtener las unidades
router.get("/unit", deniedInjections, getUnitsHandler);

// Ruta para crear una frecuencia de compra
router.post("/frequency", deniedInjections, registerFrequencyHandler);
// Ruta para actualizar una frecuencia de compra
router.put("/frequency", deniedInjections, updateFrequencyHandler);
// Ruta para eliminar una frecuencia de compra
router.delete("/frequency/:frecuencia", deniedInjections, deleteFrequencyHandler);
// Ruta para obtener una frecuencia de compra
router.get("/frequency/:frecuencia", deniedInjections, getFrequencyHandler);
// Ruta para obtener las frecuencias de compra
router.get("/frequency", deniedInjections, getFrequenciesHandler);

// Exporta el router
export default router;
