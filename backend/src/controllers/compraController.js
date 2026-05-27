const compraService = require('../services/compraService');

const getCompras = async (req, res, next) => {
    try {
        const compras = await compraService.obtenerCompras();
        res.status(200).json({ success: true, data: compras });
    } catch (error) { next(error); }
};

const getCompraById = async (req, res, next) => {
    try {
        const compra = await compraService.obtenerCompraPorId(req.params.id);
        res.status(200).json({ success: true, data: compra });
    } catch (error) { next(error); }
};

const postCompra = async (req, res, next) => {
    try {
        const { datos, detalles } = req.body;
        
        // Calcular total_compra en backend
        const total_compra = detalles.reduce((sum, item) => {
            return sum + (item.cantidad * item.precio_unidad);
        }, 0);
        
        const nuevaCompra = await compraService.crearCompra({
            ...datos,
            total_compra
        }, detalles);
        
        res.status(201).json({ success: true, data: nuevaCompra });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCompras,
    getCompraById,
    postCompra
};