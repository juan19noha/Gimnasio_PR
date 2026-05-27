const pool = require('../config/db');

const obtenerPlanes = async () => {
    const [rows] = await pool.query('SELECT * FROM Planes');
    return rows;
};

const obtenerPlanPorId = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM Planes WHERE PK_id_Plan = ?', [id]
    );
    if (rows.length === 0) {
        throw { statusCode: 404, message: 'Plan no encontrado' };
    }
    return rows[0];
};

const crearPlan = async (datos) => {
    const { nombre_plan, descripcion_plan, precio_plan } = datos;
    const [result] = await pool.query(
        'INSERT INTO Planes (nombre_plan, descripcion_plan, precio_plan) VALUES (?, ?, ?)',
        [nombre_plan, descripcion_plan, precio_plan]
    );
    return result;
};

const actualizarPlan = async (id, datos) => {
    const { nombre_plan, descripcion_plan, precio_plan } = datos;
    const [result] = await pool.query(
        'UPDATE Planes SET nombre_plan = ?, descripcion_plan = ?, precio_plan = ? WHERE PK_id_Plan = ?',
        [nombre_plan, descripcion_plan, precio_plan, id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Plan no encontrado' };
    }
    return result;
};

const eliminarPlan = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM Planes WHERE PK_id_Plan = ?', [id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Plan no encontrado' };
    }
    return result;
};

module.exports = { obtenerPlanes, obtenerPlanPorId, crearPlan, actualizarPlan, eliminarPlan };