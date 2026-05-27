const proveedorService = require('../services/proveedorService');

const getProveedores = async (req, res, next) => {
    try {
        const proveedores = await proveedorService.obtenerProveedores();
        res.status(200).json({ success: true, data: proveedores });
    } catch (error) { next(error); }
};

const getProveedorById = async (req, res, next) => {
    try {
        const proveedor = await proveedorService.obtenerProveedorPorId(req.params.id);
        res.status(200).json({ success: true, data: proveedor });
    } catch (error) { next(error); }
};

const postProveedor = async (req, res, next) => {
    try {
        const nuevo = await proveedorService.crearProveedor(req.body);
        res.status(201).json({ success: true, message: 'Proveedor creado', data: nuevo });
    } catch (error) { next(error); }
};

const putProveedor = async (req, res, next) => {
    try {
        await proveedorService.actualizarProveedor(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Proveedor actualizado' });
    } catch (error) { next(error); }
};

const deleteProveedor = async (req, res, next) => {
    try {
        await proveedorService.eliminarProveedor(req.params.id);
        res.status(200).json({ success: true, message: 'Proveedor eliminado' });
    } catch (error) { next(error); }
};

module.exports = { getProveedores, getProveedorById, postProveedor, putProveedor, deleteProveedor };