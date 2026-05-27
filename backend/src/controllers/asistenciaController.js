const asistenciaService = require('../services/asistenciaService');

// GET /api/asistencias
const getAsistencias = async (req, res, next) => {
    try {
        const asistencias = await asistenciaService.obtenerAsistencias();
        res.status(200).json({
            success: true,
            data: asistencias
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/asistencias/:id
const getAsistenciaById = async (req, res, next) => {
    try {
        const asistencia = await asistenciaService.obtenerAsistenciaPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: asistencia
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/asistencias/usuario/:idUsuario
const getAsistenciasByUsuario = async (req, res, next) => {
    try {
        const asistencias = await asistenciaService.obtenerAsistenciasPorUsuario(req.params.idUsuario);
        res.status(200).json({
            success: true,
            data: asistencias
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/asistencias/clase/:idClase
const getAsistenciasByClase = async (req, res, next) => {
    try {
        const asistencias = await asistenciaService.obtenerAsistenciasPorClase(req.params.idClase);
        res.status(200).json({
            success: true,
            data: asistencias
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/asistencias (registrar asistencia)
const postAsistencia = async (req, res, next) => {
    try {
        const nuevaAsistencia = await asistenciaService.crearAsistencia(req.body);
        res.status(201).json({
            success: true,
            message: 'Asistencia registrada correctamente',
            data: nuevaAsistencia
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/asistencias/:id (eliminar registro)
const deleteAsistencia = async (req, res, next) => {
    try {
        await asistenciaService.eliminarAsistencia(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Asistencia eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAsistencias,
    getAsistenciaById,
    getAsistenciasByUsuario,
    getAsistenciasByClase,
    postAsistencia,
    deleteAsistencia
};