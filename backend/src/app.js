const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const planRoutes = require('./routes/planRoutes');
const suscripcionRoutes = require('./routes/suscripcionRoutes');
const productoRoutes = require('./routes/productoRoutes');
const claseRoutes = require('./routes/claseRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const rutinaRoutes = require('./routes/rutinaRoutes');
const dietaRoutes = require('./routes/dietaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const ejercicioRoutes = require('./routes/ejercicioRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const compraRoutes = require('./routes/compraRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/planes', planRoutes);
app.use('/api/suscripciones', suscripcionRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/instructores', instructorRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/dietas', dietaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor logístico operando correctamente',
        timestamp: new Date().toISOString() 
    });
});

app.use(errorHandler);

module.exports = app;