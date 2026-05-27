import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { FaDumbbell } from 'react-icons/fa';

const MisRutinas = () => {
    const [rutinas, setRutinas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { usuario } = useAuth();

    useEffect(() => {
        const cargar = async () => {
            try {
                const id = usuario?.PK_id_usuario;
                if (id) {
                    const { data } = await api.get(`/rutinas/usuario/${id}`);
                    setRutinas(data.data);
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
        objetivo: { color: '#888', fontSize: '0.9rem' },
    };

    return (
        <ClienteLayout>
            <div style={styles.title}><FaDumbbell /> Mis Rutinas</div>
            {cargando ? <p style={{color:'#FFD700'}}>Cargando...</p> :
             rutinas.length === 0 ? <p style={{color:'#888'}}>No tienes rutinas asignadas.</p> :
             rutinas.map(r => (
                <div key={r.PK_id_rutina} style={styles.card}>
                    <div style={styles.nombre}>{r.nombre_rutina}</div>
                    <div style={styles.objetivo}>🎯 Objetivo: {r.objetivo}</div>
                </div>
             ))
            }
        </ClienteLayout>
    );
};

export default MisRutinas;