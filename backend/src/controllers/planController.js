const { obtenerPlanes, obtenerPlanPorId, crearPlan, actualizarPlan, eliminarPlan } = require('../services/planService');

const getPlanes = async (req, res, next) => {
    try {
        const planes = await obtenerPlanes();
        res.status(200).json({
            success: true,
            data: planes
        });
    } catch (error) {
        next(error);
    }
};

const getPlanById = async (req, res, next) => {
    try {
        const plan = await obtenerPlanPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

const postPlan = async (req, res, next) => {
    try {
        await crearPlan(req.body);
        res.status(201).json({
            success: true,
            message: 'Plan creado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

const putPlan = async (req, res, next) => {
    try {
        await actualizarPlan(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Plan actualizado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

const deletePlan = async (req, res, next) => {
    try {
        await eliminarPlan(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Plan eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPlanes, getPlanById, postPlan, putPlan, deletePlan };