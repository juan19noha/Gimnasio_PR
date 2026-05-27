const ejercicioService = require('../services/ejercicioService');

const getEjercicios = async (req, res, next) => {
    try {
        const ejercicios = await ejercicioService.obtenerEjercicios();
        res.status(200).json({ success: true, data: ejercicios });
    } catch (error) { next(error); }
};

const getEjercicioById = async (req, res, next) => {
    try {
        const ejercicio = await ejercicioService.obtenerEjercicioPorId(req.params.id);
        res.status(200).json({ success: true, data: ejercicio });
    } catch (error) { next(error); }
};

const getEjerciciosByMusculo = async (req, res, next) => {
    try {
        const ejercicios = await ejercicioService.obtenerEjerciciosPorMusculo(req.params.musculo);
        res.status(200).json({ success: true, data: ejercicios });
    } catch (error) { next(error); }
};

const postEjercicio = async (req, res, next) => {
    try {
        const nuevo = await ejercicioService.crearEjercicio(req.body);
        res.status(201).json({ success: true, message: 'Ejercicio creado', data: nuevo });
    } catch (error) { next(error); }
};

const putEjercicio = async (req, res, next) => {
    try {
        await ejercicioService.actualizarEjercicio(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Ejercicio actualizado' });
    } catch (error) { next(error); }
};

const deleteEjercicio = async (req, res, next) => {
    try {
        await ejercicioService.eliminarEjercicio(req.params.id);
        res.status(200).json({ success: true, message: 'Ejercicio eliminado' });
    } catch (error) { next(error); }
};

module.exports = { getEjercicios, getEjercicioById, getEjerciciosByMusculo, postEjercicio, putEjercicio, deleteEjercicio };