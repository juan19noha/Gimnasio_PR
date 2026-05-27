const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const mensajes = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errores: mensajes
            });
        }
        next();
    };
};

module.exports = validate;