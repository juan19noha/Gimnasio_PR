const { Router } = require('express');
const { 
    getsuscripciones, 
    getSuscripcionByUsuario, 
    postSuscripcion, 
    putEstadoSuscripcion,
    postSolicitarPlan,
    postPagar,
    patchCancelar
} = require('../controllers/suscripcionController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { suscripcionSchema, estadoSuscripcionSchema, pagoSchema } = require('../schemas/suscripcionSchema');

const router = Router();

// Rutas para admin
router.get('/', protegerRuta, verificarRol(1), getsuscripciones);
router.post('/', protegerRuta, verificarRol(1), validate(suscripcionSchema), postSuscripcion);
router.put('/:id/estado', protegerRuta, verificarRol(1), validate(estadoSuscripcionSchema), putEstadoSuscripcion);

// Rutas para cliente (protegidas, cualquier rol autenticado)
router.get('/usuario/me', protegerRuta, getSuscripcionByUsuario);
router.post('/solicitar', protegerRuta, postSolicitarPlan);
router.post('/pagar', protegerRuta, validate(pagoSchema), postPagar);
router.patch('/:id/cancelar', protegerRuta, patchCancelar);

module.exports = router;