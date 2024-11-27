CREATE TABLE roles (
    rol VARCHAR(15) PRIMARY KEY UNIQUE NOT NULL
);
INSERT INTO roles (rol) VALUES ('Administrador');
INSERT INTO roles (rol) VALUES ('Usuario');
INSERT INTO roles (rol) VALUES ('Invitado');

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR (50) NOT NULL,
    correo VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(17),
    contrasena TEXT NOT NULL,
    foto_src TEXT,
    rol VARCHAR(15) REFERENCES roles(rol) NOT NULL
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL UNIQUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira TIMESTAMP NOT NULL
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    accion VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(20) NOT NULL REFERENCES usuarios(usuario) ON DELETE CASCADE
);