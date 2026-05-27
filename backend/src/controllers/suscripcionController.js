const {
    obtenerSuscripciones,
    obtenerSuscripcionPorUsuario,
    crearSuscripcion,
    actualizarEstadoSuscripcion,
    solicitarPlan,
    procesarPago,
    cancelarSuscripcion
} = require('../services/suscripcionService');

// Obtener todas las suscripciones (admin)
const getSuscripciones = async (req, res) => {
    try {
        const suscripciones = await obtenerSuscripciones();
        res.json({ success: true, data: suscripciones });
    } catch (error) {
        console.error('Error en getSuscripciones:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener suscripción del usuario actual (cliente)
const getSuscripcionByUsuario = async (req, res) => {
    try {
        const idUsuario = req.usuario?.PK_id_usuario || req.usuario?.id;

        if (!idUsuario) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se pudo identificar el usuario' 
            });
        }

        const suscripcion = await obtenerSuscripcionPorUsuario(idUsuario);
        res.json({ success: true, data: suscripcion });
    } catch (error) {
        console.error('Error en getSuscripcionByUsuario:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Crear suscripción (admin)
const postSuscripcion = async (req, res) => {
    try {
        const nueva = await crearSuscripcion(req.body);
        res.status(201).json({ success: true, data: nueva });
    } catch (error) {
        console.error('Error en postSuscripcion:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Actualizar estado (admin)
const putEstadoSuscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, motivo } = req.body;
        const actualizada = await actualizarEstadoSuscripcion(id, estado, motivo);
        res.json({ success: true, data: actualizada });
    } catch (error) {
        console.error('Error en putEstadoSuscripcion:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Solicitar plan (cliente)
const postSolicitarPlan = async (req, res) => {
    try {
        const idUsuario = req.usuario?.PK_id_usuario || req.usuario?.id;
        const { idPlan, FK_id_Plan } = req.body;

        // Aceptar tanto idPlan como FK_id_Plan
        const planId = idPlan || FK_id_Plan;

        if (!idUsuario) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usuario no identificado' 
            });
        }

        if (!planId) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID del plan requerido (idPlan o FK_id_Plan)' 
            });
        }

        const resultado = await solicitarPlan(idUsuario, planId);
        res.status(201).json({ success: true, data: resultado });
    } catch (error) {
        console.error('Error en postSolicitarPlan:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Procesar pago (cliente)
const postPagar = async (req, res) => {
    try {
        const idUsuario = req.usuario?.PK_id_usuario || req.usuario?.id;
        const { idSuscripcion, id_suscripcion, metodoPago, metodo_pago } = req.body;

        const suscripcionId = idSuscripcion || id_suscripcion;
        const metodo = metodoPago || metodo_pago;

        if (!idUsuario) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usuario no identificado' 
            });
        }

        if (!suscripcionId || !metodo) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID de suscripción y método de pago requeridos' 
            });
        }

        const resultado = await procesarPago(suscripcionId, idUsuario, metodo);
        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error('Error en postPagar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancelar suscripción (cliente)
const patchCancelar = async (req, res) => {
    try {
        const idUsuario = req.usuario?.PK_id_usuario || req.usuario?.id;
        const { id } = req.params;
        const { motivo } = req.body;

        if (!idUsuario) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usuario no identificado' 
            });
        }

        if (!motivo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Motivo de cancelación requerido' 
            });
        }

        const resultado = await cancelarSuscripcion(id, idUsuario, motivo);
        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error('Error en patchCancelar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSuscripciones,
    getSuscripcionByUsuario,
    postSuscripcion,
    putEstadoSuscripcion,
    postSolicitarPlan,
    postPagar,
    patchCancelar
};