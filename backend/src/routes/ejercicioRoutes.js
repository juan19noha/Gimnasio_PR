const express = require('express');
const router = express.Router();
const ejercicioController = require('../controllers/ejercicioController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { ejercicioschema } = require('../schemas/ejercicioschema');

router.get('/', ejercicioController.getejercicios);
router.get('/:id', ejercicioController.getEjercicioById);
router.get('/musculo/:musculo', ejercicioController.getejerciciosByMusculo);
router.post('/', protegerRuta, verificarRol(1), validate(ejercicioschema), ejercicioController.postEjercicio);
router.put('/:id', protegerRuta, verificarRol(1), validate(ejercicioschema), ejercicioController.putEjercicio);
router.delete('/:id', protegerRuta, verificarRol(1), ejercicioController.deleteEjercicio);

module.exports = router;