const express = require('express');
const router = express.Router();
const dietaController = require('../controllers/dietaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { dietaSchema, comidadietaSchema } = require('../schemas/dietaSchema');

// Rutas protegidas (requieren autenticación)
router.use(protegerRuta);

// Ver dietas
router.get('/', dietaController.getdietas);
router.get('/:id', dietaController.getDietaById);
router.get('/usuario/:idUsuario', dietaController.getdietasByUsuario);

// Crear y modificar dietas (con validación Joi)
router.post('/', validate(dietaSchema), dietaController.postDieta);
router.post('/:id/comidas', validate(comidadietaSchema), dietaController.postComidaADieta);
router.put('/:id', validate(dietaSchema), dietaController.putDieta);

// Eliminar
router.delete('/:id', dietaController.deleteDieta);
router.delete('/comidas/:idDetalle', dietaController.deleteComidaDeDieta);

module.exports = router;