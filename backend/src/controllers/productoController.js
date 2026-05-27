const productoService = require('../services/productoService');

// GET /api/productos
const getProductos = async (req, res, next) => {
    try {
        const productos = await productoService.obtenerProductos();
        res.status(200).json({
            success: true,
            data: productos
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/productos/:id
const getProductoById = async (req, res, next) => {
    try {
        const producto = await productoService.obtenerProductoPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: producto
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/productos/categoria/:idCategoria
const getProductosByCategoria = async (req, res, next) => {
    try {
        const productos = await productoService.obtenerProductosPorCategoria(req.params.idCategoria);
        res.status(200).json({
            success: true,
            data: productos
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/productos
const postProducto = async (req, res, next) => {
    try {
        const nuevoProducto = await productoService.crearProducto(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: nuevoProducto
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/productos/:id
const putProducto = async (req, res, next) => {
    try {
        await productoService.actualizarProducto(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/productos/:id
const deleteProducto = async (req, res, next) => {
    try {
        await productoService.eliminarProducto(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/productos/:id/stock (actualizar stock)
const patchStock = async (req, res, next) => {
    try {
        const { cantidad } = req.body;
        await productoService.actualizarStock(req.params.id, cantidad);
        res.status(200).json({
            success: true,
            message: `Stock actualizado en ${cantidad > 0 ? '+' : ''}${cantidad} unidades`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductos,
    getProductoById,
    getProductosByCategoria,
    postProducto,
    putProducto,
    deleteProducto,
    patchStock
};