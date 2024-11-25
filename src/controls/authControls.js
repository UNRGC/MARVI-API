const bcrypt = require("bcrypt");
const { client } = require("../config/db");

// Función para verificar la contraseña durante el login
const verifyPassword = async (correo, contrasena) => {
    try {
        // Recuperar el usuario por su correo
        const res = await client.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        const user = res.rows[0];

        if (!user) {
            throw new Error("User not found");
        }

        // Comparar la contraseña proporcionada con la encriptada
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return user; // Si las contraseñas coinciden, devolver el usuario
    } catch (err) {
        console.error("Error verifying password:", err);
        throw err;
    }
};

module.exports = {
    verifyPassword,
};
