const pool = require('../config/db');

const obtenerrutinas = async () => {
    const [rows] = await pool.query(`
        SELECT r.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
        FROM rutinas r
        JOIN usuarios u ON r.FK_id_usuario = u.PK_id_usuario
    `);
    return rows;
};

const obtenerRutinaPorId = async (id) => {
    const [rutinaRows] = await pool.query(`
        SELECT r.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
        FROM rutinas r
        JOIN usuarios u ON r.FK_id_usuario = u.PK_id_usuario
        WHERE r.PK_id_rutina = ?
    `, [id]);
    if (rutinaRows.length === 0) throw { statusCode: 404, message: 'Rutina no encontrada' };
    const rutina = rutinaRows[0];
    const [ejerciciosRows] = await pool.query(`
        SELECT dr.*, e.nombre_ejercicio, e.tecnicas, e.musculo_a_trabajar
        FROM detalle_rutinas dr
        JOIN ejercicios e ON dr.FK_id_ejercicio = e.PK_id_ejercicio
        WHERE dr.FK_id_rutina = ?
    `, [id]);
    rutina.ejercicios = ejerciciosRows;
    return rutina;
};

const obtenerrutinasPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(
        'SELECT * FROM rutinas WHERE FK_id_usuario = ?', [idUsuario]
    );
    return rows;
};

const crearRutina = async (datos) => {
    const { FK_id_usuario, nombre_rutina, objetivo } = datos;
    const [result] = await pool.query(
        'INSERT INTO rutinas (FK_id_usuario, nombre_rutina, objetivo) VALUES (?, ?, ?)',
        [FK_id_usuario, nombre_rutina, objetivo]
    );
    return { id: result.insertId, FK_id_usuario, nombre_rutina, objetivo };
};

const agregarEjercicioARutina = async (datos) => {
    const { FK_id_rutina, FK_id_ejercicio, series, repeticiones, tiempo_descanso } = datos;
    const [result] = await pool.query(`
        INSERT INTO detalle_rutinas (FK_id_rutina, FK_id_ejercicio, series, repeticiones, tiempo_descanso)
        VALUES (?, ?, ?, ?, ?)
    `, [FK_id_rutina, FK_id_ejercicio, series, repeticiones, tiempo_descanso]);
    return { id: result.insertId, ...datos };
};

const eliminarRutina = async (id) => {
    await pool.query('DELETE FROM detalle_rutinas WHERE FK_id_rutina = ?', [id]);
    const [result] = await pool.query('DELETE FROM rutinas WHERE PK_id_rutina = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Rutina no encontrada' };
    return result;
};

module.exports = { obtenerrutinas, obtenerRutinaPorId, obtenerrutinasPorUsuario, crearRutina, agregarEjercicioARutina, eliminarRutina };