const pool = require('../config/db');

const obtenerProveedores = async () => {
    const [rows] = await pool.query('SELECT * FROM Proveedores');
    return rows;
};

const obtenerProveedorPorId = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Proveedores WHERE PK_id_proveedor = ?', [id]);
    if (rows.length === 0) throw { statusCode: 404, message: 'Proveedor no encontrado' };
    return rows[0];
};

const crearProveedor = async (datos) => {
    const { nombre_empresa, contacto, telefono, direccion, correo } = datos;
    const [result] = await pool.query(
        'INSERT INTO Proveedores (nombre_empresa, contacto, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?)',
        [nombre_empresa, contacto, telefono, direccion, correo]
    );
    return { id: result.insertId, ...datos };
};

const actualizarProveedor = async (id, datos) => {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    const [result] = await pool.query(`UPDATE Proveedores SET ${setClause} WHERE PK_id_proveedor = ?`, [...valores, id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Proveedor no encontrado' };
    return result;
};

const eliminarProveedor = async (id) => {
    const [result] = await pool.query('DELETE FROM Proveedores WHERE PK_id_proveedor = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Proveedor no encontrado' };
    return result;
};

module.exports = { obtenerProveedores, obtenerProveedorPorId, crearProveedor, actualizarProveedor, eliminarProveedor };