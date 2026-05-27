const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { proveedorSchema } = require('../schemas/proveedorSchema');

router.get('/', proveedorController.getproveedores);
router.get('/:id', proveedorController.getProveedorById);
router.post('/', protegerRuta, verificarRol(1), validate(proveedorSchema), proveedorController.postProveedor);
router.put('/:id', protegerRuta, verificarRol(1), validate(proveedorSchema), proveedorController.putProveedor);
router.delete('/:id', protegerRuta, verificarRol(1), proveedorController.deleteProveedor);

module.exports = router;