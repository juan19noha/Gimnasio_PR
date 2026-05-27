const Joi = require('joi');

const facturaSchema = Joi.object({
    FK_id_suscripcion: Joi.number().integer().positive().required().messages({
        'any.required': 'La suscripción es requerida'
    }),
    FK_id_usuario: Joi.number().integer().positive().required().messages({
        'any.required': 'El usuario es requerido'
    }),
    // ❌ ELIMINADO: numero_factura (se genera automáticamente en backend)
    metodo_pago: Joi.string().valid('Efectivo', 'Tarjeta de crédito', 'Tarjeta débito', 'Transferencia bancaria').required().messages({
        'any.only': 'Método de pago no válido',
        'any.required': 'El método de pago es requerido'
    }),
    // ❌ ELIMINADO: total_pagado (se obtiene de la suscripción/plan en backend)
    devolucion: Joi.number().min(0).default(0).messages({
        'number.min': 'La devolución no puede ser negativa'
    })
});

module.exports = { facturaSchema };