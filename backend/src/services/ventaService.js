const pool = require('../config/db');

const obtenerVentas = async () => {
    const [rows] = await pool.query(`
        SELECT v.*, 
               u.nombre as usuario_nombre, u.apellido as usuario_apellido,
               p.nombre_producto,
               e.nombre_evento
        FROM detalle_venta_producto v
        JOIN usuarios u ON v.FK_id_usuario = u.PK_id_usuario
        JOIN productos p ON v.FK_id_producto = p.PK_id_producto
        LEFT JOIN eventos e ON v.FK_id_evento = e.PK_id_evento
    `);
    return rows;
};

const obtenerVentasPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT v.*, p.nombre_producto, e.nombre_evento
        FROM detalle_venta_producto v
        JOIN productos p ON v.FK_id_producto = p.PK_id_producto
        LEFT JOIN eventos e ON v.FK_id_evento = e.PK_id_evento
        WHERE v.FK_id_usuario = ?
    `, [idUsuario]);
    return rows;
};

const crearVenta = async (datos) => {
    const { FK_id_usuario, FK_id_producto, FK_id_evento, cantidad, total } = datos;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [producto] = await connection.query('SELECT stock FROM productos WHERE PK_id_producto = ?', [FK_id_producto]);
        if (producto[0].stock < cantidad) throw { statusCode: 400, message: 'Stock insuficiente' };
        const [result] = await connection.query(`
            INSERT INTO detalle_venta_producto (FK_id_usuario, FK_id_producto, FK_id_evento, cantidad, total)
            VALUES (?, ?, ?, ?, ?)
        `, [FK_id_usuario, FK_id_producto, FK_id_evento || null, cantidad, total]);
        await connection.query('UPDATE productos SET stock = stock - ? WHERE PK_id_producto = ?', [cantidad, FK_id_producto]);
        await connection.commit();
        return { id: result.insertId, ...datos, fecha_venta: new Date() };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { obtenerVentas, obtenerVentasPorUsuario, crearVenta };