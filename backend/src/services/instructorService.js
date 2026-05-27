const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const obtenerInstructores = async () => {
    const [rows] = await pool.query(`
        SELECT PK_id_usuario, nombre, apellido, correo, 
               especialidad, horario_laboral, salario, puntuacion, descripcion
        FROM usuarios
        WHERE FK_id_rol = 2
    `);
    return rows;
};

const obtenerInstructorPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT PK_id_usuario, nombre, apellido, correo, 
               especialidad, horario_laboral, salario, puntuacion, descripcion
        FROM usuarios
        WHERE PK_id_usuario = ? AND FK_id_rol = 2
    `, [id]);
    if (rows.length === 0) {
        throw { statusCode: 404, message: 'Instructor no encontrado' };
    }
    return rows[0];
};

const crearInstructor = async (datos) => {
    const { nombre, apellido, correo, password, especialidad, horario_laboral, salario, puntuacion, descripcion } = datos;

    const [existe] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
        throw { statusCode: 400, message: 'El correo ya está registrado' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(`
        INSERT INTO usuarios (FK_id_rol, nombre, apellido, correo, password, especialidad, horario_laboral, salario, puntuacion, descripcion)
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [nombre, apellido, correo, passwordHash, especialidad, horario_laboral, salario, puntuacion, descripcion]);

    return { id: result.insertId, nombre, apellido, correo, especialidad };
};

const actualizarInstructor = async (id, datos) => {
    if (datos.password) {
        const salt = await bcrypt.genSalt(10);
        datos.password = await bcrypt.hash(datos.password, salt);
    }

    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');

    const [result] = await pool.query(
        `UPDATE usuarios SET ${setClause} WHERE PK_id_usuario = ? AND FK_id_rol = 2`,
        [...valores, id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Instructor no encontrado' };
    }
    return result;
};

const eliminarInstructor = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM usuarios WHERE PK_id_usuario = ? AND FK_id_rol = 2', [id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Instructor no encontrado' };
    }
    return result;
};

module.exports = { obtenerInstructores, obtenerInstructorPorId, crearInstructor, actualizarInstructor, eliminarInstructor };