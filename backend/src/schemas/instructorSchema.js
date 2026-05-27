const Joi = require('joi');

// ✅ POST /api/instructores — Crear (todos requeridos)
const crearInstructorSchema = Joi.object({
    nombre: Joi.string().min(2).required().messages({
        'string.min': 'El nombre debe tener mínimo 2 caracteres',
        'any.required': 'El nombre es requerido'
    }),
    apellido: Joi.string().min(2).required().messages({
        'any.required': 'El apellido es requerido'
    }),
    correo: Joi.string().email().required().messages({
        'string.email': 'El correo debe ser válido',
        'any.required': 'El correo es requerido'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe tener mínimo 6 caracteres',
        'any.required': 'La contraseña es requerida'
    }),
    especialidad: Joi.string().required().messages({
        'any.required': 'La especialidad es requerida'
    }),
    horario_laboral: Joi.string().required().messages({
        'any.required': 'El horario laboral es requerido'
    }),
    salario: Joi.number().positive().required().messages({
        'number.positive': 'El salario debe ser mayor a 0',
        'any.required': 'El salario es requerido'
    }),
    puntuacion: Joi.string().optional(),
    descripcion: Joi.string().optional()
});

// ✅ PUT /api/instructores/:id — Actualizar (parcial)
const actualizarInstructorSchema = Joi.object({
    nombre: Joi.string().min(2).optional(),
    apellido: Joi.string().min(2).optional(),
    correo: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    especialidad: Joi.string().optional(),
    horario_laboral: Joi.string().optional(),
    salario: Joi.number().positive().optional(),
    puntuacion: Joi.string().optional(),
    descripcion: Joi.string().optional()
}).min(1).messages({
    'object.min': 'Debe enviar al menos un campo para actualizar'
});

module.exports = { 
    crearInstructorSchema, 
    actualizarInstructorSchema 
};