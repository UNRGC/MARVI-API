-- Zone horaria

SET TIME ZONE 'America/Mexico_City';

-- Tabla roles

CREATE TABLE IF NOT EXISTS roles (
    rol CHAR(1) PRIMARY KEY,
    nombre VARCHAR(14) NOT NULL
);

-- Indices de roles

CREATE INDEX idx_rol_nombre ON roles (nombre);

-- Vistas de roles

CREATE OR REPLACE VIEW vst_roles AS SELECT * FROM roles;

-- Default

INSERT INTO
    roles (rol, nombre)
VALUES ('A', 'Administrador'),
    ('U', 'Usuario'),
    ('I', 'Invitado');

-- Tabla estados

CREATE TABLE IF NOT EXISTS estados_pedidos (
    estado CHAR(1) PRIMARY KEY,
    nombre VARCHAR(14) NOT NULL
);

-- Indices de estados

CREATE INDEX idx_estado_pedido_nombre ON estados_pedidos (nombre);

-- Vistas de estados

CREATE OR REPLACE VIEW vst_estados_pedidos AS
SELECT *
FROM estados_pedidos;

-- Default

INSERT INTO
    estados_pedidos (estado, nombre)
VALUES ('P', 'Pendiente'),
    ('L', 'Listo'),
    ('E', 'Entregado'),
    ('C', 'Cancelado');

-- Tabla unidades

