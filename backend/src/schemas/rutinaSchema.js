const Joi = require('joi');

const rutinaSchema = Joi.object({
    FK_id_usuario: Joi.number().integer().positive().required().messages({
        'any.required': 'El usuario es requerido'
    }),
    nombre_rutina: Joi.string().min(3).required().messages({
        'any.required': 'El nombre de la rutina es requerido'
    }),
    objetivo: Joi.string().required().messages({
        'any.required': 'El objetivo es requerido'
    })
});

const ejercicioRutinaSchema = Joi.object({
    FK_id_ejercicio: Joi.number().integer().positive().required().messages({
        'any.required': 'El ejercicio es requerido'
    }),
    series: Joi.number().integer().positive().required().messages({
        'any.required': 'Las series son requeridas'
    }),
    repeticiones: Joi.number().integer().positive().required().messages({
        'any.required': 'Las repeticiones son requeridas'
    }),
    tiempo_descanso: Joi.string().required().messages({
        'any.required': 'El tiempo de descanso es requerido'
    })
});

module.exports = { rutinaSchema, ejercicioRutinaSchema };