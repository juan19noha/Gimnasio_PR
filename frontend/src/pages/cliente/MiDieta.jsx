import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { FaAppleAlt } from 'react-icons/fa';

const MiDieta = () => {
    const [dietas, setDietas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { usuario } = useAuth();

    useEffect(() => {
        const cargar = async () => {
            try {
                const id = usuario?.PK_id_usuario;
                if (id) {
                    const { data } = await api.get(`/dietas/usuario/${id}`);
                    setDietas(data.data);
                }
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [usuario]);

    const styles = {
        title: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #FFD700' },
        nombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' },
        info: { color: '#888', fontSize: '0.9rem', marginBottom: '0.3rem' },
    };

    return (
        <ClienteLayout>
            <div style={styles.title}><FaAppleAlt /> Mi Dieta</div>
            {cargando ? <p style={{color:'#FFD700'}}>Cargando...</p> :
             dietas.length === 0 ? <p style={{color:'#888'}}>No tienes dietas asignadas.</p> :
             dietas.map(d => (
                <div key={d.PK_id_dieta} style={styles.card}>
                    <div style={styles.nombre}>{d.nombre_dieta}</div>
                    <div style={styles.info}>🔥 Objetivo: {d.objetivo_calorias}</div>
                    <div style={styles.info}>📅 Inicio: {new Date(d.fecha_inicio).toLocaleDateString()}</div>
                    {d.fecha_fin && <div style={styles.info}>📅 Fin: {new Date(d.fecha_fin).toLocaleDateString()}</div>}
                </div>
             ))
            }
        </ClienteLayout>
    );
};

export default MiDieta;