CREATE TABLE IF NOT EXISTS unidades (
    unidad CHAR(3) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Indices de unidades

CREATE INDEX idx_unidad_nombre ON unidades (nombre);

-- Vistas de unidades

CREATE OR REPLACE VIEW vst_unidades AS SELECT * FROM unidades;

-- Funciones de unidades

CREATE OR REPLACE FUNCTION consultar_unidad(
    _unidad CHAR(3)
)
RETURNS TABLE (
    unidad CHAR(3),
    nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            RAISE EXCEPTION 'La unidad es requerida';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_unidades u
        WHERE
            u.unidad = UPPER(_unidad);

        IF total = 0 THEN
            RAISE EXCEPTION 'La unidad no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_unidades u
        WHERE
            u.unidad = UPPER(_unidad);
    END;
$$;

-- Procedimientos de unidades

CREATE OR REPLACE PROCEDURE agregar_unidad(
    _unidad CHAR(3),
    _nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            RAISE EXCEPTION 'La unidad es requerida';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre de la unidad es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_unidades u
        WHERE
            u.unidad = UPPER(_unidad);

        IF total > 0 THEN
            RAISE EXCEPTION 'La unidad ya existe';
        END IF;

        INSERT INTO
            unidades ( unidad, nombre)
        VALUES (
            UPPER(_unidad),
            _nombre
        );

        RAISE NOTICE 'La unidad % se ha agregado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_unidad(
    _unidad CHAR(3),
    _nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            RAISE EXCEPTION 'La unidad es requerida';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre de la unidad es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_unidades u
        WHERE
            u.unidad = UPPER(_unidad);

        IF total = 0 THEN
            RAISE EXCEPTION 'La unidad no existe';
        END IF;

        IF UPPER(_unidad) = 'N/A' THEN
            RAISE EXCEPTION 'La unidad no puede ser actualizada';
        END IF;

        UPDATE unidades
        SET nombre = _nombre
        WHERE unidad = UPPER(_unidad);

        RAISE NOTICE 'La unidad % se actualizo correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_unidad(
    _unidad CHAR(3)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _nombre_unidad VARCHAR(50);
    BEGIN
        IF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            RAISE EXCEPTION 'La unidad es requerida';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_unidades u
        WHERE
            u.unidad = UPPER(_unidad);

        IF total = 0 THEN
            RAISE EXCEPTION 'La unidad no existe';
        END IF;

        IF UPPER(_unidad) = 'N/A' THEN
            RAISE EXCEPTION 'La unidad no puede ser eliminada';
        END IF;

        SELECT
            nombre INTO _nombre_unidad
        FROM
            vst_unidades u
        WHERE
            u.unidad = _unidad;

        DELETE FROM unidades
        WHERE
            unidad = UPPER(_unidad);

        RAISE NOTICE 'La unidad % se ha eliminado correctamente', LOWER(_nombre_unidad);
    END;
$$;

-- Default

INSERT INTO
    unidades (unidad, nombre)
VALUES ('N/A', 'Ninguna'),
    ('KG', 'Kilogramo'),
    ('LT', 'Litro'),
    ('PZA', 'Pieza');

-- Tabla frecuencia_compras

CREATE TABLE IF NOT EXISTS frecuencia_compras (
    frecuencia CHAR(3) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT NULL,
    dias INT NOT NULL
);

-- Indices de frecuencia_compras

CREATE INDEX idx_frecuencia_compras_nombre ON frecuencia_compras (nombre);

CREATE INDEX idx_frecuencia_compras_dias ON frecuencia_compras (dias);

-- Vistas de frecuencia_compras

CREATE OR REPLACE VIEW vst_frecuencia_compras AS
SELECT *
FROM frecuencia_compras;

-- Funciones de frecuencia_compras

CREATE OR REPLACE FUNCTION consultar_frecuencia_compra(
    _frecuencia CHAR(3)
)
RETURNS TABLE (
    frecuencia CHAR(3),
    nombre VARCHAR(50),
    descripcion VARCHAR(100),
    dias INT
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            RAISE EXCEPTION 'La frecuencia de compra es requerida';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_frecuencia_compras f
        WHERE
            f.frecuencia = UPPER(_frecuencia);

        IF total = 0 THEN
            RAISE EXCEPTION 'La frecuencia de compra no existe';
        END IF;

        RETURN QUERY
            SELECT
                *
            FROM
                vst_frecuencia_compras f
            WHERE
                f.frecuencia = UPPER(_frecuencia);
    END;
$$;

-- Procedimientos de frecuencia_compras

CREATE OR REPLACE PROCEDURE agregar_frecuencia_compra(
    _frecuencia CHAR(3),
    _nombre VARCHAR(50),
    _dias INT,
    _descripcion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            RAISE EXCEPTION 'La frecuencia de compra es requerida';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre de la frecuencia de compra es requerido';
        ELSIF _dias IS NULL OR _dias <= 0 THEN
            RAISE EXCEPTION 'Los días de la frecuencia de compra son requeridos y deben ser mayores a cero';
        ELSIF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_frecuencia_compras f
        WHERE
            f.frecuencia = UPPER(_frecuencia);

        IF total > 0 THEN
            RAISE EXCEPTION 'La frecuencia de compra ya existe';
        END IF;

        INSERT INTO
            frecuencia_compras ( frecuencia, nombre,  descripcion, dias)
        VALUES (
            UPPER(_frecuencia),
            _nombre,
            _descripcion,
            _dias
        );

        RAISE NOTICE 'La frecuencia de compra % se ha agregado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_frecuencia_compra(
    _frecuencia CHAR(3),
    _nombre VARCHAR(50),
    _dias INT,
    _descripcion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            RAISE EXCEPTION 'La frecuencia de compra es requerida';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre de la frecuencia de compra es requerido';
        ELSIF _dias IS NULL OR _dias <= 0 THEN
            RAISE EXCEPTION 'Los días de la frecuencia de compra son requeridos y deben ser mayores a cero';
        ELSIF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_frecuencia_compras f
        WHERE
            f.frecuencia = UPPER(_frecuencia);

        IF total = 0 THEN
            RAISE EXCEPTION 'La frecuencia de compra no existe';
        END IF;

        IF UPPER(_frecuencia) = 'N/A' THEN
            RAISE EXCEPTION 'La frecuencia de compra no puede ser actualizada';
        END IF;

        UPDATE frecuencia_compras
        SET
            nombre = _nombre,
            descripcion = _descripcion,
            dias = _dias
        WHERE
            frecuencia = UPPER(_frecuencia);

        RAISE NOTICE 'La frecuencia de compra % se ha actualizado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_frecuencia_compra(
    _frecuencia CHAR(3)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE nombre_frecuencia VARCHAR(50);
    BEGIN
        IF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            RAISE EXCEPTION 'La frecuencia de compra es requerida';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_frecuencia_compras f
        WHERE
            f.frecuencia = UPPER(_frecuencia);

        IF total = 0 THEN
            RAISE EXCEPTION 'La frecuencia de compra no existe';
        END IF;

        IF UPPER(_frecuencia) = 'N/A' THEN
            RAISE EXCEPTION 'La frecuencia de compra no puede ser eliminada';
        END IF;

        SELECT
            nombre INTO nombre_frecuencia
        FROM
            vst_frecuencia_compras f
        WHERE
            f.frecuencia = UPPER(_frecuencia);

        DELETE FROM frecuencia_compras
        WHERE
            frecuencia = UPPER(_frecuencia);

        RAISE NOTICE 'La frecuencia de compra % se ha eliminado correctamente', LOWER(nombre_frecuencia);
    END;
$$;

-- Default

INSERT INTO
    frecuencia_compras (frecuencia, nombre, dias)
VALUES ('N/A', 'Ninguna', 0),
    ('D', 'Diaria', 1),
    ('S', 'Semanal', 7),
    ('Q', 'Quincenal', 15),
    ('M', 'Mensual', 30);

-- Tabla servicios

CREATE TABLE IF NOT EXISTS servicios (
    id_servicio SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    unidad CHAR(3) DEFAULT 'N/A' REFERENCES unidades (unidad) ON DELETE
    SET DEFAULT NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indices de servicios

CREATE INDEX idx_servicio_busqueda ON servicios (
    codigo,
    nombre,
    precio,
    unidad
);

CREATE INDEX idx_servicio_activo ON servicios (activo);

CREATE UNIQUE INDEX unique_servicio_codigo ON servicios (codigo)
WHERE
    activo = TRUE;

-- Vistas de servicios

CREATE OR REPLACE VIEW vst_servicios_activos AS
SELECT s.codigo, s.nombre, s.precio, u.nombre AS nombre_unidad
FROM servicios s
    LEFT JOIN unidades u ON s.unidad = u.unidad
WHERE
    s.activo = TRUE;

CREATE OR REPLACE VIEW vst_servicios AS
SELECT *
FROM servicios
WHERE
    activo = TRUE;

-- Funciones de servicios

CREATE OR REPLACE FUNCTION consultar_servicio(
    _codigo VARCHAR(10)
)
RETURNS TABLE (
    id_servicio INT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    descripcion VARCHAR(100),
    precio DECIMAL(10,2),
    unidad CHAR(3),
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del servicio es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El servicio no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo);
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_servicios(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    precio DECIMAL(10,2),
    nombre_unidad VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda esta vacía';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios_activos s
        WHERE
            s.codigo ILIKE '%' || _busqueda || '%'
            OR s.nombre ILIKE '%' || _busqueda || '%'
            OR s.precio::TEXT ILIKE '%' || _busqueda || '%'
            OR s.nombre_unidad ILIKE '%' || _busqueda || '%';

        RETURN QUERY
        SELECT
            total,
            *
        FROM
            vst_servicios_activos s
        WHERE
            s.codigo ILIKE '%' || _busqueda || '%'
            OR s.nombre ILIKE '%' || _busqueda || '%'
            OR s.precio::TEXT ILIKE '%' || _busqueda || '%'
            OR s.nombre_unidad ILIKE '%' || _busqueda || '%'
        LIMIT _limit
        OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_servicios(
    _columna_orden VARCHAR(15) DEFAULT 'nombre',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    precio DECIMAL(10,2),
    nombre_unidad VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios_activos;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_servicios_activos
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de servicios

CREATE OR REPLACE PROCEDURE registrar_servicio(
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _precio DECIMAL(10,2),
    _unidad CHAR(3) DEFAULT 'N/A',
    _descripcion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del servicio es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del servicio es requerido';
        ELSIF _precio IS NULL OR _precio <= 0 THEN
            RAISE EXCEPTION 'El precio del servicio es requerido y debe ser mayor a cero';
        ELSIF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            _unidad := 'N/A';
        ELSIF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo);

        IF total > 0 THEN
            RAISE EXCEPTION 'El código del servicio ya existe';
        END IF;

        INSERT INTO
            servicios ( codigo, nombre, descripcion, precio, unidad)
        VALUES (
            UPPER(_codigo),
            _nombre,
            _descripcion,
            _precio,
            UPPER(_unidad)
        );

        RAISE NOTICE 'El servicio % se ha agregado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_servicio(
    _id_servicio INT,
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _precio DOUBLE PRECISION,
    _unidad CHAR(3) DEFAULT 'N/A',
    _descripcion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_servicio IS NULL OR _id_servicio <= 0 THEN
            RAISE EXCEPTION 'El identificador del servicio es requerido';
        ELSIF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del servicio es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del servicio es requerido';
        ELSIF _precio IS NULL OR _precio <= 0 THEN
            RAISE EXCEPTION 'El precio del servicio es requerido y debe ser mayor a cero';
        ELSIF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            _unidad := 'N/A';
        ELSIF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios s
        WHERE
            s.id_servicio = _id_servicio;

        IF total = 0 THEN
            RAISE EXCEPTION 'El servicio no existe';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo) AND s.id_servicio <> _id_servicio;

        IF total > 0 THEN
            RAISE EXCEPTION 'El código del servicio ya existe';
        END IF;

        UPDATE servicios
        SET
            codigo = UPPER(_codigo),
            nombre = _nombre,
            descripcion = _descripcion,
            precio = _precio,
            unidad = UPPER(_unidad)
        WHERE
            id_servicio = _id_servicio;

        RAISE NOTICE 'El servicio % se ha actualizado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_servicio(
    _codigo VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _nombre_servicio VARCHAR(50);
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del servicio es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El servicio no existe';
        END IF;

        SELECT
            nombre INTO _nombre_servicio
        FROM
            vst_servicios s
        WHERE
            s.codigo = UPPER(_codigo);

        UPDATE
            servicios
        SET
            activo = FALSE
        WHERE
            codigo = UPPER(_codigo);

        RAISE NOTICE 'El servicio % se ha eliminado correctamente', LOWER(_nombre_servicio);
    END;
$$;

-- Tabla clientes

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) DEFAULT NULL,
    telefono VARCHAR(10) DEFAULT NULL,
    correo VARCHAR(100) DEFAULT NULL,
    contrasena TEXT DEFAULT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE NOT NULL,
    foto_src TEXT DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indices de clientes

CREATE INDEX idx_cliente_busqueda ON clientes (
    codigo,
    nombre,
    primer_apellido,
    segundo_apellido,
    correo,
    telefono,
    fecha_registro
);

CREATE INDEX idx_cliente_activo ON clientes (activo);

CREATE UNIQUE INDEX unique_cliente_codigo ON clientes (codigo)
WHERE
    activo = TRUE;

-- Vistas de clientes

CREATE OR REPLACE VIEW vst_clientes_activos AS
    SELECT
        codigo,
        CONCAT(nombre, ' ', primer_apellido, ' ', segundo_apellido)::VARCHAR(150) AS nombre_completo,
        telefono,
        correo,
        fecha_registro
    FROM
        clientes
    WHERE
        activo = TRUE;

CREATE OR REPLACE VIEW vst_clientes AS
SELECT *
FROM clientes
WHERE
    activo = TRUE;

-- Funciones de clientes

CREATE OR REPLACE FUNCTION iniciar_sesion_clientes (
    _correo VARCHAR(100)
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE contrasena TEXT;
    BEGIN
        IF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo electrónico es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.correo = _correo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe';
        END IF;

        SELECT
            c.contrasena INTO contrasena
        FROM
            vst_clientes c
        WHERE
            c.correo = _correo;

        RETURN contrasena;
    END;
$$;

CREATE OR REPLACE FUNCTION recuperar_contrasena_cliente(
    _correo VARCHAR(100),
    _contrasena TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo electrónico es obligatorio';
        ELSIF _contrasena IS NULL OR TRIM(_contrasena) = '' THEN
            RAISE EXCEPTION 'La nueva contraseña es obligatoria';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.correo = _correo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe';
        END IF;

        UPDATE clientes
        SET contrasena = _contrasena
        WHERE correo = _correo;

        RETURN 'Contraseña actualizada correctamente';
    END;
$$;

CREATE OR REPLACE FUNCTION consultar_correo_cliente(
    _correo VARCHAR(100)
)
RETURNS TABLE (
    id_cliente INT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    telefono VARCHAR(10),
    correo VARCHAR(100),
    contrasena TEXT,
    fecha_registro DATE,
    foto_src TEXT,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo electrónico del cliente es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.correo = _correo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El correo electrónico no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_clientes c
        WHERE
            c.correo = _correo;
    END;
$$;

CREATE OR REPLACE FUNCTION consultar_cliente(
    _codigo VARCHAR(10)
)
RETURNS TABLE (
    id_cliente INT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    telefono VARCHAR(10),
    correo VARCHAR(100),
    contrasena TEXT,
    fecha_registro DATE,
    foto_src TEXT,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del cliente es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El cliente no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo;
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_clientes(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre_completo VARCHAR(150),
    telefono VARCHAR(10),
    correo VARCHAR(100),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda esta vacía';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes_activos c
        WHERE
            c.codigo ILIKE '%' || _busqueda || '%'
            OR c.nombre_completo ILIKE '%' || _busqueda || '%'
            OR c.telefono ILIKE '%' || _busqueda || '%'
            OR c.correo ILIKE '%' || _busqueda || '%'
            OR c.fecha_registro::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
        SELECT
            total,
            *
        FROM
            vst_clientes_activos c
        WHERE
            c.codigo ILIKE '%' || _busqueda || '%'
            OR c.nombre_completo ILIKE '%' || _busqueda || '%'
            OR c.telefono ILIKE '%' || _busqueda || '%'
            OR c.correo ILIKE '%' || _busqueda || '%'
            OR c.fecha_registro::TEXT ILIKE '%' || _busqueda || '%'
        LIMIT _limit
        OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_clientes(
    _columna_orden VARCHAR(15) DEFAULT 'fecha_registro',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre_completo VARCHAR(150),
    telefono VARCHAR(10),
    correo VARCHAR(100),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes_activos;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_clientes_activos
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de clientes

CREATE OR REPLACE PROCEDURE registrar_cliente(
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _primer_apellido VARCHAR(50),
    _segundo_apellido VARCHAR(50) DEFAULT NULL,
    _telefono VARCHAR(10) DEFAULT NULL,
    _correo VARCHAR(100) DEFAULT NULL,
    _contrasena TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del cliente es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del cliente es requerido';
        ELSIF _primer_apellido IS NULL OR TRIM(_primer_apellido) = '' THEN
            RAISE EXCEPTION 'El primer apellido del cliente es requerido';
        ELSIF _segundo_apellido IS NOT NULL AND TRIM(_segundo_apellido) = '' THEN
            _segundo_apellido := NULL;
        END IF;

        IF _telefono IS NOT NULL AND TRIM(_telefono) <> '' THEN
            IF _telefono !~ '^[0-9]{10}$' THEN
                RAISE EXCEPTION 'El teléfono del cliente no tiene un formato válido';
            END IF;
        ELSE
            _telefono := NULL;
        END IF;

        IF _correo IS NOT NULL AND TRIM(_correo) <> '' THEN
            IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
                RAISE EXCEPTION 'El correo del cliente no tiene un formato válido';
            END IF;
        ELSE
            _correo := NULL;
        END IF;

        IF _contrasena IS NOT NULL AND TRIM(_contrasena) <> '' THEN
            IF LENGTH(_contrasena) < 8 THEN
                RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
            END IF;
        ELSE
            _contrasena := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo
            OR c.telefono = _telefono
            OR c.correo = _correo;

        IF total > 0 THEN
            RAISE EXCEPTION 'El usuario, correo o teléfono ya existen';
        END IF;

        INSERT INTO
            clientes (codigo, nombre, primer_apellido, segundo_apellido, telefono, correo, contrasena)
        VALUES (
            _codigo,
            _nombre,
            _primer_apellido,
            _segundo_apellido,
            _telefono,
            _correo,
            _contrasena
        );

        RAISE NOTICE 'El cliente % se ha registrado correctamente', CONCAT(_nombre, ' ', _primer_apellido);
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_cliente(
    _id_cliente INT,
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _primer_apellido VARCHAR(50),
    _segundo_apellido VARCHAR(50) DEFAULT NULL,
    _telefono VARCHAR(10) DEFAULT NULL,
    _correo VARCHAR(100) DEFAULT NULL,
    _contrasena TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_cliente IS NULL OR _id_cliente <= 0 THEN
            RAISE EXCEPTION 'El identificador del cliente es requerido';
        ELSIF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del cliente es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del cliente es requerido';
        ELSIF _primer_apellido IS NULL OR TRIM(_primer_apellido) = '' THEN
            RAISE EXCEPTION 'El primer apellido del cliente es requerido';
        ELSIF _segundo_apellido IS NOT NULL AND TRIM(_segundo_apellido) = '' THEN
            _segundo_apellido := NULL;
        END IF;

        IF _telefono IS NOT NULL AND TRIM(_telefono) <> '' THEN
            IF _telefono !~ '^[0-9]{10,12}$' THEN
                RAISE EXCEPTION 'El teléfono del cliente no tiene un formato válido';
            END IF;
        ELSE
            _telefono := NULL;
        END IF;

        IF _correo IS NOT NULL AND TRIM(_correo) <> '' THEN
            IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
                RAISE EXCEPTION 'El correo del cliente no tiene un formato válido';
            END IF;
        ELSE
            _correo := NULL;
        END IF;

        IF _contrasena IS NOT NULL AND TRIM(_contrasena) <> '' THEN
            IF LENGTH(_contrasena) < 8 THEN
                RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
            END IF;
        ELSE
            _contrasena := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.id_cliente = _id_cliente;

        IF total = 0 THEN
            RAISE EXCEPTION 'El cliente no existe';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo AND c.id_cliente <> _id_cliente;
        IF total > 0 THEN
            RAISE EXCEPTION 'El código del cliente ya se encuentra registrado';
        END IF;

        UPDATE clientes
        SET
            codigo = _codigo,
            nombre = _nombre,
            primer_apellido = _primer_apellido,
            segundo_apellido = _segundo_apellido,
            telefono = _telefono,
            correo = _correo,
            contrasena = _contrasena
        WHERE
            id_cliente = _id_cliente;

        RAISE NOTICE 'El cliente % se ha actualizado correctamente', CONCAT(_nombre, ' ', _primer_apellido);
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_cliente(
    _codigo VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _nombre_cliente VARCHAR(100);
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El codigo del cliente es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El cliente no existe';
        END IF;

        SELECT
            CONCAT(nombre, ' ', primer_apellido) INTO _nombre_cliente
        FROM
            vst_clientes c
        WHERE
            c.codigo = _codigo;

        UPDATE
            clientes
        SET
            activo = FALSE
        WHERE
            codigo = _codigo;

        RAISE NOTICE 'El cliente % se ha eliminado correctamente', _nombre_cliente;
    END;
$$;

-- Default

INSERT INTO
    clientes (
        codigo,
        nombre,
        primer_apellido
    )
VALUES (
        'PUBLICOGNR',
        'Público',
        'General'
    );

-- Tabla productos

CREATE TABLE IF NOT EXISTS productos (
    id_producto SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) DEFAULT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    unidad CHAR(3) DEFAULT 'N/A' REFERENCES unidades (unidad) ON DELETE
    SET DEFAULT NOT NULL,
    recordatorio BOOLEAN DEFAULT FALSE NOT NULL,
    frecuencia CHAR(3) DEFAULT 'N/A' REFERENCES frecuencia_compras (frecuencia) ON DELETE
    SET DEFAULT NOT NULL,
    ultima_compra DATE DEFAULT NULL,
    proxima_compra DATE DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indices de productos

CREATE INDEX idx_producto_busqueda ON productos (
    codigo,
    nombre,
    precio,
    unidad,
    frecuencia,
    ultima_compra
);

CREATE INDEX idx_productos_recordatorio ON productos (recordatorio);

CREATE INDEX idx_productos_proxima_compra ON productos (proxima_compra);

CREATE INDEX idx_productos_activo ON productos (activo);

CREATE UNIQUE INDEX unique_producto_codigo ON productos (codigo)
WHERE
    activo = TRUE;

-- Vistas de productos

CREATE OR REPLACE VIEW vst_productos_activos AS
SELECT
    p.codigo,
    p.nombre,
    p.precio,
    u.nombre AS nombre_unidad,
    f.nombre AS nombre_frecuencia,
    p.ultima_compra
FROM
    productos p
    LEFT JOIN unidades u ON p.unidad = u.unidad
    LEFT JOIN frecuencia_compras f ON p.frecuencia = f.frecuencia
WHERE
    p.activo = TRUE;

CREATE OR REPLACE VIEW vst_productos AS
SELECT *
FROM productos
WHERE
    activo = TRUE;

-- Funciones de productos

CREATE OR REPLACE FUNCTION consultar_producto(
    _codigo VARCHAR(10)
)
RETURNS TABLE (
    id_producto INT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    descripcion VARCHAR(100),
    precio DECIMAL(10, 2),
    unidad CHAR(3),
    recordatorio BOOLEAN,
    frecuencia CHAR(3),
    ultima_compra DATE,
    proxima_compra DATE,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del producto es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El producto no existe';
        END IF;

        RETURN QUERY
            SELECT
                *
            FROM
                vst_productos p
            WHERE
                p.codigo = UPPER(_codigo);
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_productos(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    precio DECIMAL(10, 2),
    nombre_unidad VARCHAR(50),
    nombre_frecuencia VARCHAR(50),
    ultima_compra DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda esta vacía';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos_activos p
        WHERE
            p.codigo ILIKE '%' || _busqueda || '%'
            OR p.nombre ILIKE '%' || _busqueda || '%'
            OR p.precio::TEXT ILIKE '%' || _busqueda || '%'
            OR p.nombre_unidad ILIKE '%' || _busqueda || '%'
            OR p.nombre_frecuencia ILIKE '%' || _busqueda || '%'
            OR p.ultima_compra::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
            SELECT
                total,
                *
            FROM
                vst_productos_activos p
            WHERE
                p.codigo ILIKE '%' || _busqueda || '%'
                OR p.nombre ILIKE '%' || _busqueda || '%'
                OR p.precio::TEXT ILIKE '%' || _busqueda || '%'
                OR p.nombre_unidad ILIKE '%' || _busqueda || '%'
                OR p.nombre_frecuencia ILIKE '%' || _busqueda || '%'
                OR p.ultima_compra::TEXT ILIKE '%' || _busqueda || '%'
            LIMIT _limit
            OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_productos(
    _columna_orden VARCHAR(15) DEFAULT 'nombre',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    precio DECIMAL(10,2),
    nombre_unidad VARCHAR(50),
    nombre_frecuencia VARCHAR(50),
    ultima_compra DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos_activos;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_productos_activos
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de productos

CREATE OR REPLACE PROCEDURE registrar_producto(
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _precio DECIMAL(10, 2),
    _unidad CHAR(3) DEFAULT 'N/A',
    _descripcion VARCHAR(100) DEFAULT NULL,
    _recordatorio BOOLEAN DEFAULT FALSE,
    _frecuencia CHAR(3) DEFAULT 'N/A'
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del producto es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del producto es requerido';
        ELSIF _precio IS NULL OR _precio <= 0 THEN
            RAISE EXCEPTION 'El precio del producto es requerido y debe ser mayor a cero';
        END IF;


        IF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            _unidad := 'N/A';
        ELSIF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        ELSIF _recordatorio IS NULL THEN
            _recordatorio := FALSE;
        ELSIF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            _frecuencia := 'N/A';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total > 0 THEN
            RAISE EXCEPTION 'El producto ya existe';
        END IF;

        INSERT INTO
            productos (codigo, nombre, descripcion, precio, unidad, recordatorio, frecuencia)
        VALUES (
            UPPER(_codigo),
            _nombre,
            _descripcion,
            _precio,
            UPPER(_unidad),
            _recordatorio,
            UPPER(_frecuencia)
        );

        RAISE NOTICE 'El producto % se ha registrado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_producto(
    _id_producto INT,
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _precio DECIMAL(10, 2),
    _unidad CHAR(3) DEFAULT 'N/A',
    _descripcion VARCHAR(100) DEFAULT NULL,
    _recordatorio BOOLEAN DEFAULT FALSE,
    _frecuencia CHAR(3) DEFAULT 'N/A'
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_producto IS NULL OR _id_producto <= 0 THEN
            RAISE EXCEPTION 'El identificador del producto es requerido';
        ELSIF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del producto es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del producto es requerido';
        ELSIF _precio IS NULL OR _precio <= 0 THEN
            RAISE EXCEPTION 'El precio del producto es requerido y debe ser mayor a cero';
        END IF;

        IF _descripcion IS NOT NULL AND TRIM(_descripcion) = '' THEN
            _descripcion := NULL;
        ELSIF _unidad IS NULL OR TRIM(_unidad) = '' THEN
            _unidad := 'N/A';
        ELSIF _recordatorio IS NULL THEN
            _recordatorio := FALSE;
        ELSIF _frecuencia IS NULL OR TRIM(_frecuencia) = '' THEN
            _frecuencia := 'N/A';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.id_producto = _id_producto;

        IF total = 0 THEN
            RAISE EXCEPTION 'El producto no existe';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo) AND p.id_producto <> _id_producto;

        IF total > 0 THEN
            RAISE EXCEPTION 'El código del producto ya existe';
        END IF;

        UPDATE productos
        SET
            codigo = UPPER(_codigo),
            nombre = _nombre,
            descripcion = _descripcion,
            precio = _precio,
            unidad = UPPER(_unidad),
            recordatorio = _recordatorio,
            frecuencia = UPPER(_frecuencia)
        WHERE
            id_producto = _id_producto;

        RAISE NOTICE 'El producto % se ha actualizado correctamente', LOWER(_nombre);
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_producto(
    _codigo VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _nombre_producto VARCHAR(50);
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del producto es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El producto no existe';
        END IF;

        SELECT
            nombre INTO _nombre_producto
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        UPDATE
            productos
        SET
            activo = FALSE
        WHERE
            codigo = UPPER(_codigo);

        RAISE NOTICE 'El producto % se ha eliminado correctamente', LOWER(_nombre_producto);
    END;
$$;

CREATE OR REPLACE PROCEDURE proxima_compra(
    _codigo VARCHAR(10),
    _proxima_compra DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE nombre_producto VARCHAR(50);
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del producto es requerido';
        ELSIF _proxima_compra IS NULL THEN
            RAISE EXCEPTION 'La fecha de proxima compra es requerida';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El producto no existe';
        END IF;

        SELECT
            p.nombre INTO nombre_producto
        FROM
            vst_productos p
        WHERE
            p.codigo = UPPER(_codigo);

        UPDATE
            productos
        SET
            proxima_compra = _proxima_compra
        WHERE
            codigo = UPPER(_codigo);

        RAISE NOTICE 'El producto % se ha actualizado correctamente', LOWER(nombre_producto);
    END;
$$;

-- Tabla proveedores

CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) DEFAULT NULL,
    telefono VARCHAR(10) DEFAULT NULL,
    direccion VARCHAR(100) DEFAULT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indices de proveedores

CREATE INDEX idx_proveedor_busqueda ON proveedores (
    codigo,
    nombre,
    correo,
    telefono,
    fecha_registro
);

CREATE INDEX idx_proveedor_activo ON proveedores (activo);

CREATE UNIQUE INDEX unique_proveedor_codigo ON proveedores (codigo)
WHERE
    activo = TRUE;

-- Vistas de proveedores

CREATE OR REPLACE VIEW vst_proveedores_activos AS
SELECT
    codigo,
    nombre,
    correo,
    telefono,
    fecha_registro
FROM proveedores
WHERE
    activo = TRUE;

CREATE OR REPLACE VIEW vst_proveedores AS
SELECT *
FROM proveedores
WHERE
    activo = TRUE;

-- Funciones de proveedores

CREATE OR REPLACE FUNCTION consultar_proveedor(
    _codigo VARCHAR(10)
)
RETURNS TABLE (
    id_proveedor INT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(10),
    direccion VARCHAR(100),
    fecha_registro DATE,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del proveedor es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.codigo = _codigo;

        IF total = 0 THEN
            RAISE EXCEPTION 'El proveedor no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_proveedores p
        WHERE
            p.codigo = _codigo;
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_proveedores(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(10),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda está vacía';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.codigo ILIKE '%' || _busqueda || '%'
            OR p.nombre ILIKE '%' || _busqueda || '%'
            OR p.correo ILIKE '%' || _busqueda || '%'
            OR p.telefono ILIKE '%' || _busqueda || '%'
            OR p.fecha_registro::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
            SELECT
                total,
                *
            FROM
                vst_proveedores_activos p
            WHERE
                p.codigo ILIKE '%' || _busqueda || '%'
                OR p.nombre ILIKE '%' || _busqueda || '%'
                OR p.correo ILIKE '%' || _busqueda || '%'
                OR p.telefono ILIKE '%' || _busqueda || '%'
                OR p.fecha_registro::TEXT ILIKE '%' || _busqueda || '%'
            LIMIT _limit
            OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_proveedores(
    _columna_orden VARCHAR(15) DEFAULT 'nombre',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    codigo VARCHAR(10),
    nombre VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(10),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores_activos;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_proveedores_activos
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de proveedores

CREATE OR REPLACE PROCEDURE registrar_proveedor(
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _correo VARCHAR(100) DEFAULT NULL,
    _telefono VARCHAR(10) DEFAULT NULL,
    _direccion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del proveedor es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del proveedor es requerido';
        ELSIF _direccion IS NOT NULL AND TRIM(_direccion) = '' THEN
            _direccion := NULL;
        END IF;

        IF _correo IS NOT NULL AND TRIM(_correo) <> '' THEN
            IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
                RAISE EXCEPTION 'El correo del proveedor no tiene un formato válido';
            END IF;
        ELSIF _telefono IS NOT NULL AND TRIM(_telefono) <> '' THEN
            IF _telefono !~ '^[0-9]{10,10}$' THEN
                RAISE EXCEPTION 'El teléfono del proveedor no tiene un formato válido';
            END IF;
        ELSE
            _correo := NULL;
            _telefono := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total > 0 THEN
            RAISE EXCEPTION 'El código del proveedor ya existe';
        END IF;

        INSERT INTO
            proveedores ( codigo, nombre, correo, telefono, direccion)
        VALUES (
            UPPER(_codigo),
            _nombre,
            _correo,
            _telefono,
            _direccion
        );

        RAISE NOTICE 'El proveedor % se ha registrado correctamente', _nombre;
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_proveedor(
    _id_proveedor INT,
    _codigo VARCHAR(10),
    _nombre VARCHAR(50),
    _correo VARCHAR(100) DEFAULT NULL,
    _telefono VARCHAR(10) DEFAULT NULL,
    _direccion VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_proveedor IS NULL OR _id_proveedor <= 0 THEN
            RAISE EXCEPTION 'El identificador del proveedor es requerido';
        ELSIF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del proveedor es requerido';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre del proveedor es requerido';
        ELSIF _direccion IS NOT NULL AND TRIM(_direccion) = '' THEN
            _direccion := NULL;
        END IF;

        IF _correo IS NOT NULL AND TRIM(_correo) <> '' THEN
            IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
                RAISE EXCEPTION 'El correo del proveedor no tiene un formato válido';
            END IF;
        ELSIF _telefono IS NOT NULL AND TRIM(_telefono) <> '' THEN
            IF _telefono !~ '^[0-9]{10,10}$' THEN
                RAISE EXCEPTION 'El teléfono del proveedor no tiene un formato válido';
            END IF;
        ELSE
            _correo := NULL;
            _telefono := NULL;
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.id_proveedor = _id_proveedor;

        IF total = 0 THEN
            RAISE EXCEPTION 'El proveedor no existe';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.codigo = UPPER(_codigo) AND p.id_proveedor <> _id_proveedor;

        IF total > 0 THEN
            RAISE EXCEPTION 'El código del proveedor ya existe';
        END IF;

        UPDATE proveedores
        SET
            codigo = UPPER(_codigo),
            nombre = _nombre,
            correo = _correo,
            telefono = _telefono,
            direccion = _direccion
        WHERE
            id_proveedor = _id_proveedor;

        RAISE NOTICE 'El proveedor % se ha actualizado correctamente', _nombre;
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_proveedor(
    _codigo VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _nombre_proveedor VARCHAR(50);
    BEGIN
        IF _codigo IS NULL OR TRIM(_codigo) = '' THEN
            RAISE EXCEPTION 'El código del proveedor es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_proveedores p
        WHERE
            p.codigo = UPPER(_codigo);

        IF total = 0 THEN
            RAISE EXCEPTION 'El proveedor no existe';
        END IF;

        SELECT
            nombre INTO _nombre_proveedor
        FROM
            vst_proveedores p
        WHERE
            p.codigo = UPPER(_codigo);

        UPDATE
            proveedores
        SET
            activo = FALSE
        WHERE
            codigo = UPPER(_codigo);

        RAISE NOTICE 'El proveedor % se ha eliminado correctamente', _nombre_proveedor;
    END;
$$;

-- Tabla usuarios

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(20) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    contrasena TEXT DEFAULT '12345678' NOT NULL,
    temporal BOOLEAN DEFAULT TRUE NOT NULL,
    rol CHAR(1) DEFAULT 'U' REFERENCES roles (rol) NOT NULL,
    estado VARCHAR(8) CHECK (
        estado IN ('Activo', 'Inactivo')
    ) DEFAULT 'Inactivo' NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE NOT NULL,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    foto_src TEXT DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Índices de usuarios

CREATE INDEX idx_usuario_busqueda ON usuarios (
    usuario,
    nombre,
    primer_apellido,
    segundo_apellido,
    correo,
    estado,
    fecha_registro
);

CREATE INDEX idx_usuario_activo ON usuarios (activo);

CREATE UNIQUE INDEX unique_usuario_usuario ON usuarios (usuario)
WHERE
    activo = TRUE;

CREATE UNIQUE INDEX unique_usuario_correo ON usuarios (correo)
WHERE
    activo = TRUE;

CREATE UNIQUE INDEX unique_usuario_telefono ON usuarios (telefono)
WHERE
    activo = TRUE;

-- Vistas de usuarios

CREATE OR REPLACE VIEW vst_usuarios_logueados AS
SELECT
    u.usuario,
    CONCAT(
        u.nombre,
        ' ',
        u.primer_apellido
    ) AS nombre_usuario,
    r.nombre AS rol_usuario,
    u.ultima_actividad
FROM usuarios u
    LEFT JOIN roles r ON u.rol = r.rol
WHERE
    u.estado = 'Activo';

CREATE OR REPLACE VIEW vst_usuarios_activos AS
SELECT
    u.usuario,
    CONCAT(
        u.nombre,
        ' ',
        u.primer_apellido,
        ' ',
        u.segundo_apellido
    )::VARCHAR(150) AS nombre_completo,
    u.correo,
    r.nombre::VARCHAR(14) AS rol_usuario,
    u.estado,
    u.fecha_registro
FROM usuarios u
    LEFT JOIN roles r ON u.rol = r.rol
WHERE
    u.activo = TRUE;

CREATE OR REPLACE VIEW vst_usuarios AS
SELECT *
FROM usuarios
WHERE
    activo = TRUE;

-- Funciones de usuarios

CREATE OR REPLACE FUNCTION iniciar_sesion_usuarios (
    _usuario VARCHAR(20)
)
RETURNS TABLE(
    contrasena TEXT,
    temporal BOOLEAN,
    estado VARCHAR(8)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe';
        END IF;

        RETURN QUERY
            SELECT
                u.contrasena,
                u.temporal,
                u.estado
            FROM
                vst_usuarios u
            WHERE
                u.usuario = _usuario;
    END;
$$;

CREATE OR REPLACE FUNCTION recuperar_contrasena_usuario (
    _correo VARCHAR(100)
)
RETURNS TABLE (
    contrasena VARCHAR(8)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    DECLARE _temporal VARCHAR(8);
    BEGIN
        IF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.correo = _correo AND u.estado = 'Inactivo';

        IF total = 0 THEN
            RAISE EXCEPTION 'El correo no existe';
        END IF;

        SELECT
            SUBSTR(MD5(RANDOM()::TEXT), 0, 9) INTO _temporal;

        UPDATE
            usuarios
        SET
            contrasena = _temporal, temporal = TRUE
        WHERE
            correo = _correo;

        RETURN QUERY
        SELECT
            _temporal;
    END;
$$;

CREATE OR REPLACE FUNCTION consultar_usuario (
    _usuario VARCHAR(20)
)
RETURNS TABLE (
    id_usuario INT,
    usuario VARCHAR(20),
    nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(10),
    contrasena TEXT,
    temporal BOOLEAN,
    rol CHAR(1),
    estado VARCHAR(8),
    fecha_registro DATE,
    ultima_actividad TIMESTAMP,
    foto_src TEXT,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario;
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_usuarios(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    usuario VARCHAR(20),
    nombre_completo VARCHAR(150),
    correo VARCHAR(100),
    rol_usuario VARCHAR(14),
    estado VARCHAR(8),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda está vacía';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios_activos u
        WHERE
            u.usuario ILIKE '%' || _busqueda || '%'
            OR u.nombre_completo ILIKE '%' || _busqueda || '%'
            OR u.correo ILIKE '%' || _busqueda || '%'
            OR u.rol_usuario ILIKE '%' || _busqueda || '%'
            OR u.estado ILIKE '%' || _busqueda || '%'
            OR u.fecha_registro::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
            SELECT
                total,
                *
            FROM
                vst_usuarios_activos u
            WHERE
                u.usuario ILIKE '%' || _busqueda || '%'
                OR u.nombre_completo ILIKE '%' || _busqueda || '%'
                OR u.correo ILIKE '%' || _busqueda || '%'
                OR u.rol_usuario ILIKE '%' || _busqueda || '%'
                OR u.estado ILIKE '%' || _busqueda || '%'
                OR u.fecha_registro::TEXT ILIKE '%' || _busqueda || '%'
            LIMIT _limit
            OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_usuarios(
    _columna_orden VARCHAR(15) DEFAULT 'nombre_completo',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    usuario VARCHAR(20),
    nombre_completo VARCHAR(150),
    correo VARCHAR(100),
    rol_usuario VARCHAR(14),
    estado VARCHAR(8),
    fecha_registro DATE
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios_activos;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_usuarios_activos
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de usuarios

CREATE OR REPLACE PROCEDURE registrar_usuario (
    _usuario VARCHAR(20),
    _nombre VARCHAR(50),
    _primer_apellido VARCHAR(50),
    _segundo_apellido VARCHAR(50),
    _correo VARCHAR(100),
    _telefono VARCHAR(10),
    _rol CHAR(1) DEFAULT 'U'
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre es obligatorio';
        ELSIF _primer_apellido IS NULL OR TRIM(_primer_apellido) = '' THEN
            RAISE EXCEPTION 'El primer apellido es obligatorio';
        ELSIF _segundo_apellido IS NULL OR TRIM(_segundo_apellido) = '' THEN
            RAISE EXCEPTION 'El segundo apellido es obligatorio';
        ELSIF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo es obligatorio';
        ELSIF _telefono IS NULL OR TRIM(_telefono) = '' THEN
            RAISE EXCEPTION 'El teléfono es obligatorio';
        END IF;

        IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
            RAISE EXCEPTION 'El correo no tiene un formato válido';
        ELSIF _telefono !~ '^[0-9]{10,10}$' THEN
            RAISE EXCEPTION 'El teléfono no tiene un formato válido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario OR u.correo = _correo OR u.telefono = _telefono;

        IF total > 0 THEN
            RAISE EXCEPTION 'El usuario, correo o teléfono ya existen';
        END IF;

        INSERT INTO
            usuarios (usuario, nombre, primer_apellido, segundo_apellido, correo, telefono, rol)
        VALUES (
            _usuario,
            _nombre,
            _primer_apellido,
            _segundo_apellido,
            _correo,
            _telefono,
            _rol
        );

        RAISE NOTICE 'El usuario % se ha creado correctamente', _usuario;
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_usuario (
    _id_usuario INT,
    _usuario VARCHAR(20),
    _nombre VARCHAR(50),
    _primer_apellido VARCHAR(50),
    _segundo_apellido VARCHAR(50),
    _correo VARCHAR(100),
    _telefono VARCHAR(10),
    _contrasena TEXT,
    _estado VARCHAR(8),
    _foto_src TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_usuario IS NULL OR _id_usuario <= 0 THEN
            RAISE EXCEPTION 'El identificador del usuario es obligatorio';
        ELSIF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        ELSIF _nombre IS NULL OR TRIM(_nombre) = '' THEN
            RAISE EXCEPTION 'El nombre es obligatorio';
        ELSIF _primer_apellido IS NULL OR TRIM(_primer_apellido) = '' THEN
            RAISE EXCEPTION 'El primer apellido es obligatorio';
        ELSIF _segundo_apellido IS NULL OR TRIM(_segundo_apellido) = '' THEN
            RAISE EXCEPTION 'El segundo apellido es obligatorio';
        ELSIF _correo IS NULL OR TRIM(_correo) = '' THEN
            RAISE EXCEPTION 'El correo es obligatorio';
        ELSIF _telefono IS NULL OR TRIM(_telefono) = '' THEN
            RAISE EXCEPTION 'El teléfono es obligatorio';
        ELSIF _contrasena IS NULL OR TRIM(_contrasena) = '' THEN
            RAISE EXCEPTION 'La contraseña es obligatoria';
        END IF;

        IF _correo !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
            RAISE EXCEPTION 'El correo no tiene un formato válido';
        ELSIF _telefono !~ '^[0-9]{10,10}$' THEN
            RAISE EXCEPTION 'El teléfono no tiene un formato válido';
        END IF;

        SELECT COUNT(*) INTO total
            FROM vst_usuarios u
        WHERE
            u.id_usuario = _id_usuario;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario AND u.id_usuario <> _id_usuario OR u.correo = _correo AND u.id_usuario <> _id_usuario OR u.telefono = _telefono AND u.id_usuario <> _id_usuario;

        IF total > 0 THEN
            RAISE EXCEPTION 'El usuario, correo o teléfono ya existen';
        END IF;

        UPDATE
            usuarios
        SET
            usuario = _usuario,
            nombre = _nombre,
            primer_apellido = _primer_apellido,
            segundo_apellido = _segundo_apellido,
            correo = _correo,
            telefono = _telefono,
            contrasena = _contrasena,
            temporal = FALSE,
            estado = _estado,
            foto_src = _foto_src
        WHERE
            id_usuario = _id_usuario;

        RAISE NOTICE 'El usuario % se ha actualizado correctamente', _usuario;
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_usuario (
    _usuario VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario AND u.estado = 'Inactivo';

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe o esta siendo utilizado';
        END IF;

        IF (SELECT
                u.id_usuario
            FROM
                vst_usuarios u
            WHERE
                u.usuario = _usuario) = 1 THEN
            RAISE EXCEPTION 'No se puede eliminar el usuario administrador';
        END IF;

        UPDATE
            usuarios
        SET
            activo = FALSE
        WHERE
            usuario = _usuario;

        RAISE NOTICE 'El usuario % se ha eliminado correctamente', _usuario;
    END;
$$;

CREATE OR REPLACE PROCEDURE cambiar_rol_usuario (
    _usuario VARCHAR(20),
    _rol CHAR(1)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        ELSIF _rol IS NULL OR TRIM(_rol) = '' THEN
            RAISE EXCEPTION 'El rol es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario AND u.estado = 'Inactivo';

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe o esta siendo utilizado';
        END IF;

        UPDATE
            usuarios
        SET
            rol = _rol
        WHERE
            usuario = _usuario;

        RAISE NOTICE 'El usuario % se ha actualizado correctamente', _usuario;
    END;
$$;

CREATE OR REPLACE PROCEDURE cambiar_estado_usuario (
    _usuario VARCHAR(20),
    _estado VARCHAR(8)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _usuario IS NULL OR TRIM(_usuario) = '' THEN
            RAISE EXCEPTION 'El usuario es obligatorio';
        ELSIF _estado IS NULL OR TRIM(_estado) = '' THEN
            RAISE EXCEPTION 'El estado es obligatorio';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_usuarios u
        WHERE
            u.usuario = _usuario AND u.estado <> _estado;

        IF total = 0 THEN
            RAISE EXCEPTION 'El usuario no existe o se encuentra %', LOWER(_estado);
        END IF;

        UPDATE
            usuarios
        SET
            estado = _estado
        WHERE
            usuario = _usuario;

        IF _estado = 'Inactivo' THEN
            RAISE NOTICE 'El usuario % ha cerrado sesión correctamente', _usuario;
        ELSE
            RAISE NOTICE 'El usuario % ha iniciado sesión correctamente', _usuario;
        END IF;
    END;
$$;

CREATE OR REPLACE PROCEDURE cerrar_sesiones ()
LANGUAGE plpgsql
AS $$
    BEGIN
        UPDATE
            usuarios
        SET
            estado = 'Inactivo'
        WHERE
            estado = 'Activo';

        RAISE NOTICE 'Las sesiones se han cerrado correctamente';
    END;
$$;

-- Default

INSERT INTO
    usuarios (
        usuario,
        nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        telefono,
        rol
    )
VALUES (
        'admin',
        'Administrador',
        'Sistema',
        'Web',
        'admin@admin.com',
        '1234567890',
        'A'
    );

-- Tabla compras

CREATE TABLE IF NOT EXISTS compras (
    id_compra SERIAL PRIMARY KEY,
    id_proveedor INT REFERENCES proveedores (id_proveedor) NOT NULL,
    fecha_compra DATE DEFAULT CURRENT_DATE NOT NULL,
    observaciones VARCHAR(100) DEFAULT NULL,
    id_usuario INT REFERENCES usuarios (id_usuario) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Tabla de detalles

CREATE TABLE IF NOT EXISTS detalles_compra (
    id_detalle SERIAL PRIMARY KEY,
    id_compra INT REFERENCES compras (id_compra) NOT NULL,
    id_producto INT REFERENCES productos (id_producto) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

-- Indices de compras

CREATE INDEX idx_compra_busqueda ON compras (
    fecha_compra,
    id_proveedor,
    id_usuario,
    total
);

CREATE INDEX idx_compra_activo ON compras (activo);

-- Indices de detalles

CREATE INDEX idx_detalle_compra ON detalles_compra (id_compra);

CREATE INDEX idx_detalle_producto ON detalles_compra (id_producto);

CREATE INDEX idx_detalle_subtotal_compra ON detalles_compra (subtotal);

-- Vistas de compras

CREATE OR REPLACE VIEW vst_compras_activas AS
SELECT
    id_compra,
    c.fecha_compra,
    p.nombre::VARCHAR(50) AS proveedor,
    u.nombre::VARCHAR(20) AS usuario,
    c.total
FROM
    compras c
    LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
WHERE
    c.activo = TRUE;

CREATE OR REPLACE VIEW vst_compras AS
SELECT c.id_compra, c.id_proveedor, p.nombre::VARCHAR(50) AS proveedor, c.fecha_compra, c.observaciones, c.id_usuario, c.total, c.activo
FROM compras c
    LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
WHERE
    c.activo = TRUE;

CREATE OR REPLACE VIEW vst_detalles_compra AS
SELECT dc.id_compra, dc.id_producto, p.nombre::VARCHAR(50) AS producto, dc.cantidad, dc.precio_unitario, dc.subtotal
FROM
    detalles_compra dc
    LEFT JOIN productos p ON dc.id_producto = p.id_producto;

-- Funciones de compras

CREATE OR REPLACE FUNCTION consultar_compra(
    _id_compra INT
)
RETURNS TABLE (
    id_compra INT,
    id_proveedor INT,
    proveedor VARCHAR(50),
    fecha_compra DATE,
    observaciones VARCHAR(100),
    id_usuario INT,
    total DECIMAL(10, 2),
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_compra IS NULL OR _id_compra <= 0 THEN
            RAISE EXCEPTION 'El identificador de la compra es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_compras c
        WHERE
            c.id_compra = _id_compra;

        IF total = 0 THEN
            RAISE EXCEPTION 'La compra no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_compras c
        WHERE
            c.id_compra = _id_compra;
    END;
$$;

CREATE OR REPLACE FUNCTION consultar_detalles_compra(
    _id_compra INT
)
RETURNS TABLE (
    id_compra INT,
    id_producto INT,
    producto VARCHAR(50),
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    subtotal DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_compra IS NULL OR _id_compra <= 0 THEN
            RAISE EXCEPTION 'El identificador de la compra es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_compras c
        WHERE
            c.id_compra = _id_compra;

        IF total = 0 THEN
            RAISE EXCEPTION 'La compra no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_detalles_compra dc
        WHERE
            dc.id_compra = _id_compra;
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_compras(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    id_compra INT,
    fecha_compra DATE,
    proveedor VARCHAR(50),
    usuario VARCHAR(20),
    total_compra DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE _total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda está vacía';
        END IF;

        SELECT
            COUNT(*) INTO _total
        FROM
            vst_compras_activas c
        WHERE
            c.id_compra::TEXT ILIKE '%' || _busqueda || '%' OR
            c.fecha_compra::TEXT ILIKE '%' || _busqueda || '%' OR
            c.proveedor ILIKE '%' || _busqueda || '%' OR
            c.usuario ILIKE '%' || _busqueda || '%' OR
            c.total::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
            SELECT
                _total,
                *
            FROM
                vst_compras_activas c
            WHERE
                c.id_compra::TEXT ILIKE '%' || _busqueda || '%' OR
                c.fecha_compra::TEXT ILIKE '%' || _busqueda || '%' OR
                c.proveedor ILIKE '%' || _busqueda || '%' OR
                c.usuario ILIKE '%' || _busqueda || '%' OR
                c.total::TEXT ILIKE '%' || _busqueda || '%'
            LIMIT _limit
            OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_compras(
    _fecha_desde DATE DEFAULT CURRENT_DATE - 365,
    _fecha_hasta DATE DEFAULT CURRENT_DATE + 365,
    _columna_orden VARCHAR(15) DEFAULT 'fecha_compra',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    id_compra INT,
    fecha_compra DATE,
    proveedor VARCHAR(50),
    usuario VARCHAR(20),
    total_compra DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_compras_activas c
        WHERE
            c.fecha_compra BETWEEN _fecha_desde AND _fecha_hasta;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_compras_activas c
            WHERE
                c.fecha_compra BETWEEN %L AND %L
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _fecha_desde, _fecha_hasta, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de compras

CREATE OR REPLACE PROCEDURE registrar_compra(
    _id_proveedor INT,
    _id_usuario INT,
    _detalles JSONB,
    _observaciones VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE
        _id_compra INT;
        producto JSONB;
    BEGIN
        IF _id_proveedor IS NULL OR _id_proveedor <= 0 THEN
            RAISE EXCEPTION 'El proveedor es requerido';
        ELSIF _id_usuario IS NULL OR _id_usuario <= 0 THEN
            RAISE EXCEPTION 'El usuario es requerido';
        ELSIF _detalles IS NULL OR JSONB_ARRAY_LENGTH(_detalles) = 0 THEN
            RAISE EXCEPTION 'Los detalles de la compra son requeridos';
        END IF;

        INSERT INTO
            compras (id_proveedor, id_usuario, observaciones, total)
        VALUES (
                _id_proveedor,
                _id_usuario,
                _observaciones,
                0
        )
        RETURNING
            id_compra INTO _id_compra;

        FOR producto IN
            SELECT * FROM JSONB_ARRAY_ELEMENTS(_detalles)
        LOOP
            INSERT INTO detalles_compra (id_compra, id_producto, cantidad, precio_unitario)
            VALUES (
                _id_compra,
                (producto->>'id_producto')::INT,
                (producto->>'cantidad')::INT,
                (producto->>'precio_unitario')::DECIMAL(10, 2)
            );
        END LOOP;

        UPDATE compras
        SET total = (
            SELECT
                SUM(dc.subtotal)
            FROM
                detalles_compra dc
            WHERE
                dc.id_compra = _id_compra
        )
        WHERE
            id_compra = _id_compra;

        RAISE NOTICE 'La compra % se ha registrado correctamente', _id_compra;
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_compra(
    _id_compra INT
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_compra IS NULL OR _id_compra <= 0 THEN
            RAISE EXCEPTION 'El identificador de la compra es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_compras c
        WHERE
            c.id_compra = _id_compra;

        IF total = 0 THEN
            RAISE EXCEPTION 'La compra no existe';
        END IF;

        UPDATE
            compras
        SET
            activo = FALSE
        WHERE
            id_compra = _id_compra;

        RAISE NOTICE 'La compra % se ha eliminado correctamente', _id_compra;
    END;
$$;

-- Tabla pedidos

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES clientes (id_cliente) NOT NULL,
    fecha_pedido DATE DEFAULT CURRENT_DATE NOT NULL,
    fecha_entrega DATE DEFAULT CURRENT_DATE + 1 NOT NULL,
    estado CHAR(1) REFERENCES estados_pedidos (estado) DEFAULT 'P' NOT NULL,
    observaciones VARCHAR(100) DEFAULT NULL,
    id_usuario INT REFERENCES usuarios (id_usuario) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

-- Tabla de detalles

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos (id_pedido) NOT NULL,
    id_servicio INT REFERENCES servicios (id_servicio) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

-- Índices de pedidos

CREATE INDEX idx_pedido_busqueda ON pedidos (
    fecha_pedido,
    id_cliente,
    id_usuario,
    estado,
    total
);

CREATE INDEX idx_pedido_activo ON pedidos (activo);

-- Índices de detalles

CREATE INDEX idx_detalle_pedido ON detalles_pedido (id_pedido);

CREATE INDEX idx_detalle_servicio ON detalles_pedido (id_servicio);

CREATE INDEX idx_detalle_subtotal_pedido ON detalles_pedido (subtotal);

-- Vistas de pedidos

CREATE OR REPLACE VIEW vst_pedidos_activos AS
SELECT
    id_pedido,
    p.fecha_pedido,
    CONCAT(
        c.nombre,
        ' ',
        c.primer_apellido,
        ' ',
        c.segundo_apellido
    )::VARCHAR(150) AS cliente,
    u.nombre::VARCHAR(20) AS usuario,
    e.nombre::VARCHAR(14) AS estado,
    p.total
FROM
    pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN estados_pedidos e ON p.estado = e.estado
WHERE
    p.activo = TRUE;

CREATE OR REPLACE VIEW vst_pedidos AS
SELECT p.id_pedido, p.id_cliente, c.nombre::VARCHAR(50) AS cliente, p.fecha_pedido, p.fecha_entrega, p.estado, p.observaciones, p.id_usuario, p.total, p.activo
FROM pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
WHERE
    p.activo = TRUE;

CREATE OR REPLACE VIEW vst_detalles_pedido AS
SELECT dp.id_pedido, dp.id_servicio, s.nombre::VARCHAR(50) AS servicio, dp.cantidad, dp.precio_unitario, dp.subtotal
FROM
    detalles_pedido dp
    LEFT JOIN servicios s ON dp.id_servicio = s.id_servicio;

-- Funciones de pedidos

CREATE OR REPLACE FUNCTION consultar_pedido(
    _id_pedido INT
)
RETURNS TABLE (
    id_pedido INT,
    id_cliente INT,
    cliente VARCHAR(50),
    fecha_pedido DATE,
    fecha_entrega DATE,
    estado CHAR(1),
    observaciones VARCHAR(100),
    id_usuario INT,
    total DECIMAL(10, 2),
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_pedido IS NULL OR _id_pedido <= 0 THEN
            RAISE EXCEPTION 'El identificador del pedido es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_pedidos p
        WHERE
            p.id_pedido = _id_pedido;

        IF total = 0 THEN
            RAISE EXCEPTION 'El pedido no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_pedidos p
        WHERE
            p.id_pedido = _id_pedido;
    END;
$$;

CREATE OR REPLACE FUNCTION consultar_detalles_pedido(
    _id_pedido INT
)
RETURNS TABLE (
    id_pedido INT,
    id_servicio INT,
    servicio VARCHAR(50),
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    subtotal DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_pedido IS NULL OR _id_pedido <= 0 THEN
            RAISE EXCEPTION 'El identificador del pedido es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_pedidos p
        WHERE
            p.id_pedido = _id_pedido;

        IF total = 0 THEN
            RAISE EXCEPTION 'El pedido no existe';
        END IF;

        RETURN QUERY
        SELECT
            *
        FROM
            vst_detalles_pedido dp
        WHERE
            dp.id_pedido = _id_pedido;
    END;
$$;

CREATE OR REPLACE FUNCTION buscar_pedidos(
    _busqueda TEXT,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    id_pedido INT,
    fecha_pedido DATE,
    cliente VARCHAR(150),
    usuario VARCHAR(20),
    estado VARCHAR(14),
    total_pedido DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE _total BIGINT;
    BEGIN
        IF _busqueda IS NULL OR TRIM(_busqueda) = '' THEN
            RAISE EXCEPTION 'La búsqueda está vacía';
        END IF;

        SELECT
            COUNT(*) INTO _total
        FROM
            vst_pedidos_activos p
        WHERE
            p.id_pedido::TEXT ILIKE '%' || _busqueda || '%' OR
            p.fecha_pedido::TEXT ILIKE '%' || _busqueda || '%' OR
            p.cliente ILIKE '%' || _busqueda || '%' OR
            p.usuario ILIKE '%' || _busqueda || '%' OR
            p.total::TEXT ILIKE '%' || _busqueda || '%';

        RETURN QUERY
            SELECT
                _total,
                *
            FROM
                vst_pedidos_activos p
            WHERE
                p.id_pedido::TEXT ILIKE '%' || _busqueda || '%' OR
                p.fecha_pedido::TEXT ILIKE '%' || _busqueda || '%' OR
                p.cliente ILIKE '%' || _busqueda || '%' OR
                p.usuario ILIKE '%' || _busqueda || '%' OR
                p.total::TEXT ILIKE '%' || _busqueda || '%'
            LIMIT _limit
            OFFSET _offset;
    END;
$$;

CREATE OR REPLACE FUNCTION filtrar_pedidos(
    _fecha_desde DATE DEFAULT CURRENT_DATE - 365,
    _fecha_hasta DATE DEFAULT CURRENT_DATE + 365,
    _columna_orden VARCHAR(15) DEFAULT 'fecha_pedido',
    _orden VARCHAR(4) DEFAULT 'ASC',
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    total BIGINT,
    id_pedido INT,
    fecha_pedido DATE,
    cliente VARCHAR(150),
    usuario VARCHAR(20),
    estado VARCHAR(14),
    total_pedido DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
    DECLARE total BIGINT;
    DECLARE consulta TEXT;
    BEGIN
        SELECT
            COUNT(*) INTO total
        FROM
            vst_pedidos_activos p
        WHERE
            p.fecha_pedido BETWEEN _fecha_desde AND _fecha_hasta;

        consulta := format('
            SELECT
                %L::BIGINT,
                *
            FROM
                vst_pedidos_activos p
            WHERE
                p.fecha_pedido BETWEEN %L AND %L
            ORDER BY
                %I %s
            LIMIT %L
            OFFSET %L',
            total, _fecha_desde, _fecha_hasta, _columna_orden, _orden, _limit, _offset);

        RETURN QUERY EXECUTE consulta;
    END;
$$;

-- Procedimientos de pedidos

CREATE OR REPLACE PROCEDURE registrar_pedido(
    _id_cliente INT,
    _id_usuario INT,
    _detalles JSONB,
    _fecha_entrega DATE DEFAULT CURRENT_DATE + 1,
    _observaciones VARCHAR(100) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
    DECLARE
        _id_pedido INT;
        servicio JSONB;
    BEGIN
        IF _id_cliente IS NULL OR _id_cliente <= 0 THEN
            RAISE EXCEPTION 'El cliente es requerido';
        ELSIF _id_usuario IS NULL OR _id_usuario <= 0 THEN
            RAISE EXCEPTION 'El usuario es requerido';
        ELSIF _detalles IS NULL OR JSONB_ARRAY_LENGTH(_detalles) = 0 THEN
            RAISE EXCEPTION 'Los detalles del pedido son requeridos';
        END IF;

        INSERT INTO
            pedidos (id_cliente, id_usuario, fecha_entrega, observaciones, total)
        VALUES (
                _id_cliente,
                _id_usuario,
                _fecha_entrega,
                _observaciones,
                0
        )
        RETURNING
            id_pedido INTO _id_pedido;

        FOR servicio IN
            SELECT * FROM JSONB_ARRAY_ELEMENTS(_detalles)
        LOOP
            INSERT INTO detalles_pedido (id_pedido, id_servicio, cantidad, precio_unitario)
            VALUES (
                _id_pedido,
                (servicio->>'id_servicio')::INT,
                (servicio->>'cantidad')::INT,
                (servicio->>'precio_unitario')::DECIMAL(10, 2)
            );
        END LOOP;

        UPDATE pedidos
        SET total = (
            SELECT
                SUM(dp.subtotal)
            FROM
                detalles_pedido dp
            WHERE
                dp.id_pedido = _id_pedido
        )
        WHERE
            id_pedido = _id_pedido;

        RAISE NOTICE 'El pedido % se ha creado correctamente', _id_pedido;
    END;
$$;

CREATE OR REPLACE PROCEDURE eliminar_pedido(
    _id_pedido INT
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_pedido IS NULL OR _id_pedido <= 0 THEN
            RAISE EXCEPTION 'El identificador del pedido es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            vst_pedidos p
        WHERE
            p.id_pedido = _id_pedido;

        IF total = 0 THEN
            RAISE EXCEPTION 'El pedido no existe';
        END IF;

        UPDATE
            pedidos
        SET
            activo = FALSE
        WHERE
            id_pedido = _id_pedido;

        RAISE NOTICE 'El pedido % se ha eliminado correctamente', _id_pedido;
    END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_estado_pedido(
    _id_pedido INT,
    _estado CHAR(1)
)
LANGUAGE plpgsql
AS $$
    DECLARE total INT;
    BEGIN
        IF _id_pedido IS NULL OR _id_pedido <= 0 THEN
            RAISE EXCEPTION 'El identificador del pedido es requerido';
        ELSIF _estado IS NULL OR TRIM(_estado) = '' THEN
            RAISE EXCEPTION 'El estado del pedido es requerido';
        END IF;

        SELECT
            COUNT(*) INTO total
        FROM
            pedidos p
        WHERE
            p.id_pedido = _id_pedido;

        IF total = 0 THEN
            RAISE EXCEPTION 'El pedido no existe';
        END IF;

        UPDATE
            pedidos
        SET
            estado = _estado
        WHERE
            id_pedido = _id_pedido;
    END;
$$;

-- Tabla actividades

CREATE TABLE IF NOT EXISTS actividades (
    id_actividad SERIAL PRIMARY KEY,
    id_Usuario INT REFERENCES usuarios (id_usuario) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices de actividades

CREATE INDEX idx_accion_usuario ON actividades (accion);

CREATE INDEX idx_fecha_actividad ON actividades (fecha);

-- Vistas de actividades

CREATE OR REPLACE VIEW vst_actividades AS
SELECT u.usuario::VARCHAR(20) AS usuario, a.accion, a.fecha
FROM actividades a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario;

-- Triggers de usuarios

CREATE OR REPLACE FUNCTION ultima_actividad_usuario()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_actividad := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_ultima_actividad_usuario
BEFORE INSERT OR UPDATE
    ON usuarios
FOR EACH ROW
EXECUTE FUNCTION
    ultima_actividad_usuario();

-- Trigger de actividades

CREATE OR REPLACE FUNCTION registrar_actividad_compras()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE accion VARCHAR(255);
    BEGIN
        IF TG_OP = 'INSERT' THEN
            accion := 'Registro la compra ' || NEW.id_compra;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
                accion := 'Elimino la compra ' || OLD.id_compra;
            ELSIF OLD.total = 0 AND NEW.total > 0 THEN
                accion := 'Actualizo los detalles de la compra ' || NEW.id_compra;
            ELSE
                accion := 'Actualizo la compra ' || NEW.id_compra;
            END IF;
        ELSE
            accion := 'Elimino la compra ' || OLD.id_compra;
        END IF;

        INSERT INTO actividades (id_usuario, accion)
        VALUES (NEW.id_usuario, accion);

        RETURN NEW;
    END;
$$;

CREATE TRIGGER tr_actividades_compras
AFTER
    INSERT OR UPDATE OR DELETE
ON compras
FOR EACH ROW
EXECUTE FUNCTION
    registrar_actividad_compras();

CREATE OR REPLACE FUNCTION registrar_actividad_pedidos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE accion VARCHAR(255);
    BEGIN
        IF TG_OP = 'INSERT' THEN
            accion := 'Registro el pedido ' || NEW.id_pedido;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
                accion := 'Elimino el pedido ' || OLD.id_pedido;
            ELSIF OLD.total = 0 AND NEW.total > 0 THEN
                accion := 'Actualizo los detalles del pedido ' || NEW.id_pedido;
            ELSE
                accion := 'Actualizo el pedido ' || NEW.id_pedido;
            END IF;
        ELSE
            accion := 'Elimino el pedido ' || OLD.id_pedido;
        END IF;

        INSERT INTO actividades (id_usuario, accion)
        VALUES (NEW.id_usuario, accion);

        RETURN NEW;
    END;
$$;

CREATE TRIGGER tr_actividades_pedidos
AFTER
    INSERT OR UPDATE OR DELETE
ON pedidos
FOR EACH ROW
EXECUTE FUNCTION
    registrar_actividad_pedidos();