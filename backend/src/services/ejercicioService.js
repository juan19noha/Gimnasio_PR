const pool = require('../config/db');

const obtenerEjercicios = async () => {
    const [rows] = await pool.query('SELECT * FROM ejercicios');
    return rows;
};

const obtenerEjercicioPorId = async (id) => {
    const [rows] = await pool.query('SELECT * FROM ejercicios WHERE PK_id_ejercicio = ?', [id]);
    if (rows.length === 0) throw { statusCode: 404, message: 'Ejercicio no encontrado' };
    return rows[0];
};

const obtenerEjerciciosPorMusculo = async (musculo) => {
    const [rows] = await pool.query(
        'SELECT * FROM ejercicios WHERE musculo_a_trabajar LIKE ?',
        [`%${musculo}%`]
    );
    return rows;
};

const crearEjercicio = async (datos) => {
    const { nombre_ejercicio, tecnicas, musculo_a_trabajar, tiempo_duracion, descripcion } = datos;
    const [result] = await pool.query(
        'INSERT INTO ejercicios (nombre_ejercicio, tecnicas, musculo_a_trabajar, tiempo_duracion, descripcion) VALUES (?, ?, ?, ?, ?)',
        [nombre_ejercicio, tecnicas, musculo_a_trabajar, tiempo_duracion, descripcion]
    );
    return { id: result.insertId, ...datos };
};

const actualizarEjercicio = async (id, datos) => {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    const [result] = await pool.query(`UPDATE ejercicios SET ${setClause} WHERE PK_id_ejercicio = ?`, [...valores, id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Ejercicio no encontrado' };
    return result;
};

const eliminarEjercicio = async (id) => {
    const [result] = await pool.query('DELETE FROM ejercicios WHERE PK_id_ejercicio = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Ejercicio no encontrado' };
    return result;
};

module.exports = { obtenerEjercicios, obtenerEjercicioPorId, obtenerEjerciciosPorMusculo, crearEjercicio, actualizarEjercicio, eliminarEjercicio };