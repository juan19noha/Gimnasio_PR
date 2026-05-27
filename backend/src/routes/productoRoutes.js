const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { productoschema } = require('../schemas/productoschema');

// Rutas públicas (cualquiera puede ver productos)
router.get('/', productoController.getproductos);
router.get('/:id', productoController.getProductoById);
router.get('/categoria/:idCategoria', productoController.getproductosByCategoria);

// Rutas protegidas (solo ADMIN) + validación Joi
router.post('/', protegerRuta, verificarRol(1), validate(productoschema), productoController.postProducto);
router.put('/:id', protegerRuta, verificarRol(1), validate(productoschema), productoController.putProducto);
router.delete('/:id', protegerRuta, verificarRol(1), productoController.deleteProducto);

// Actualizar stock (ADMIN)
router.patch('/:id/stock', protegerRuta, verificarRol(1), productoController.patchStock);

module.exports = router;