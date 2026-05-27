const express = require('express');
const router = express.Router();
const ejercicioController = require('../controllers/ejercicioController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { ejercicioSchema } = require('../schemas/ejercicioSchema');

router.get('/', ejercicioController.getEjercicios);
router.get('/:id', ejercicioController.getEjercicioById);
router.get('/musculo/:musculo', ejercicioController.getEjerciciosByMusculo);
router.post('/', protegerRuta, verificarRol(1), validate(ejercicioSchema), ejercicioController.postEjercicio);
router.put('/:id', protegerRuta, verificarRol(1), validate(ejercicioSchema), ejercicioController.putEjercicio);
router.delete('/:id', protegerRuta, verificarRol(1), ejercicioController.deleteEjercicio);

module.exports = router;