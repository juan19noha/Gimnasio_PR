const Joi = require('joi');

const compraSchema = Joi.object({
    datos: Joi.object({
        FK_id_proveedor: Joi.number().integer().positive().required().messages({
            'any.required': 'El proveedor es requerido'
        }),
        FK_id_administrador: Joi.number().integer().positive().required().messages({
            'any.required': 'El administrador es requerido'
        })
        // ❌ ELIMINADO: total_compra (se calcula en el backend)
    }).required(),
    detalles: Joi.array().items(
        Joi.object({
            FK_id_producto: Joi.number().integer().positive().required().messages({
                'any.required': 'El producto es requerido'
            }),
            cantidad: Joi.number().integer().positive().required().messages({
                'any.required': 'La cantidad es requerida'
            }),
            precio_unidad: Joi.number().positive().required().messages({
                'any.required': 'El precio por unidad es requerido'
            })
        })
    ).min(1).required().messages({
        'array.min': 'Debe incluir al menos un producto',
        'any.required': 'Los detalles de la compra son requeridos'
    })
});

module.exports = { compraSchema };