const pool = require('../config/db');

// Obtener todos los productos con info de categoría
const obtenerproductos = async () => {
    const [rows] = await pool.query(`
        SELECT p.*, c.nombre_categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.FK_id_categoria = c.PK_id_categoria
    `);
    return rows;
};

// Obtener producto por ID
const obtenerProductoPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.*, c.nombre_categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.FK_id_categoria = c.PK_id_categoria
        WHERE p.PK_id_producto = ?
    `, [id]);
    
    if (rows.length === 0) {
        throw { statusCode: 404, message: 'Producto no encontrado' };
    }
    return rows[0];
};

// Obtener productos por categoría
const obtenerproductosPorCategoria = async (idCategoria) => {
    const [rows] = await pool.query(`
        SELECT p.*, c.nombre_categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.FK_id_categoria = c.PK_id_categoria
        WHERE p.FK_id_categoria = ?
    `, [idCategoria]);
    return rows;
};

// Crear producto
const crearProducto = async (datos) => {
    const { 
        FK_id_categoria, 
        nombre_producto, 
        stock, 
        precio_producto, 
        descripcion, 
        promociones 
    } = datos;
    
    const [result] = await pool.query(`
        INSERT INTO productos (FK_id_categoria, nombre_producto, stock, precio_producto, descripcion, promociones)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [FK_id_categoria, nombre_producto, stock, precio_producto, descripcion, promociones]);
    
    return { id: result.insertId, ...datos };
};

// Actualizar producto
const actualizarProducto = async (id, datos) => {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    
    const [result] = await pool.query(`
        UPDATE productos SET ${setClause} WHERE PK_id_producto = ?
    `, [...valores, id]);
    
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Producto no encontrado' };
    }
    return result;
};

// Eliminar producto
const eliminarProducto = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM productos WHERE PK_id_producto = ?', 
        [id]
    );
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Producto no encontrado' };
    }
    return result;
};

// Actualizar stock (para ventas o compras)
const actualizarStock = async (id, cantidad) => {
    const [result] = await pool.query(`
        UPDATE productos 
        SET stock = stock + ? 
        WHERE PK_id_producto = ?
    `, [cantidad, id]);
    
    if (result.affectedRows === 0) {
        throw { statusCode: 404, message: 'Producto no encontrado' };
    }
    return result;
};

module.exports = {
    obtenerproductos,
    obtenerProductoPorId,
    obtenerproductosPorCategoria,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    actualizarStock
};