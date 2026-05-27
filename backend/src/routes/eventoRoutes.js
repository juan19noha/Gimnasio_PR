const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { eventoschema } = require('../schemas/eventoschema');

router.get('/', eventoController.geteventos);
router.get('/:id', eventoController.getEventoById);
router.post('/', protegerRuta, verificarRol(1), validate(eventoschema), eventoController.postEvento);
router.put('/:id', protegerRuta, verificarRol(1), validate(eventoschema), eventoController.putEvento);
router.delete('/:id', protegerRuta, verificarRol(1), eventoController.deleteEvento);

module.exports = router;