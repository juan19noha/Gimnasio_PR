const rutinaService = require('../services/rutinaService');

// GET /api/rutinas
const getRutinas = async (req, res, next) => {
    try {
        const rutinas = await rutinaService.obtenerRutinas();
        res.status(200).json({
            success: true,
            data: rutinas
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/rutinas/:id
const getRutinaById = async (req, res, next) => {
    try {
        const rutina = await rutinaService.obtenerRutinaPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: rutina
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/rutinas/usuario/:idUsuario
const getRutinasByUsuario = async (req, res, next) => {
    try {
        const rutinas = await rutinaService.obtenerRutinasPorUsuario(req.params.idUsuario);
        res.status(200).json({
            success: true,
            data: rutinas
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/rutinas (crear rutina)
const postRutina = async (req, res, next) => {
    try {
        const nuevaRutina = await rutinaService.crearRutina(req.body);
        res.status(201).json({
            success: true,
            message: 'Rutina creada correctamente',
            data: nuevaRutina
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/rutinas/:id/ejercicios (agregar ejercicio a rutina)
const postEjercicioARutina = async (req, res, next) => {
    try {
        const datos = {
            FK_id_rutina: req.params.id,
            ...req.body
        };
        const nuevoEjercicio = await rutinaService.agregarEjercicioARutina(datos);
        res.status(201).json({
            success: true,
            message: 'Ejercicio agregado a la rutina correctamente',
            data: nuevoEjercicio
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/rutinas/:id
const putRutina = async (req, res, next) => {
    try {
        await rutinaService.actualizarRutina(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Rutina actualizada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/rutinas/:id
const deleteRutina = async (req, res, next) => {
    try {
        await rutinaService.eliminarRutina(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Rutina eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/rutinas/ejercicios/:idDetalle
const deleteEjercicioDeRutina = async (req, res, next) => {
    try {
        await rutinaService.eliminarEjercicioDeRutina(req.params.idDetalle);
        res.status(200).json({
            success: true,
            message: 'Ejercicio eliminado de la rutina correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRutinas,
    getRutinaById,
    getRutinasByUsuario,
    postRutina,
    postEjercicioARutina,
    putRutina,
    deleteRutina,
    deleteEjercicioDeRutina
};