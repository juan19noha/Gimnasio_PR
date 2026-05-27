CREATE DATABASE Gimnasio_PR;
USE Gimnasio_PR;

CREATE TABLE Roles(
    PK_id_rol INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(150) NOT NULL
);

CREATE TABLE Planes(
    PK_id_Plan INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(150) NOT NULL,
    descripcion_plan TEXT,
    precio_plan DECIMAL(10,2) NOT NULL
);

CREATE TABLE Categorias(
    PK_id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(200) NOT NULL,
    tipo_categoria ENUM('Producto','Clases') NOT NULL,
    descripcion_categoria TEXT
);

CREATE TABLE Productos(
    PK_id_producto INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_categoria INT UNSIGNED NOT NULL,
    nombre_producto VARCHAR(150),
    stock INT NOT NULL,
    precio_producto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    promociones VARCHAR(150) NOT NULL,
    FOREIGN KEY(FK_id_categoria) REFERENCES Categorias(PK_id_categoria)
);

CREATE TABLE Ejercicios(
    PK_id_ejercicio INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_ejercicio VARCHAR(150) NOT NULL,
    tecnicas TEXT,
    musculo_a_trabajar VARCHAR(150) NOT NULL,
    tiempo_duracion VARCHAR(150) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Eventos(
    PK_id_evento INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_evento VARCHAR(150),
    fecha_hora DATETIME NOT NULL,
    lugar VARCHAR(200),
    asistencia INT,
    descripcion_evento TEXT
);

CREATE TABLE Usuarios(
    PK_id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_rol INT UNSIGNED NOT NULL,
    tipo_documento VARCHAR(150),
    numero_documento VARCHAR(20),
    nombre VARCHAR(200),
    apellido VARCHAR(200),
    sexo VARCHAR(20),
    correo VARCHAR(200) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    -- Campos específicos de instructores
    especialidad VARCHAR(150),
    horario_laboral VARCHAR(150),
    salario DECIMAL(10,2),
    puntuacion VARCHAR(150),
    descripcion TEXT,
    -- Campos específicos de proveedores
    nombre_empresa VARCHAR(200),
    direccion VARCHAR(200),
    FOREIGN KEY(FK_id_rol) REFERENCES Roles(PK_id_rol),
    INDEX idx_usuario_correo (correo)
);

CREATE TABLE Suscripciones(
    PK_id_suscripcion INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_usuario INT UNSIGNED NOT NULL,
    FK_id_plan INT UNSIGNED NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(150),
    tipo_menbresia BIGINT NOT NULL,
    precio_suscripcion DECIMAL(10,2) NOT NULL,
    duracion_plan INT NOT NULL,
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_plan) REFERENCES Planes(PK_id_Plan)
);

CREATE TABLE Facturas(
    PK_id_factura INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_suscripcion INT UNSIGNED NOT NULL,
    FK_id_usuario INT UNSIGNED NOT NULL,
    numero_factura VARCHAR(200) NOT NULL,
    fecha_emision DATETIME NOT NULL,
    metodo_pago VARCHAR(200) NOT NULL,
    total_pagado DECIMAL(10,2) NOT NULL,
    devolucion DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(FK_id_suscripcion) REFERENCES Suscripciones(PK_id_suscripcion),
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario)
);

CREATE TABLE Clases(
    PK_id_clase INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_instructor INT UNSIGNED NOT NULL,
    FK_id_categoria INT UNSIGNED NOT NULL,
    nombre_clase VARCHAR(150),
    fecha_hora DATETIME NOT NULL,
    capacidad_maxima INT,
    lugar VARCHAR(200),
    descripcion_clase TEXT,
    FOREIGN KEY(FK_id_instructor) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_categoria) REFERENCES Categorias(PK_id_categoria)
);

CREATE TABLE Asistencias(
    PK_id_asistencia INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_usuario INT UNSIGNED NOT NULL,
    FK_id_clase INT UNSIGNED NOT NULL,
    fecha_horario_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_clase) REFERENCES Clases(PK_id_clase)
);

CREATE TABLE Rutinas(
    PK_id_rutina INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_usuario INT UNSIGNED NOT NULL,
    nombre_rutina VARCHAR(200),
    objetivo VARCHAR(200),
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario)
);

CREATE TABLE Detalle_rutinas(
    PK_id_detalle INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_rutina INT UNSIGNED NOT NULL,
    FK_id_ejercicio INT UNSIGNED NOT NULL,
    series INT NOT NULL,
    repeticiones INT NOT NULL,
    tiempo_descanso VARCHAR(100) NOT NULL,
    FOREIGN KEY(FK_id_rutina) REFERENCES Rutinas(PK_id_rutina),
    FOREIGN KEY(FK_id_ejercicio) REFERENCES Ejercicios(PK_id_ejercicio)
);

CREATE TABLE Dietas(
    PK_id_dieta INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_usuario INT UNSIGNED NOT NULL,
    FK_id_producto INT UNSIGNED NOT NULL,
    nombre_dieta VARCHAR(200),
    objetivo_calorias VARCHAR(150),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_producto) REFERENCES Productos(PK_id_producto)
);

CREATE TABLE Detalle_dietas(
    PK_id_detalle INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_dieta INT UNSIGNED NOT NULL,
    horario_comida DATETIME,
    alimento VARCHAR(200),
    cantidad_gramos VARCHAR(200),
    calorias_alimento VARCHAR(150),
    FOREIGN KEY(FK_id_dieta) REFERENCES Dietas(PK_id_dieta)
);

CREATE TABLE Compras_Gym(
    PK_id_compra INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_proveedor INT UNSIGNED NOT NULL,
    FK_id_usuario INT UNSIGNED NOT NULL,
    fecha_compra DATETIME NOT NULL,
    total_compra DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(FK_id_proveedor) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario)
);

CREATE TABLE Detalles_compra_stock(
    PK_id_detalles INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_compra INT UNSIGNED NOT NULL,
    FK_id_producto INT UNSIGNED NOT NULL,
    cantidad INT NOT NULL,
    precio_unidad DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(FK_id_compra) REFERENCES Compras_Gym(PK_id_compra),
    FOREIGN KEY(FK_id_producto) REFERENCES Productos(PK_id_producto)
);

CREATE TABLE Detalle_Venta_producto(
    PK_id_detalle INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FK_id_usuario INT UNSIGNED NOT NULL,
    FK_id_producto INT UNSIGNED NOT NULL,
    FK_id_evento INT UNSIGNED,
    cantidad INT NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(FK_id_usuario) REFERENCES Usuarios(PK_id_usuario),
    FOREIGN KEY(FK_id_producto) REFERENCES Productos(PK_id_producto),
    FOREIGN KEY(FK_id_evento) REFERENCES Eventos(PK_id_evento)
);

-- Datos iniciales
INSERT INTO Roles (nombre_rol) VALUES ('Administrador'), ('Instructor'), ('Usuario'), ('Proveedor');