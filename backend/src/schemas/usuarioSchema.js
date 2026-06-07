const Joi = require('joi');

const actualizarUsuarioSchema = Joi.object({
    nombre: Joi.string().min(2).optional().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
    apellido: Joi.string().min(2).optional().messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres'
    }),
    correo: Joi.string().email().optional().messages({
        'string.email': 'El correo debe ser válido'
    }),
    telefono: Joi.string().min(7).optional().messages({
        'string.min': 'El teléfono debe tener al menos 7 caracteres'
    }),
    sexo: Joi.string().valid('M', 'F', 'O', 'Masculino', 'Femenino', 'Otro').optional().messages({
        'any.only': 'El sexo no es válido'
    }),
    tipo_documento: Joi.string().valid('CC', 'CE', 'TI', 'PAS').optional(),
    numero_documento: Joi.string().optional()
}).min(1).messages({
    'object.min': 'Debe enviar al menos un campo para actualizar'
});

module.exports = { actualizarUsuarioSchema };