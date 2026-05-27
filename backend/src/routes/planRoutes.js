const express = require('express');
const router = express.Router();
const { getPlanes, getPlanById, postPlan, putPlan, deletePlan } = require('../controllers/planController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { planSchema } = require('../schemas/planSchema');

// Cualquiera puede ver los planes
router.get('/', getPlanes);
router.get('/:id', getPlanById);

// Solo administradores pueden crear, editar y eliminar + validación Joi
router.post('/', protegerRuta, verificarRol(1), validate(planSchema), postPlan);
router.put('/:id', protegerRuta, verificarRol(1), validate(planSchema), putPlan);
router.delete('/:id', protegerRuta, verificarRol(1), deletePlan);

module.exports = router;