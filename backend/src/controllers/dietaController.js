const dietaService = require('../services/dietaService');

// GET /api/dietas
const getDietas = async (req, res, next) => {
    try {
        const dietas = await dietaService.obtenerDietas();
        res.status(200).json({
            success: true,
            data: dietas
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/dietas/:id
const getDietaById = async (req, res, next) => {
    try {
        const dieta = await dietaService.obtenerDietaPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: dieta
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/dietas/usuario/:idUsuario
const getDietasByUsuario = async (req, res, next) => {
    try {
        const dietas = await dietaService.obtenerDietasPorUsuario(req.params.idUsuario);
        res.status(200).json({
            success: true,
            data: dietas
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/dietas (crear dieta)
const postDieta = async (req, res, next) => {
    try {
        const nuevaDieta = await dietaService.crearDieta(req.body);
        res.status(201).json({
            success: true,
            message: 'Dieta creada correctamente',
            data: nuevaDieta
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/dietas/:id/comidas (agregar comida a dieta)
const postComidaADieta = async (req, res, next) => {
    try {
        const datos = {
            FK_id_dieta: req.params.id,
            ...req.body
        };
        const nuevaComida = await dietaService.agregarComidaADieta(datos);
        res.status(201).json({
            success: true,
            message: 'Comida agregada a la dieta correctamente',
            data: nuevaComida
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/dietas/:id
const putDieta = async (req, res, next) => {
    try {
        await dietaService.actualizarDieta(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Dieta actualizada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/dietas/:id
const deleteDieta = async (req, res, next) => {
    try {
        await dietaService.eliminarDieta(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Dieta eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/dietas/comidas/:idDetalle
const deleteComidaDeDieta = async (req, res, next) => {
    try {
        await dietaService.eliminarComidaDeDieta(req.params.idDetalle);
        res.status(200).json({
            success: true,
            message: 'Comida eliminada de la dieta correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDietas,
    getDietaById,
    getDietasByUsuario,
    postDieta,
    postComidaADieta,
    putDieta,
    deleteDieta,
    deleteComidaDeDieta
};