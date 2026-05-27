const pool = require('../config/db');

const obtenerCompras = async () => {
    const [rows] = await pool.query(`
        SELECT c.*, 
               p.nombre as proveedor_nombre, p.apellido as proveedor_apellido,
               a.nombre as admin_nombre, a.apellido as admin_apellido
        FROM Compras_Gym c
        JOIN Usuarios p ON c.FK_id_proveedor = p.PK_id_usuario
        JOIN Usuarios a ON c.FK_id_usuario = a.PK_id_usuario
    `);
    return rows;
};

const obtenerCompraPorId = async (id) => {
    const [compraRows] = await pool.query(`
        SELECT c.*, 
               p.nombre as proveedor_nombre,
               a.nombre as admin_nombre
        FROM Compras_Gym c
        JOIN Usuarios p ON c.FK_id_proveedor = p.PK_id_usuario
        JOIN Usuarios a ON c.FK_id_usuario = a.PK_id_usuario
        WHERE c.PK_id_compra = ?
    `, [id]);

    if (compraRows.length === 0) throw { statusCode: 404, message: 'Compra no encontrada' };

    const compra = compraRows[0];

    const [detallesRows] = await pool.query(`
        SELECT d.*, pr.nombre_producto
        FROM Detalles_compra_stock d
        JOIN Productos pr ON d.FK_id_producto = pr.PK_id_producto
        WHERE d.FK_id_compra = ?
    `, [id]);

    compra.detalles = detallesRows;
    return compra;
};

const crearCompra = async (datos, detalles) => {
    const { FK_id_proveedor, FK_id_usuario, total_compra } = datos;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [resultCompra] = await connection.query(`
            INSERT INTO Compras_Gym (FK_id_proveedor, FK_id_usuario, fecha_compra, total_compra)
            VALUES (?, ?, NOW(), ?)
        `, [FK_id_proveedor, FK_id_usuario, total_compra]);

        const idCompra = resultCompra.insertId;

        for (const detalle of detalles) {
            await connection.query(`
                INSERT INTO Detalles_compra_stock (FK_id_compra, FK_id_producto, cantidad, precio_unidad)
                VALUES (?, ?, ?, ?)
            `, [idCompra, detalle.FK_id_producto, detalle.cantidad, detalle.precio_unidad]);

            await connection.query(`
                UPDATE Productos SET stock = stock + ? WHERE PK_id_producto = ?
            `, [detalle.cantidad, detalle.FK_id_producto]);
        }

        await connection.commit();
        return { id: idCompra, ...datos, detalles };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { obtenerCompras, obtenerCompraPorId, crearCompra };