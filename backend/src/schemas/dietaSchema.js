const Joi = require('joi');

const dietaSchema = Joi.object({
    FK_id_usuario: Joi.number().integer().positive().required().messages({
        'any.required': 'El usuario es requerido'
    }),
    FK_id_producto: Joi.number().integer().positive().optional().allow(null).messages({
        'number.base': 'El producto debe ser un número válido'
    }),
    nombre_dieta: Joi.string().min(3).required().messages({
        'any.required': 'El nombre de la dieta es requerido'
    }),
    objetivo_calorias: Joi.string().required().messages({
        'any.required': 'El objetivo de calorías es requerido'
    }),
    fecha_inicio: Joi.date().required().messages({
        'any.required': 'La fecha de inicio es requerida'
    }),
    fecha_fin: Joi.date().greater(Joi.ref('fecha_inicio')).optional().messages({
        'date.greater': 'La fecha de fin debe ser mayor a la fecha de inicio'
    })
});

const comidaDietaSchema = Joi.object({
    horario_comida: Joi.date().required().messages({
        'any.required': 'El horario de comida es requerido'
    }),
    alimento: Joi.string().required().messages({
        'any.required': 'El alimento es requerido'
    }),
    cantidad_gramos: Joi.string().required().messages({
        'any.required': 'La cantidad en gramos es requerida'
    }),
    calorias_alimento: Joi.string().required().messages({
        'any.required': 'Las calorías son requeridas'
    })
});

module.exports = { dietaSchema, comidaDietaSchema };