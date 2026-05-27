const pool = require('../config/db');

const obtenerasistencias = async () => {
    const [rows] = await pool.query(`
        SELECT a.*, 
               u.nombre as usuario_nombre, u.apellido as usuario_apellido,
               c.nombre_clase
        FROM asistencias a
        JOIN usuarios u ON a.FK_id_usuario = u.PK_id_usuario
        JOIN clases c ON a.FK_id_clase = c.PK_id_clase
    `);
    return rows;
};

const obtenerasistenciasPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT a.*, c.nombre_clase, c.fecha_hora as clase_fecha_hora
        FROM asistencias a
        JOIN clases c ON a.FK_id_clase = c.PK_id_clase
        WHERE a.FK_id_usuario = ?
    `, [idUsuario]);
    return rows;
};

const obtenerasistenciasPorClase = async (idClase) => {
    const [rows] = await pool.query(`
        SELECT a.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
        FROM asistencias a
        JOIN usuarios u ON a.FK_id_usuario = u.PK_id_usuario
        WHERE a.FK_id_clase = ?
    `, [idClase]);
    return rows;
};

const crearAsistencia = async (datos) => {
    const { FK_id_usuario, FK_id_clase } = datos;
    const [existe] = await pool.query(
        'SELECT * FROM asistencias WHERE FK_id_usuario = ? AND FK_id_clase = ?',
        [FK_id_usuario, FK_id_clase]
    );
    if (existe.length > 0) throw { statusCode: 400, message: 'El usuario ya tiene asistencia registrada en esta clase' };
    const [result] = await pool.query(
        'INSERT INTO asistencias (FK_id_usuario, FK_id_clase) VALUES (?, ?)',
        [FK_id_usuario, FK_id_clase]
    );
    return result;
};

const eliminarAsistencia = async (id) => {
    const [result] = await pool.query('DELETE FROM asistencias WHERE PK_id_asistencia = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Asistencia no encontrada' };
    return result;
};

module.exports = { obtenerasistencias, obtenerasistenciasPorUsuario, obtenerasistenciasPorClase, crearAsistencia, eliminarAsistencia };