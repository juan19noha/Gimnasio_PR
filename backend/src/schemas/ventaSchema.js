const Joi = require('joi');

const ventaSchema = Joi.object({
    FK_id_usuario: Joi.number().integer().positive().required().messages({
        'any.required': 'El usuario es requerido'
    }),
    FK_id_producto: Joi.number().integer().positive().required().messages({
        'any.required': 'El producto es requerido'
    }),
    FK_id_evento: Joi.number().integer().positive().optional().allow(null),
    cantidad: Joi.number().integer().positive().required().messages({
        'any.required': 'La cantidad es requerida'
    })
    // ❌ ELIMINADO: total (se calcula como cantidad * precio_producto en backend)
});

module.exports = { ventaSchema };