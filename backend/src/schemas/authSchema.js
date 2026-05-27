const Joi = require('joi');

const loginSchema = Joi.object({
    correo: Joi.string().email().required().messages({
        'string.email': 'El correo debe ser válido',
        'any.required': 'El correo es requerido'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'La contraseña es requerida'
    })
});

const registroSchema = Joi.object({
    tipo_documento: Joi.string().optional(),
    numero_documento: Joi.string().optional(),
    nombre: Joi.string().min(2).required().messages({
        'any.required': 'El nombre es requerido'
    }),
    apellido: Joi.string().min(2).required().messages({
        'any.required': 'El apellido es requerido'
    }),
    sexo: Joi.string().valid('Masculino', 'Femenino', 'Otro').optional(),
    correo: Joi.string().email().required().messages({
        'string.email': 'El correo debe ser válido',
        'any.required': 'El correo es requerido'
    }),
    telefono: Joi.string().optional(),
    password: Joi.string().min(6).required().messages({
        'any.required': 'La contraseña es requerida'
    }),
    tabla: Joi.string().valid('administrador', 'instructor', 'usuario', 'proveedor').optional()
});

module.exports = { loginSchema, registroSchema };