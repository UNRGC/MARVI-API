import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const encryptPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (err) {
        console.error("Error encriptando la contraseña:", err);
        throw err;
    }
};

export default encryptPassword;
