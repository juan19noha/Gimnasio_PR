const { login, registro } = require('../services/authService');

const loginController = async (req, res, next) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }

        const resultado = await login(correo, password);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token: resultado.token,
            usuario: resultado.usuario,
            tabla: resultado.tabla
        });

    } catch (error) {
        next(error);
    }
};

const registroController = async (req, res, next) => {
    try {
        // ✅ Si no viene 'tabla', default a 'usuario' (cliente/rol 3)
        const { tabla = 'usuario', ...datos } = req.body;

        await registro(datos, tabla);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { loginController, registroController };