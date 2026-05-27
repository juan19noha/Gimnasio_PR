const Joi = require('joi');

const ejercicioSchema = Joi.object({
    nombre_ejercicio: Joi.string().min(3).required().messages({
        'any.required': 'El nombre del ejercicio es requerido'
    }),
    tecnicas: Joi.string().optional(),
    musculo_a_trabajar: Joi.string().required().messages({
        'any.required': 'El músculo a trabajar es requerido'
    }),
    tiempo_duracion: Joi.string().required().messages({
        'any.required': 'El tiempo de duración es requerido'
    }),
    descripcion: Joi.string().optional()
});

module.exports = { ejercicioSchema };