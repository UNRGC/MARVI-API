CREATE TABLE roles (rol CHAR(1) UNIQUE NOT NULL, nombre VARCHAR(14) NOT NULL, PRIMARY KEY (rol));

INSERT INTO roles (rol, nombre) VALUES ('A', 'Administrador'), ('U', 'Usuario'), ('I', 'Invitado');

CREATE TABLE usuarios (id_usuario SERIAL, usuario VARCHAR(20) UNIQUE NOT NULL, nombre VARCHAR(50) NOT NULL, primer_apellido VARCHAR(50) NOT NULL, segundo_apellido VARCHAR(50) NOT NULL, correo VARCHAR(50) UNIQUE NOT NULL, telefono VARCHAR(17) UNIQUE NOT NULL, contrasena TEXT NOT NULL, rol CHAR(1) NOT NULL, estado VARCHAR(8) CHECK (estado IN ('Activo', 'Inactivo')) DEFAULT 'Inactivo', foto_src TEXT, PRIMARY KEY (id_usuario), FOREIGN KEY (rol) REFERENCES roles (rol) ON DELETE CASCADE);

CREATE VIEW vst_usuarios AS SELECT usuario, correo, telefono FROM usuarios;

SELECT COUNT(*) FROM usuarios;

DELETE FROM usuarios;

ALTER SEQUENCE usuarios_id_usuario_seq RESTART WITH 1;

CREATE TABLE tokens (id_usuario INT NOT NULL, refresh_token TEXT NOT NULL UNIQUE, creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expira TIMESTAMP NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE);

CREATE PROCEDURE resetStatus (estado VARCHAR(8)) LANGUAGE sql AS $$ UPDATE usuarios SET estado = $1 WHERE estado = 'Activo' $$;

CALL resetStatus('Inactivo');