const bcrypt = require("bcrypt");

// Definimos el número de saltos que generará el 'sal'. Un valor común es 10.
const SALT_ROUNDS = 10;

const encryptPassword = async (password) => {
    try {
        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (err) {
        console.error("Error encrypting password:", err);
        throw err; // Lanzamos el error para manejarlo en otro lugar
    }
};

module.exports = encryptPassword;
