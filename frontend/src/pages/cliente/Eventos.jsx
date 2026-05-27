import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { FaCalendarCheck, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await api.get('/eventos');
                setEventos(data.data);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const styles = {
        title: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', borderTop: '3px solid #FFD700' },
        nombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.75rem' },
        info: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '0.4rem' },
        desc: { color: '#666', fontSize: '0.85rem', marginTop: '0.75rem' },
    };

    return (
        <ClienteLayout>
            <div style={styles.title}><FaCalendarCheck /> Eventos</div>
            {cargando ? <p style={{color:'#FFD700'}}>Cargando...</p> : (
                <div style={styles.grid}>
                    {eventos.map(e => (
                        <div key={e.PK_id_evento} style={styles.card}>
                            <div style={styles.nombre}>{e.nombre_evento}</div>
                            <div style={styles.info}><FaClock /> {new Date(e.fecha_hora).toLocaleString()}</div>
                            <div style={styles.info}><FaMapMarkerAlt /> {e.lugar}</div>
                            {e.descripcion_evento && <div style={styles.desc}>{e.descripcion_evento}</div>}
                        </div>
                    ))}
                </div>
            )}
        </ClienteLayout>
    );
};

export default Eventos;