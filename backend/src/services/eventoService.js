const pool = require('../config/db');

const obtenerEventos = async () => {
    const [rows] = await pool.query('SELECT * FROM eventos ORDER BY fecha_hora');
    return rows;
};

const obtenerEventoPorId = async (id) => {
    const [rows] = await pool.query('SELECT * FROM eventos WHERE PK_id_evento = ?', [id]);
    if (rows.length === 0) throw { statusCode: 404, message: 'Evento no encontrado' };
    return rows[0];
};

const crearEvento = async (datos) => {
    const { nombre_evento, fecha_hora, lugar, asistencia, descripcion_evento } = datos;
    const [result] = await pool.query(
        'INSERT INTO eventos (nombre_evento, fecha_hora, lugar, asistencia, descripcion_evento) VALUES (?, ?, ?, ?, ?)',
        [nombre_evento, fecha_hora, lugar, asistencia || 0, descripcion_evento]
    );
    return { id: result.insertId, ...datos };
};

const actualizarEvento = async (id, datos) => {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    const [result] = await pool.query(`UPDATE eventos SET ${setClause} WHERE PK_id_evento = ?`, [...valores, id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Evento no encontrado' };
    return result;
};

const eliminarEvento = async (id) => {
    const [result] = await pool.query('DELETE FROM eventos WHERE PK_id_evento = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Evento no encontrado' };
    return result;
};

module.exports = { obtenerEventos, obtenerEventoPorId, crearEvento, actualizarEvento, eliminarEvento };