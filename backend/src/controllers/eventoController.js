const eventoService = require('../services/eventoService');

const getEventos = async (req, res, next) => {
    try {
        const eventos = await eventoService.obtenerEventos();
        res.status(200).json({ success: true, data: eventos });
    } catch (error) { next(error); }
};

const getEventoById = async (req, res, next) => {
    try {
        const evento = await eventoService.obtenerEventoPorId(req.params.id);
        res.status(200).json({ success: true, data: evento });
    } catch (error) { next(error); }
};

const postEvento = async (req, res, next) => {
    try {
        const nuevo = await eventoService.crearEvento(req.body);
        res.status(201).json({ success: true, message: 'Evento creado', data: nuevo });
    } catch (error) { next(error); }
};

const putEvento = async (req, res, next) => {
    try {
        await eventoService.actualizarEvento(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Evento actualizado' });
    } catch (error) { next(error); }
};

const deleteEvento = async (req, res, next) => {
    try {
        await eventoService.eliminarEvento(req.params.id);
        res.status(200).json({ success: true, message: 'Evento eliminado' });
    } catch (error) { next(error); }
};

module.exports = { getEventos, getEventoById, postEvento, putEvento, deleteEvento };