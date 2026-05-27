const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { facturaschema } = require('../schemas/facturaschema');

router.get('/', protegerRuta, verificarRol(1), facturaController.getfacturas);
router.get('/:id', protegerRuta, facturaController.getFacturaById);
router.get('/usuario/:idUsuario', protegerRuta, facturaController.getfacturasByUsuario);
router.post('/', protegerRuta, verificarRol(1), validate(facturaschema), facturaController.postFactura);

module.exports = router;