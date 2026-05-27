const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { facturaSchema } = require('../schemas/facturaSchema');

router.get('/', protegerRuta, verificarRol(1), facturaController.getFacturas);
router.get('/:id', protegerRuta, facturaController.getFacturaById);
router.get('/usuario/:idUsuario', protegerRuta, facturaController.getFacturasByUsuario);
router.post('/', protegerRuta, verificarRol(1), validate(facturaSchema), facturaController.postFactura);

module.exports = router;