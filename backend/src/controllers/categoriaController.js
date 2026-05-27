const categoriaService = require('../services/categoriaService');

const getCategorias = async (req, res, next) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();
        res.status(200).json({ success: true, data: categorias });
    } catch (error) { next(error); }
};

const getCategoriasPorTipo = async (req, res, next) => {
    try {
        const categorias = await categoriaService.obtenerCategoriasPorTipo(req.params.tipo);
        res.status(200).json({ success: true, data: categorias });
    } catch (error) { next(error); }
};

const postCategoria = async (req, res, next) => {
    try {
        const nueva = await categoriaService.crearCategoria(req.body);
        res.status(201).json({ success: true, message: 'Categoría creada', data: nueva });
    } catch (error) { next(error); }
};

module.exports = { getCategorias, getCategoriasPorTipo, postCategoria };