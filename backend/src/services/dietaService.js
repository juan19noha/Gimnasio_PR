const pool = require('../config/db');

// Obtener todas las dietas con info de usuario y producto
const obtenerdietas = async () => {
    const [rows] = await pool.query(`
        SELECT d.*, 
               u.nombre as usuario_nombre, 
               u.apellido as usuario_apellido,
               p.nombre_producto
        FROM dietas d
        JOIN usuarios u ON d.FK_id_usuario = u.PK_id_usuario
        LEFT JOIN productos p ON d.FK_id_producto = p.PK_id_producto
    `);
    return rows;
};

// Obtener dieta por ID con sus detalles
const obtenerDietaPorId = async (id) => {
    // Obtener datos de la dieta
    const [dietaRows] = await pool.query(`
        SELECT d.*, 
               u.nombre as usuario_nombre, 
               u.apellido as usuario_apellido,
               p.nombre_producto
        FROM dietas d
        JOIN usuarios u ON d.FK_id_usuario = u.PK_id_usuario
        LEFT JOIN productos p ON d.FK_id_producto = p.PK_id_producto
        WHERE d.PK_id_dieta = ?
    `, [id]);
    
    if (dietaRows.length === 0) {
        throw { statusCode: 404, message: 'Dieta no encontrada' };
    }
    
    const dieta = dietaRows[0];
    
    // Obtener detalles de la dieta (comidas)
    const [detallesRows] = await pool.query(`
        SELECT * FROM detalle_dietas
        WHERE FK_id_dieta = ?
    `, [id]);
    
    dieta.comidas = detallesRows;
    return dieta;
};

// Obtener dietas por usuario
const obtenerdietasPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(`
        SELECT d.*, p.nombre_producto
        FROM dietas d
        LEFT JOIN productos p ON d.FK_id_producto = p.PK_id_producto
        WHERE d.FK_id_usuario = ?
    `, [idUsuario]);
    return rows;
};

// Crear dieta
const crearDieta = async (datos) => {
    const { FK_id_usuario, FK_id_producto, nombre_dieta, objetivo_calorias, fecha_inicio, fecha_fin } = datos;
    
    const [result] = await pool.query(`
        INSERT INTO dietas (FK_id_usuario, FK_id_producto, nombre_dieta, objetivo_calorias, fecha_inicio, fecha_fin)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [FK_id_usuario, FK_id_producto, nombre_dieta, objetivo_calorias, fecha_inicio, fecha_fin]);
    
    return { 
        id: result.insertId, 
        FK_id_usuario, 
        FK_id_producto, 
        nombre_dieta, 
        objetivo_calorias 
    };
};

// Agregar comida a dieta (detalle_dietas)
const agregarComidaADieta = async (datos) => {
    const { FK_id_dieta, horario_comida, alimento, cantidad_gramos, calorias_alimento } = datos;
    
    const [result] = await pool.query(`
        INSERT INTO detalle_dietas (FK_id_dieta, horario_comida, alimento, cantidad_gramos, calorias_alimento)
        VALUES (?, ?, ?, ?, ?)
    `, [FK_id_dieta, horario_comida, alimento, cantidad_gramos, calorias_alimento]);
    
    return { id: result.insertId, ...datos };
};

// Actualizar dieta
const actualizarDieta = async (id, datos) => {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    
    const [result] = await pool.query(`
        UPDATE dietas SET ${setClause} WHERE PK_id_dieta = ?
    `, [...valores, id]);
    
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Dieta no encontrada' };
    }
    return result;
};

// Eliminar comida de dieta
const eliminarComidaDeDieta = async (idDetalle) => {
    const [result] = await pool.query(
        'DELETE FROM detalle_dietas WHERE PK_id_detalle = ?',
        [idDetalle]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Comida no encontrada en la dieta' };
    }
    return result;
};

// Eliminar dieta completa
const eliminarDieta = async (id) => {
    // Primero eliminar detalles
    await pool.query('DELETE FROM detalle_dietas WHERE FK_id_dieta = ?', [id]);
    
    // Luego eliminar dieta
    const [result] = await pool.query(
        'DELETE FROM dietas WHERE PK_id_dieta = ?',
        [id]
    );
    
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Dieta no encontrada' };
    }
    return result;
};

module.exports = {
    obtenerdietas,
    obtenerDietaPorId,
    obtenerdietasPorUsuario,
    crearDieta,
    agregarComidaADieta,
    actualizarDieta,
    eliminarComidaDeDieta,
    eliminarDieta
};