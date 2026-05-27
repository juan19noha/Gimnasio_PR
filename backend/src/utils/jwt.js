const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarToken = (usuario) => {
    const payload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const verificarToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generarToken, verificarToken };