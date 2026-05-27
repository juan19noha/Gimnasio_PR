const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { categoriaSchema } = require('../schemas/categoriaSchema');

router.get('/', categoriaController.getcategorias);
router.get('/tipo/:tipo', categoriaController.getcategoriasPorTipo);
router.post('/', protegerRuta, verificarRol(1), validate(categoriaSchema), categoriaController.postCategoria);

module.exports = router;