const express = require('express');
const router = express.Router();
const { getusuarios, getUsuarioById, updateUsuario, deleteUsuario } = require('../controllers/usuarioController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { actualizarusuarioschema } = require('../schemas/usuarioschema');

router.get('/', protegerRuta, verificarRol(1), getusuarios);
router.get('/:id', protegerRuta, getUsuarioById);
router.put('/:id', protegerRuta, validate(actualizarusuarioschema), updateUsuario);
router.delete('/:id', protegerRuta, verificarRol(1), deleteUsuario);
router.get('/proveedores', protegerRuta, verificarRol(1), async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const [rows] = await pool.query(
            'SELECT PK_id_usuario, nombre, apellido, correo, nombre_empresa FROM usuarios WHERE FK_id_rol = 4'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
});

// Cambiar contraseña
router.put('/:id/password', protegerRuta, async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const bcrypt = require('bcryptjs');
        const { passwordActual, passwordNueva } = req.body;

        const [rows] = await pool.query(
            'SELECT password FROM usuarios WHERE PK_id_usuario = ?', [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const valida = await bcrypt.compare(passwordActual, rows[0].password);
        if (!valida) {
            return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordNueva, salt);

        await pool.query(
            'UPDATE usuarios SET password = ? WHERE PK_id_usuario = ?', [hash, req.params.id]
        );
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        next(error);
    }
});

// Obtener proveedores (FK_id_rol = 4)
router.get('/proveedores', protegerRuta, async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const [rows] = await pool.query(
            'SELECT PK_id_usuario, nombre, apellido, correo, nombre_empresa FROM usuarios WHERE FK_id_rol = 4'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;