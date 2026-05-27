const instructorService = require('../services/instructorService');

// GET /api/instructores
const getInstructores = async (req, res, next) => {
    try {
        const instructores = await instructorService.obtenerInstructores();
        res.status(200).json({
            success: true,
            data: instructores
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/instructores/:id
const getInstructorById = async (req, res, next) => {
    try {
        const instructor = await instructorService.obtenerInstructorPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: instructor
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/instructores
const postInstructor = async (req, res, next) => {
    try {
        const nuevoInstructor = await instructorService.crearInstructor(req.body);
        res.status(201).json({
            success: true,
            message: 'Instructor creado correctamente',
            data: nuevoInstructor
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/instructores/:id
const putInstructor = async (req, res, next) => {
    try {
        await instructorService.actualizarInstructor(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Instructor actualizado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/instructores/:id
const deleteInstructor = async (req, res, next) => {
    try {
        await instructorService.eliminarInstructor(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Instructor eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInstructores,
    getInstructorById,
    postInstructor,
    putInstructor,
    deleteInstructor
};