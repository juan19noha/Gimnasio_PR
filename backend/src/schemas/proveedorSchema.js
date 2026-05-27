const Joi = require('joi');

const proveedorSchema = Joi.object({
    nombre_empresa: Joi.string().min(2).required().messages({
        'any.required': 'El nombre de la empresa es requerido'
    }),
    contacto: Joi.string().required().messages({
        'any.required': 'El contacto es requerido'
    }),
    telefono: Joi.string().min(7).required().messages({
        'any.required': 'El teléfono es requerido'
    }),
    direccion: Joi.string().optional(),
    correo: Joi.string().email().optional().messages({
        'string.email': 'El correo debe ser válido'
    })
});

module.exports = { proveedorSchema };