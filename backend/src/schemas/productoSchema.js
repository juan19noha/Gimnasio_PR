const Joi = require('joi');

const productoSchema = Joi.object({
    FK_id_categoria: Joi.number().integer().positive().required().messages({
        'any.required': 'La categoría es requerida'
    }),
    nombre_producto: Joi.string().min(2).required().messages({
        'any.required': 'El nombre del producto es requerido'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'any.required': 'El stock es requerido'
    }),
    precio_producto: Joi.number().positive().required().messages({
        'any.required': 'El precio es requerido'
    }),
    descripcion: Joi.string().optional(),
    promociones: Joi.string().required().messages({
        'any.required': 'Las promociones son requeridas'
    })
});

module.exports = { productoSchema };