const app = require('./app');
const pool = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));



const startServer = async () => {
    try {
        await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        process.exit(1);
    }
};

startServer();