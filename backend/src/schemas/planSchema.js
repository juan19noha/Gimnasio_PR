const Joi = require('joi');

const planSchema = Joi.object({
    nombre_plan: Joi.string().min(3).required().messages({
        'any.required': 'El nombre del plan es requerido'
    }),
    descripcion_plan: Joi.string().optional(),
    precio_plan: Joi.number().positive().required().messages({
        'number.positive': 'El precio debe ser mayor a 0',
        'any.required': 'El precio es requerido'
    })
});

module.exports = { planSchema };