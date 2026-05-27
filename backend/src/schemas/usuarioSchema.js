const Joi = require('joi');

const actualizarUsuarioSchema = Joi.object({
    nombre: Joi.string().min(2).optional().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
    apellido: Joi.string().min(2).optional().messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres'
    }),
    telefono: Joi.string().min(7).optional().messages({
        'string.min': 'El teléfono debe tener al menos 7 caracteres'
    }),
    sexo: Joi.string().valid('Masculino', 'Femenino', 'Otro').optional().messages({
        'any.only': 'El sexo debe ser Masculino, Femenino u Otro'
    })
}).min(1).messages({
    'object.min': 'Debe enviar al menos un campo para actualizar'
});

module.exports = { actualizarUsuarioSchema };