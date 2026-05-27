const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { asistenciaSchema } = require('../schemas/asistenciaSchema');

// Rutas protegidas (requieren autenticación)
router.use(protegerRuta);

// ADMIN puede ver todas las asistencias
router.get('/', verificarRol(1), asistenciaController.getAsistencias);

// Cualquier usuario autenticado puede ver asistencias específicas
router.get('/:id', asistenciaController.getAsistenciaById);
router.get('/usuario/:idUsuario', asistenciaController.getAsistenciasByUsuario);
router.get('/clase/:idClase', asistenciaController.getAsistenciasByClase);

// Registrar asistencia (con validación Joi)
router.post('/', validate(asistenciaSchema), asistenciaController.postAsistencia);

// Eliminar asistencia (solo ADMIN)
router.delete('/:id', verificarRol(1), asistenciaController.deleteAsistencia);

router.get('/clase/:id', protegerRuta, async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const [rows] = await pool.query(`
            SELECT a.*, 
                   u.nombre as usuario_nombre, u.apellido as usuario_apellido,
                   u.correo
            FROM Asistencias a
            JOIN Usuarios u ON a.FK_id_usuario = u.PK_id_usuario
            WHERE a.FK_id_clase = ?
        `, [req.params.id]);
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;