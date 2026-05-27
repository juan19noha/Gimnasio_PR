import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaCheck, FaTimes, FaUserCheck } from 'react-icons/fa';

const MisClases = () => {
    const [clases, setClases] = useState([]);
    const [misClases, setMisClases] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarClases();
        cargarMisClases();
    }, []);

    const cargarClases = async () => {
        try {
            const { data } = await api.get('/clases');
            setClases(data.data || []);
        } catch (error) {
            console.error('Error cargando clases:', error);
        } finally {
            setCargando(false);
        }
    };

    const cargarMisClases = async () => {
        try {
            const { data } = await api.get('/clases/mis-clases');
            setMisClases(data.data.map(c => c.PK_id_clase));
        } catch (error) {
            console.error('Error cargando mis clases:', error);
        }
    };

    const inscribirse = async (id_clase) => {
        try {
            const { data } = await api.post('/clases/inscribirse', { id_clase });
            setMensaje(data.message);
            setMisClases([...misClases, id_clase]);
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al inscribirse');
            setTimeout(() => setMensaje(''), 3000);
        }
    };

    const styles = {
        title: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
        mensaje: { 
            position: 'fixed', 
            top: '2rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#1a1a1a', 
            border: '1px solid #FFD700', 
            color: '#FFD700', 
            padding: '1rem 2rem', 
            borderRadius: '8px', 
            zIndex: 2000, 
            fontWeight: 'bold' 
        },
        mensajeError: { 
            position: 'fixed', 
            top: '2rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#1a1a1a', 
            border: '1px solid #ff4444', 
            color: '#ff4444', 
            padding: '1rem 2rem', 
            borderRadius: '8px', 
            zIndex: 2000, 
            fontWeight: 'bold' 
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid #FFD700' },
        nombre: { color: '#FFD700', fontWeight: 'bold', marginBottom: '0.75rem' },
        info: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '0.4rem' },
        btn: { 
            width: '100%', 
            padding: '0.75rem', 
            background: 'linear-gradient(135deg, #FFD700, #B8860B)', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#0a0a0a', 
            fontWeight: 'bold', 
            marginTop: '1rem', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        },
        btnInscrito: { 
            width: '100%', 
            padding: '0.75rem', 
            background: '#00C851', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#fff', 
            fontWeight: 'bold', 
            marginTop: '1rem',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        },
        btnLleno: { 
            width: '100%', 
            padding: '0.75rem', 
            background: '#222', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#666', 
            fontWeight: 'bold', 
            marginTop: '1rem',
            cursor: 'not-allowed'
        }
    };

    return (
        <ClienteLayout>
            <div style={styles.title}><FaCalendarAlt /> Clases Disponibles</div>
            
            {mensaje && (
                <div style={mensaje.includes('Error') || mensaje.includes('Ya') || mensaje.includes('Cupo') ? styles.mensajeError : styles.mensaje}>
                    {mensaje}
                </div>
            )}
            
            {cargando ? <p style={{color:'#FFD700'}}>Cargando...</p> : (
                <div style={styles.grid}>
                    {clases.map(c => {
                        const inscrito = misClases.includes(c.PK_id_clase);
                        // Contar inscritos (si tu API no lo trae, necesitarás ajustar esto)
                        const inscritos = c.asistencia || 0;
                        const cupoLleno = inscritos >= c.capacidad_maxima;
                        
                        return (
                            <div key={c.PK_id_clase} style={styles.card}>
                                <div style={styles.nombre}>{c.nombre_clase}</div>
                                <div style={styles.info}><FaClock /> {new Date(c.fecha_hora).toLocaleString()}</div>
                                <div style={styles.info}><FaMapMarkerAlt /> {c.lugar}</div>
                                <div style={styles.info}><FaUsers /> {inscritos}/{c.capacidad_maxima} inscritos</div>
                                
                                {inscrito ? (
                                    <button style={styles.btnInscrito} disabled>
                                        <FaCheck /> Inscrito
                                    </button>
                                ) : cupoLleno ? (
                                    <button style={styles.btnLleno} disabled>
                                        <FaTimes /> Cupo Lleno
                                    </button>
                                ) : (
                                    <button style={styles.btn} onClick={() => inscribirse(c.PK_id_clase)}>
                                        <FaUserCheck /> Inscribirme
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </ClienteLayout>
    );
};

export default MisClases;