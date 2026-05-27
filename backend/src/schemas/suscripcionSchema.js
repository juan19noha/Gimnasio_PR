const Joi = require('joi');

const suscripcionSchema = Joi.object({
    FK_id_Plan: Joi.number().integer().required().messages({
        'any.required': 'El plan es requerido',
        'number.base': 'El plan debe ser un número'
    }),
    FK_id_usuario: Joi.number().integer().required().messages({
        'any.required': 'El usuario es requerido',
        'number.base': 'El usuario debe ser un número'
    }),
    fecha_inicio: Joi.date().required().messages({
        'any.required': 'La fecha de inicio es requerida'
    }),
    fecha_vencimiento: Joi.date().required().messages({
        'any.required': 'La fecha de vencimiento es requerida'
    }),
    precio_suscripcion: Joi.number().positive().required().messages({
        'number.positive': 'El precio debe ser mayor a 0',
        'any.required': 'El precio es requerido'
    })
});

const estadoSuscripcionSchema = Joi.object({
    estado: Joi.string().valid('Activa', 'Cancelada', 'Vencida', 'Suspendida', 'Pendiente de pago').required().messages({
        'any.required': 'El estado es requerido',
        'any.only': 'El estado debe ser: Activa, Cancelada, Vencida, Suspendida o Pendiente de pago'
    })
});

// Schema para solicitud de suscripción (cliente)
const solicitudSuscripcionSchema = Joi.object({
    FK_id_Plan: Joi.number().integer().required().messages({
        'any.required': 'El plan es requerido',
        'number.base': 'El plan debe ser un número'
    }),
    FK_id_usuario: Joi.number().integer().required().messages({
        'any.required': 'El usuario es requerido',
        'number.base': 'El usuario debe ser un número'
    })
});

// Schema para procesar pago
const pagoSchema = Joi.object({
    id_suscripcion: Joi.number().integer().required().messages({
        'any.required': 'La suscripción es requerida',
        'number.base': 'La suscripción debe ser un número'
    }),
    metodo_pago: Joi.string().valid('Transferencia bancaria', 'Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito').required().messages({
        'any.required': 'El método de pago es requerido',
        'any.only': 'Método de pago no válido'
    })
});

module.exports = { 
    suscripcionSchema, 
    estadoSuscripcionSchema,
    solicitudSuscripcionSchema,
    pagoSchema
};