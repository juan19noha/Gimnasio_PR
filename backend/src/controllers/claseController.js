const claseService = require('../services/claseService');

// GET /api/clases
const getClases = async (req, res, next) => {
    try {
        const clases = await claseService.obtenerClases();
        res.status(200).json({
            success: true,
            data: clases
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/clases/:id
const getClaseById = async (req, res, next) => {
    try {
        const clase = await claseService.obtenerClasePorId(req.params.id);
        res.status(200).json({
            success: true,
            data: clase
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/clases/instructor/:idInstructor
const getClasesByInstructor = async (req, res, next) => {
    try {
        const clases = await claseService.obtenerClasesPorInstructor(req.params.idInstructor);
        res.status(200).json({
            success: true,
            data: clases
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/clases/fecha/:fecha (formato YYYY-MM-DD)
const getClasesByFecha = async (req, res, next) => {
    try {
        const clases = await claseService.obtenerClasesPorFecha(req.params.fecha);
        res.status(200).json({
            success: true,
            data: clases
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/clases
const postClase = async (req, res, next) => {
    try {
        const nuevaClase = await claseService.crearClase(req.body);
        res.status(201).json({
            success: true,
            message: 'Clase creada correctamente',
            data: nuevaClase
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/clases/:id
const putClase = async (req, res, next) => {
    try {
        await claseService.actualizarClase(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Clase actualizada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/clases/:id
const deleteClase = async (req, res, next) => {
    try {
        await claseService.eliminarClase(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Clase eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getClases,
    getClaseById,
    getClasesByInstructor,
    getClasesByFecha,
    postClase,
    putClase,
    deleteClase
};