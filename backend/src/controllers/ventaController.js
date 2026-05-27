const ventaService = require('../services/ventaService');

const getVentas = async (req, res, next) => {
    try {
        const ventas = await ventaService.obtenerVentas();
        res.status(200).json({ success: true, data: ventas });
    } catch (error) { next(error); }
};

const getVentasByUsuario = async (req, res, next) => {
    try {
        const ventas = await ventaService.obtenerVentasPorUsuario(req.params.idUsuario);
        res.status(200).json({ success: true, data: ventas });
    } catch (error) { next(error); }
};

const postVenta = async (req, res, next) => {
    try {
        const { FK_id_usuario, FK_id_producto, FK_id_evento, cantidad } = req.body;
        
        // Obtener precio del producto desde la BD
        const producto = await productoService.obtenerProductoPorId(FK_id_producto);
        const total = cantidad * producto.precio_producto;  // ← Calculado aquí
        
        const nuevaVenta = await ventaService.crearVenta({
            FK_id_usuario,
            FK_id_producto,
            FK_id_evento,
            cantidad,
            total  // ← Calculado aquí, no viene del cliente
        });
        
        res.status(201).json({ success: true, data: nuevaVenta });
    } catch (error) {
        next(error);
    }
};

module.exports = { getVentas, getVentasByUsuario, postVenta };