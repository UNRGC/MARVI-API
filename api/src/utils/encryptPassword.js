import bcrypt from "bcrypt";

// Número de rondas de encriptación de la contraseña
const SALT_ROUNDS = 10;

// Función para encriptar la contraseña
const encryptPassword = async (password) => {
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        // Devolver la contraseña encriptada
        return hashedPassword;
    } catch (err) {
        // Manejo de errores
        console.error("Error encriptando la contraseña:", err);
        throw err;
    }
};

// Función para comparar la contraseña
const comparePassword = async (password, hashedPassword) => {
    try {
        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, hashedPassword);
        // Devolver el resultado de la comparación
        return isMatch;
    } catch (err) {
        // Manejo de errores
        console.error("Error comparando la contraseña:", err);
        throw err;
    }
};

// Exportar las funciones
export { encryptPassword, comparePassword };
