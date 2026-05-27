const facturaService = require('../services/facturaService');

const getFacturas = async (req, res, next) => {
    try {
        const facturas = await facturaService.obtenerFacturas();
        res.status(200).json({ success: true, data: facturas });
    } catch (error) { next(error); }
};

const getFacturaById = async (req, res, next) => {
    try {
        const factura = await facturaService.obtenerFacturaPorId(req.params.id);
        res.status(200).json({ success: true, data: factura });
    } catch (error) { next(error); }
};

const getFacturasByUsuario = async (req, res, next) => {
    try {
        const facturas = await facturaService.obtenerFacturasPorUsuario(req.params.idUsuario);
        res.status(200).json({ success: true, data: facturas });
    } catch (error) { next(error); }
};

const postFactura = async (req, res, next) => {
    try {
        const { FK_id_suscripcion, FK_id_usuario, metodo_pago, devolucion } = req.body;
        
        // Generar número de factura automático
        const numero_factura = `FAC-${Date.now()}`;  // ← Generado aquí
        
        // Obtener precio de la suscripción
        const suscripcion = await suscripcionService.obtenerSuscripcionPorId(FK_id_suscripcion);
        const total_pagado = suscripcion.precio_suscripcion;  // ← Obtenido de BD
        
        const nuevaFactura = await facturaService.crearFactura({
            FK_id_suscripcion,
            FK_id_usuario,
            numero_factura,  // ← Generado aquí
            metodo_pago,
            total_pagado,    // ← Obtenido de BD
            devolucion: devolucion || 0
        });
        
        res.status(201).json({ success: true, data: nuevaFactura });
    } catch (error) {
        next(error);
    }
};

module.exports = { getFacturas, getFacturaById, getFacturasByUsuario, postFactura };