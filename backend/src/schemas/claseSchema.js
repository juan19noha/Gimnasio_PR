const Joi = require('joi');

const claseSchema = Joi.object({
    FK_id_instructor: Joi.number().integer().positive().required().messages({
        'any.required': 'El instructor es requerido'
    }),
    FK_id_categoria: Joi.number().integer().positive().required().messages({
        'any.required': 'La categoría es requerida'
    }),
    nombre_clase: Joi.string().min(3).required().messages({
        'any.required': 'El nombre de la clase es requerido'
    }),
    fecha_hora: Joi.date().required().messages({
        'any.required': 'La fecha y hora es requerida'
    }),
    capacidad_maxima: Joi.number().integer().positive().required().messages({
        'any.required': 'La capacidad máxima es requerida'
    }),
    lugar: Joi.string().required().messages({
        'any.required': 'El lugar es requerido'
    }),
    descripcion_clase: Joi.string().optional()
});

module.exports = { claseSchema };