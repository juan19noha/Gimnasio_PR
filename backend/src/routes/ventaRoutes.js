const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { protegerRuta, verificarRol } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { ventaSchema } = require('../schemas/ventaSchema');
const db = require('../config/db');

// Rutas existentes (solo admin)
router.get('/', protegerRuta, verificarRol(1), ventaController.getVentas);
router.get('/usuario/:idUsuario', protegerRuta, ventaController.getVentasByUsuario);
router.post('/', protegerRuta, verificarRol(1), validate(ventaSchema), ventaController.postVenta);

// Ruta para clientes comprar productos
router.post('/cliente', protegerRuta, async (req, res) => {
    try {
        const { productos, total } = req.body;
        const id_usuario = req.usuario.id || req.usuario.PK_id_usuario || req.usuario.id_usuario;
        
        if (!id_usuario) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario no identificado en el token' 
            });
        }

        if (!productos || productos.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El carrito está vacío' 
            });
        }

        for (const prod of productos) {
            const subtotal = prod.cantidad * prod.precio_unitario;
            
            await db.query(
                `INSERT INTO detalle_venta_producto 
                 (FK_id_usuario, FK_id_producto, FK_id_evento, cantidad, total) 
                 VALUES (?, ?, NULL, ?, ?)`,
                [id_usuario, prod.id_producto, prod.cantidad, subtotal]
            );
            
            await db.query(
                `UPDATE productos SET stock = stock - ? WHERE PK_id_producto = ?`,
                [prod.cantidad, prod.id_producto]
            );
        }
        
        res.json({ 
            success: true, 
            message: 'Compra realizada con éxito', 
            total: total
        });
        
    } catch (error) {
        console.error('Error en compra cliente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al procesar la compra: ' + error.message 
        });
    }
});

// Ruta para ver compras del usuario logueado
router.get('/mis-compras', protegerRuta, async (req, res) => {
    try {
        const id_usuario = req.usuario.id || req.usuario.PK_id_usuario || req.usuario.id_usuario;
        
        const [compras] = await db.query(
            `SELECT 
                d.PK_id_detalle,
                d.cantidad,
                d.total,
                d.fecha_venta,
                p.PK_id_producto,
                p.nombre_producto,
                p.precio_producto
             FROM detalle_venta_producto d
             JOIN productos p ON d.FK_id_producto = p.PK_id_producto
             WHERE d.FK_id_usuario = ?
             ORDER BY d.fecha_venta DESC`,
            [id_usuario]
        );
        
        res.json({ 
            success: true, 
            data: compras 
        });
        
    } catch (error) {
        console.error('Error obteniendo compras:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener compras: ' + error.message 
        });
    }
});

module.exports = router;