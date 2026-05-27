const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { compraSchema } = require('../schemas/compraSchema');

router.get('/', protegerRuta, verificarRol(1), compraController.getCompras);
router.get('/:id', protegerRuta, verificarRol(1), compraController.getCompraById);
router.post('/', protegerRuta, verificarRol(1), validate(compraSchema), compraController.postCompra);

module.exports = router;