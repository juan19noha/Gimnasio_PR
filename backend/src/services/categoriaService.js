const pool = require('../config/db');

const obtenercategorias = async () => {
    const [rows] = await pool.query('SELECT * FROM categorias');
    return rows;
};

const obtenercategoriasPorTipo = async (tipo) => {
    const [rows] = await pool.query(
        'SELECT * FROM categorias WHERE tipo_categoria = ?',
        [tipo]
    );
    return rows;
};

const crearCategoria = async (datos) => {
    const { nombre_categoria, tipo_categoria, descripcion_categoria } = datos;
    const [result] = await pool.query(
        'INSERT INTO categorias (nombre_categoria, tipo_categoria, descripcion_categoria) VALUES (?, ?, ?)',
        [nombre_categoria, tipo_categoria, descripcion_categoria]
    );
    return { id: result.insertId, ...datos };
};

module.exports = { obtenercategorias, obtenercategoriasPorTipo, crearCategoria };