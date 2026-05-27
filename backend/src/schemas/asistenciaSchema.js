const Joi = require('joi');

const asistenciaSchema = Joi.object({
    FK_id_usuario: Joi.number().integer().positive().required().messages({
        'any.required': 'El usuario es requerido'
    }),
    FK_id_clase: Joi.number().integer().positive().required().messages({
        'any.required': 'La clase es requerida'
    })
});

module.exports = { asistenciaSchema };