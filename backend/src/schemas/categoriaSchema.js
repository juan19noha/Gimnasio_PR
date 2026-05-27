const Joi = require('joi');

const categoriaSchema = Joi.object({
    nombre_categoria: Joi.string().min(3).required().messages({
        'any.required': 'El nombre de la categoría es requerido'
    }),
    tipo_categoria: Joi.string().valid('Producto', 'Clases').required().messages({
        'any.only': 'El tipo debe ser Producto o Clases',
        'any.required': 'El tipo de categoría es requerido'
    }),
    descripcion_categoria: Joi.string().optional()
});

module.exports = { categoriaSchema };