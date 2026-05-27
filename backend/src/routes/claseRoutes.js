const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { claseSchema } = require('../schemas/claseSchema');
const db = require('../config/db');

// ============================================
// RUTAS PÚBLICAS (cualquiera puede ver)
// ============================================

router.get('/', claseController.getClases);
router.get('/:id', claseController.getClaseById);
router.get('/instructor/:idInstructor', claseController.getClasesByInstructor);
router.get('/fecha/:fecha', claseController.getClasesByFecha);

// ============================================
// NUEVAS RUTAS: Inscripción de clientes
// ============================================
// IMPORTANTE: Van ANTES de rutas con parámetros genéricos para evitar conflictos

// POST /api/clases/inscribirse - Cliente se inscribe a una clase
router.post('/inscribirse', protegerRuta, async (req, res) => {
    try {
        const { id_clase } = req.body;
        const id_usuario = req.usuario.id || req.usuario.PK_id_usuario;

        if (!id_clase) {
            return res.status(400).json({ success: false, message: 'ID de clase requerido' });
        }

        // Verificar que la clase existe
        const [clases] = await db.query(
            `SELECT capacidad_maxima FROM clases WHERE PK_id_clase = ?`,
            [id_clase]
        );

        if (clases.length === 0) {
            return res.status(404).json({ success: false, message: 'Clase no encontrada' });
        }

        const capacidad = clases[0].capacidad_maxima;

        // Contar inscritos actuales
        const [inscritos] = await db.query(
            `SELECT COUNT(*) as total FROM asistencias WHERE FK_id_clase = ?`,
            [id_clase]
        );

        if (inscritos[0].total >= capacidad) {
            return res.status(400).json({ success: false, message: 'Cupo lleno' });
        }

        // Verificar que no esté ya inscrito
        const [yaInscrito] = await db.query(
            `SELECT PK_id_asistencia FROM asistencias 
             WHERE FK_id_usuario = ? AND FK_id_clase = ?`,
            [id_usuario, id_clase]
        );

        if (yaInscrito.length > 0) {
            return res.status(400).json({ success: false, message: 'Ya estás inscrito en esta clase' });
        }

        // Crear asistencia
        await db.query(
            `INSERT INTO asistencias (FK_id_usuario, FK_id_clase) VALUES (?, ?)`,
            [id_usuario, id_clase]
        );

        res.json({ success: true, message: 'Inscripción exitosa' });

    } catch (error) {
        console.error('Error en inscripción:', error);
        res.status(500).json({ success: false, message: 'Error al inscribirse: ' + error.message });
    }
});

// GET /api/clases/mis-clases - Ver clases del usuario logueado
router.get('/mis-clases', protegerRuta, async (req, res) => {
    try {
        const id_usuario = req.usuario.id || req.usuario.PK_id_usuario;

        const [clases] = await db.query(
            `SELECT c.*, u.nombre as instructor_nombre, u.apellido as instructor_apellido
             FROM clases c
             JOIN asistencias a ON c.PK_id_clase = a.FK_id_clase
             LEFT JOIN usuarios u ON c.FK_id_instructor = u.PK_id_usuario
             WHERE a.FK_id_usuario = ?
             ORDER BY c.fecha_hora ASC`,
            [id_usuario]
        );

        res.json({ success: true, data: clases });

    } catch (error) {
        console.error('Error obteniendo mis clases:', error);
        res.status(500).json({ success: false, message: 'Error al obtener clases: ' + error.message });
    }
});

// ============================================
// RUTAS PROTEGIDAS (solo ADMIN)
// ============================================

router.post('/', protegerRuta, verificarRol(1), validate(claseSchema), claseController.postClase);
router.put('/:id', protegerRuta, verificarRol(1), validate(claseSchema), claseController.putClase);
router.delete('/:id', protegerRuta, verificarRol(1), claseController.deleteClase);

// ============================================
// RUTA ESPECIAL: Detalle del instructor
// ============================================

router.get('/instructor/:id', protegerRuta, async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, 
                   u.nombre as instructor_nombre, u.apellido as instructor_apellido,
                   cat.nombre_categoria
            FROM clases c
            JOIN usuarios u ON c.FK_id_instructor = u.PK_id_usuario
            JOIN categorias cat ON c.FK_id_categoria = cat.PK_id_categoria
            WHERE c.FK_id_instructor = ?
        `, [req.params.id]);
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;