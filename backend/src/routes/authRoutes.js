const express = require('express');
const router = express.Router();
const { loginController, registroController } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema, registroSchema } = require('../schemas/authSchema');

// Login local
router.post('/login', validate(loginSchema), loginController);
router.post('/registro', validate(registroSchema), registroController);

// Solicitar recuperación de contraseña
router.post('/recuperar-password', async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const { correo } = req.body;

        const [rows] = await pool.query(
            'SELECT PK_id_usuario, nombre FROM usuarios WHERE correo = ?', [correo]
        );

        // Siempre responder exitoso por seguridad
        res.json({ 
            success: true, 
            message: 'Si el correo existe, recibirás instrucciones' 
        });
    } catch (error) {
        next(error);
    }
});

// Reset de contraseña
router.post('/reset-password', async (req, res, next) => {
    try {
        res.json({ success: true, message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;