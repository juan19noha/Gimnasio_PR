import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import { useAuth } from '../../context/AuthContext';
import { 
    FaCalendarAlt, FaUsers, FaClipboardList, FaDumbbell,
    FaClock, FaMapMarkerAlt 
} from 'react-icons/fa';

const DashboardInstructor = () => {
    const { usuario } = useAuth();
    const [clases, setClases] = useState([]);
    const [asistenciasHoy, setAsistenciasHoy] = useState(0);
    const [rutinasCreadas, setRutinasCreadas] = useState(0);
    const [proximaClase, setProximaClase] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            
            // Cargar clases del instructor
            const clasesRes = await api.get(`/clases/instructor/${usuario?.id || usuario?.PK_id_usuario}`);
            const misClases = clasesRes.data.data || [];
            setClases(misClases);

            // Próxima clase (la más cercana en el futuro)
            const ahora = new Date();
            const proximas = misClases
                .filter(c => new Date(c.fecha_hora) > ahora)
                .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
            setProximaClase(proximas[0] || null);

            // Contar asistencias de hoy
            const hoy = new Date().toISOString().split('T')[0];
            let totalAsistencias = 0;
            for (const clase of misClases) {
                const asistRes = await api.get(`/asistencias/clase/${clase.PK_id_clase}`).catch(() => ({ data: { data: [] } }));
                totalAsistencias += asistRes.data.data?.length || 0;
            }
            setAsistenciasHoy(totalAsistencias);

            // Rutinas creadas por el instructor (si hay endpoint)
            const rutinasRes = await api.get('/rutinas').catch(() => ({ data: { data: [] } }));
            setRutinasCreadas(rutinasRes.data.data?.length || 0);

        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        container: { padding: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        subtitulo: { color: '#888', fontSize: '0.9rem', marginBottom: '2rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
        card: (color) => ({
            background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem',
            borderLeft: `4px solid ${color}`
        }),
        cardIcon: (color) => ({ fontSize: '2rem', color: color, marginBottom: '0.75rem' }),
        cardValor: { fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' },
        cardTitulo: { fontSize: '0.85rem', color: '#888' },
        seccion: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
        seccionTitulo: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        proximaClase: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#111', borderRadius: '8px', border: '1px solid #333' },
        proximaIcon: { fontSize: '2.5rem', color: '#FFD700' },
        proximaInfo: { flex: 1 },
        proximaNombre: { color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' },
        proximaDetalle: { color: '#888', fontSize: '0.85rem' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '0.75rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', letterSpacing: '1px' },
        td: { padding: '0.75rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        loading: { color: '#FFD700', textAlign: 'center', padding: '3rem' },
    };

    if (cargando) return <InstructorLayout><div style={styles.loading}>Cargando dashboard...</div></InstructorLayout>;

    return (
        <InstructorLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}>Bienvenido, {usuario?.nombre}</h1>
                <p style={styles.subtitulo}>Panel de control del instructor</p>
                
                {/* Tarjetas de resumen */}
                <div style={styles.grid}>
                    <div style={styles.card('#FFD700')}>
                        <div style={styles.cardIcon('#FFD700')}><FaCalendarAlt /></div>
                        <div style={styles.cardValor}>{clases.length}</div>
                        <div style={styles.cardTitulo}>Mis Clases</div>
                    </div>
                    <div style={styles.card('#00C851')}>
                        <div style={styles.cardIcon('#00C851')}><FaUsers /></div>
                        <div style={styles.cardValor}>{asistenciasHoy}</div>
                        <div style={styles.cardTitulo}>Asistencias Hoy</div>
                    </div>
                    <div style={styles.card('#33b5e5')}>
                        <div style={styles.cardIcon('#33b5e5')}><FaClipboardList /></div>
                        <div style={styles.cardValor}>{rutinasCreadas}</div>
                        <div style={styles.cardTitulo}>Rutinas Creadas</div>
                    </div>
                </div>

                {/* Próxima clase */}
                {proximaClase && (
                    <div style={styles.seccion}>
                        <div style={styles.seccionTitulo}><FaClock /> Próxima Clase</div>
                        <div style={styles.proximaClase}>
                            <div style={styles.proximaIcon}><FaDumbbell /></div>
                            <div style={styles.proximaInfo}>
                                <div style={styles.proximaNombre}>{proximaClase.nombre_clase}</div>
                                <div style={styles.proximaDetalle}>
                                    <FaClock /> {new Date(proximaClase.fecha_hora).toLocaleString()} &nbsp;|&nbsp;
                                    <FaMapMarkerAlt /> {proximaClase.lugar} &nbsp;|&nbsp;
                                    Capacidad: {proximaClase.capacidad_maxima}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mis clases recientes */}
                <div style={styles.seccion}>
                    <div style={styles.seccionTitulo}><FaCalendarAlt /> Mis Clases</div>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>NOMBRE</th>
                                <th style={styles.th}>FECHA/HORA</th>
                                <th style={styles.th}>LUGAR</th>
                                <th style={styles.th}>CAPACIDAD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.slice(0, 5).map((clase) => (
                                <tr key={clase.PK_id_clase}>
                                    <td style={styles.td}>{clase.nombre_clase}</td>
                                    <td style={styles.td}><span style={styles.badge('#33b5e5')}>{new Date(clase.fecha_hora).toLocaleString()}</span></td>
                                    <td style={styles.td}>{clase.lugar}</td>
                                    <td style={styles.td}>{clase.capacidad_maxima}</td>
                                </tr>
                            ))}
                            {clases.length === 0 && (
                                <tr><td colSpan="4" style={{...styles.td, textAlign: 'center', padding: '2rem'}}>No tienes clases asignadas</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstructorLayout>
    );
};

export default DashboardInstructor;