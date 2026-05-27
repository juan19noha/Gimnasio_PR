const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { crearInstructorSchema, actualizarInstructorSchema } = require('../schemas/instructorSchema');

// Rutas públicas (cualquiera puede ver instructores)
router.get('/', instructorController.getInstructores);
router.get('/:id', instructorController.getInstructorById);

// Rutas protegidas (solo ADMIN) + validación Joi
router.post('/', protegerRuta, verificarRol(1), validate(crearInstructorSchema), instructorController.postInstructor);
router.put('/:id', protegerRuta, verificarRol(1), validate(actualizarInstructorSchema), instructorController.putInstructor);
router.delete('/:id', protegerRuta, verificarRol(1), instructorController.deleteInstructor);

module.exports = router;