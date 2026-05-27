const express = require('express');
const router = express.Router();
const rutinaController = require('../controllers/rutinaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { rutinaschema, ejerciciorutinaschema } = require('../schemas/rutinaschema');

// Rutas protegidas (requieren autenticación)
router.use(protegerRuta);

// Ver rutinas (propias o todas si es admin)
router.get('/', rutinaController.getrutinas);
router.get('/:id', rutinaController.getRutinaById);
router.get('/usuario/:idUsuario', rutinaController.getrutinasByUsuario);

// Crear y modificar rutinas (con validación Joi)
router.post('/', validate(rutinaschema), rutinaController.postRutina);
router.post('/:id/ejercicios', validate(ejerciciorutinaschema), rutinaController.postEjercicioARutina);
router.put('/:id', validate(rutinaschema), rutinaController.putRutina);

// Eliminar (solo ADMIN o el propio usuario de sus rutinas)
router.delete('/:id', rutinaController.deleteRutina);
router.delete('/ejercicios/:idDetalle', rutinaController.deleteEjercicioDeRutina);

router.post('/:id/ejercicios', protegerRuta, async (req, res, next) => {
    try {
        const pool = require('../config/db');
        const { FK_id_ejercicio, series, repeticiones, tiempo_descanso } = req.body;
        const [result] = await pool.query(`
            INSERT INTO detalle_rutinas (FK_id_rutina, FK_id_ejercicio, series, repeticiones, tiempo_descanso)
            VALUES (?, ?, ?, ?, ?)
        `, [req.params.id, FK_id_ejercicio, series, repeticiones, tiempo_descanso]);
        res.json({ success: true, data: { id: result.insertId } });
    } catch (error) {
        next(error);
    }
});

module.exports = router;