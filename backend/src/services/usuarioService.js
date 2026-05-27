const pool = require('../config/db');

const obtenerusuarios = async () => {
    const [rows] = await pool.query(`
        SELECT u.PK_id_usuario, u.nombre, u.apellido, u.correo, u.telefono, 
               u.tipo_documento, u.numero_documento, u.sexo, r.nombre_rol
        FROM usuarios u
        JOIN roles r ON u.FK_id_rol = r.PK_id_rol
    `);
    return rows;
};

const obtenerUsuarioPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT u.PK_id_usuario, u.nombre, u.apellido, u.correo, u.telefono, 
               u.tipo_documento, u.numero_documento, u.sexo, r.nombre_rol
        FROM usuarios u
        JOIN roles r ON u.FK_id_rol = r.PK_id_rol
        WHERE u.PK_id_usuario = ?
    `, [id]);
    if (rows.length === 0) {
        throw { statusCode: 404, message: 'Usuario no encontrado' };
    }
    return rows[0];
};

const actualizarUsuario = async (id, datos) => {
    const { nombre, apellido, telefono, sexo } = datos;
    const [result] = await pool.query(
        'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, sexo = ? WHERE PK_id_usuario = ?',
        [nombre, apellido, telefono, sexo, id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Usuario no encontrado' };
    }
    return result;
};

const eliminarUsuario = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM usuarios WHERE PK_id_usuario = ?', [id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Usuario no encontrado' };
    }
    return result;
};

module.exports = { obtenerusuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };