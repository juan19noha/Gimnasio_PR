const { obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } = require('../services/usuarioService');

const getUsuarios = async (req, res, next) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
};

const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await obtenerUsuarioPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
};

const updateUsuario = async (req, res, next) => {
    try {   
        await actualizarUsuario(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

const deleteUsuario = async (req, res, next) => {
    try {
        await eliminarUsuario(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsuarios, getUsuarioById, updateUsuario, deleteUsuario };