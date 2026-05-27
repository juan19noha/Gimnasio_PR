const pool = require('../config/db');

const obtenerClases = async () => {
    const [rows] = await pool.query(`
        SELECT c.*, 
               u.nombre as instructor_nombre, u.apellido as instructor_apellido,
               cat.nombre_categoria
        FROM Clases c
        JOIN Usuarios u ON c.FK_id_instructor = u.PK_id_usuario
        JOIN Categorias cat ON c.FK_id_categoria = cat.PK_id_categoria
    `);
    return rows;
};

const obtenerClasePorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT c.*, 
               u.nombre as instructor_nombre, u.apellido as instructor_apellido
        FROM Clases c
        JOIN Usuarios u ON c.FK_id_instructor = u.PK_id_usuario
        WHERE c.PK_id_clase = ?
    `, [id]);
    if (rows.length === 0) throw { statusCode: 404, message: 'Clase no encontrada' };
    return rows[0];
};

const crearClase = async (datos) => {
    const { FK_id_instructor, FK_id_categoria, nombre_clase, fecha_hora, capacidad_maxima, lugar, descripcion_clase } = datos;
    const [result] = await pool.query(`
        INSERT INTO Clases (FK_id_instructor, FK_id_categoria, nombre_clase, fecha_hora, capacidad_maxima, lugar, descripcion_clase)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [FK_id_instructor, FK_id_categoria, nombre_clase, fecha_hora, capacidad_maxima, lugar, descripcion_clase]);
    return result;
};

const actualizarClase = async (id, datos) => {
    const { FK_id_instructor, FK_id_categoria, nombre_clase, fecha_hora, capacidad_maxima, lugar, descripcion_clase } = datos;
    const [result] = await pool.query(`
        UPDATE Clases SET FK_id_instructor = ?, FK_id_categoria = ?, nombre_clase = ?, 
        fecha_hora = ?, capacidad_maxima = ?, lugar = ?, descripcion_clase = ?
        WHERE PK_id_clase = ?
    `, [FK_id_instructor, FK_id_categoria, nombre_clase, fecha_hora, capacidad_maxima, lugar, descripcion_clase, id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Clase no encontrada' };
    return result;
};

const eliminarClase = async (id) => {
    const [result] = await pool.query('DELETE FROM Clases WHERE PK_id_clase = ?', [id]);
    if (result.affectedRows === 0) throw { statusCode: 404, message: 'Clase no encontrada' };
    return result;
};

module.exports = { obtenerClases, obtenerClasePorId, crearClase, actualizarClase, eliminarClase };