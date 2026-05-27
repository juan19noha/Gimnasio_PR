const Joi = require('joi');

const eventoSchema = Joi.object({
    nombre_evento: Joi.string().min(3).required().messages({
        'any.required': 'El nombre del evento es requerido'
    }),
    fecha_hora: Joi.date().required().messages({
        'any.required': 'La fecha y hora es requerida'
    }),
    lugar: Joi.string().required().messages({
        'any.required': 'El lugar es requerido'
    }),
    asistencia: Joi.number().integer().min(0).optional(),
    descripcion_evento: Joi.string().optional()
});

module.exports = { eventoSchema };