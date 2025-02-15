import { getUsersUnique } from "../models/userModel.js";

// Función para verificar si hay inyección de código en los datos de entrada
const validateInjections = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol, estado, foto_src } = req.body;

    // Crear un arreglo con los datos de entrada
    const inputs = [usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, contrasena, rol, estado, foto_src];
    // Crear un patrón de inyección de código más específico
    const injectionPattern = /['"=;(){}<>]|--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|SCRIPT)\b/i;

    // Verificar si hay inyección de código en los datos
    for (const input of inputs) {
        if (typeof input === "string" && injectionPattern.test(input)) {
            res.status(400).json({ message: "Entrada inválida detectada." });
            return true;
        }
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar el correo del usuario
const validateEmail = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { correo } = req.body;

    // Verificar si el correo tiene un formato válido
    if (!/\S+@\S+\.\S+/.test(correo)) {
        res.status(400).json({ message: "El correo tiene un formato invalido." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar el teléfono del usuario
const validatePhone = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { telefono } = req.body;

    // Verificar si el teléfono tiene al menos 10 dígitos
    if (telefono.length < 10 || telefono.length > 17) {
        res.status(400).json({ message: "El teléfono debe tener al menos 10 dígitos." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar la contraseña del usuario
const validatePassword = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { contrasena } = req.body;

    // Verificar si la contraseña tiene al menos 8 caracteres
    if (contrasena.length < 8) {
        res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar el rol del usuario
const validateRole = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { rol } = req.body;

    // Verificar si el rol es válido
    if (rol !== "A" && rol !== "U" && rol !== "I") {
        res.status(400).json({ message: "El rol debe ser 'A', 'U' o 'I'." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar si el usuario ya existe
export const validateUser = async (req, res, id_usuario = null) => {
    // Obtener los datos del cuerpo de la solicitud
    const { usuario, correo, telefono } = req.body;
    /// Obtener todos los usuarios de la base de datos
    const usuarios = await getUsersUnique();

    // Convertir id_usuario a número si no es nulo
    const id_usuarioNum = id_usuario !== null ? Number(id_usuario) : null;

    // Verificar si el nombre de usuario ya existe y no es el mismo usuario que se está actualizando
    const usuarioExists = usuarios.find((user) => user.usuario === usuario && user.id_usuario !== id_usuarioNum);
    // Verificar si el correo ya existe y no es el mismo usuario que se está actualizando
    const correoExists = usuarios.find((user) => user.correo === correo && user.id_usuario !== id_usuarioNum);
    // Verifica si el número de teléfono ya existe y no es el mismo usuario que se está actualizando
    const telefonoExists = usuarios.find((user) => user.telefono === telefono && user.id_usuario !== id_usuarioNum);

    // Si el nombre de usuario ya existe, responder con un error 400
    if (usuarioExists) {
        res.status(400).json({ message: "El usuario ya existe." });
        return true;
    }

    // Si el correo ya existe, responder con un error 400
    if (correoExists) {
        res.status(400).json({ message: "El correo ya existe." });
        return true;
    }

    // Si el número de teléfono ya existe, responder con un error 400
    if (telefonoExists) {
        res.status(400).json({ message: "El teléfono ya existe." });
        return true;
    }

    // Si no hay conflictos, retornar false
    return false;
};

// Función para validar el formato de las credenciales del usuario
export const validateFormat = (req, res, next) => {
    // Validar las credenciales del nuevo usuario
    if (validateInjections(req, res)) return;
    if (validatePassword(req, res)) return;
    if (validateEmail(req, res)) return;
    if (validatePhone(req, res)) return;
    if (validateRole(req, res)) return;

    // Si no hay conflictos, continuar con la siguiente función
    next();
};

export const validateInjectionsEmail = (req, res, next) => {
    // Validar la el campo de correo de recuperación
    if (validateInjections(req, res)) return;
    if (validateEmail(req, res)) return;

    // Si no hay conflictos, continuar con la siguiente función
    next();
};
