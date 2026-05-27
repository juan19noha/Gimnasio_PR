const pool = require('../config/db');

const obtenerFacturas = async () => {
    const [rows] = await pool.query(`
        SELECT f.*, 
               u.nombre as usuario_nombre, u.apellido as usuario_apellido,
               p.nombre_plan
        FROM Facturas f
        JOIN Suscripciones s ON f.FK_id_suscripcion = s.PK_id_suscripcion
        JOIN Usuarios u ON f.FK_id_usuario = u.PK_id_usuario
        JOIN Planes p ON s.FK_id_plan = p.PK_id_Plan
    `);
    return rows;
};

const obtenerFacturaPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT f.*, 
               u.nombre as usuario_nombre, u.apellido as usuario_apellido,
               p.nombre_plan
        FROM Facturas f
        JOIN Suscripciones s ON f.FK_id_suscripcion = s.PK_id_suscripcion
        JOIN Usuarios u ON f.FK_id_usuario = u.PK_id_usuario
        JOIN Planes p ON s.FK_id_plan = p.PK_id_Plan
        WHERE f.PK_id_factura = ?
    `, [id]);
    if (rows.length === 0) throw { statusCode: 404, message: 'Factura no encontrada' };
    return rows[0];
};

const obtenerFacturasPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT f.*, p.nombre_plan
        FROM Facturas f
        JOIN Suscripciones s ON f.FK_id_suscripcion = s.PK_id_suscripcion
        JOIN Planes p ON s.FK_id_plan = p.PK_id_Plan
        WHERE f.FK_id_usuario = ?
    `, [idUsuario]);
    return rows;
};

const crearFactura = async (datos) => {
    const { FK_id_suscripcion, FK_id_usuario, numero_factura, metodo_pago, total_pagado, devolucion } = datos;
    const [result] = await pool.query(`
        INSERT INTO Facturas (FK_id_suscripcion, FK_id_usuario, numero_factura, fecha_emision, metodo_pago, total_pagado, devolucion)
        VALUES (?, ?, ?, NOW(), ?, ?, ?)
    `, [FK_id_suscripcion, FK_id_usuario, numero_factura, metodo_pago, total_pagado, devolucion || 0]);
    return { id: result.insertId, ...datos, fecha_emision: new Date() };
};

module.exports = { obtenerFacturas, obtenerFacturaPorId, obtenerFacturasPorUsuario, crearFactura };