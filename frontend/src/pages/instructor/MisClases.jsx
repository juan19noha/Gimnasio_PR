import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const MisClases = () => {
    const { usuario } = useAuth();
    const [clases, setClases] = useState([]);
    const [asistenciasPorClase, setAsistenciasPorClase] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarClases();
    }, []);

    const cargarClases = async () => {
        try {
            setCargando(true);
            const { data } = await api.get(`/clases/instructor/${usuario?.id || usuario?.PK_id_usuario}`);
            const misClases = data.data || [];
            setClases(misClases);

            // Cargar asistencias de cada clase
            const asistencias = {};
            for (const clase of misClases) {
                const asistRes = await api.get(`/asistencias/clase/${clase.PK_id_clase}`).catch(() => ({ data: { data: [] } }));
                asistencias[clase.PK_id_clase] = asistRes.data.data?.length || 0;
            }
            setAsistenciasPorClase(asistencias);

        } catch (error) {
            console.error('Error cargando clases:', error);
        } finally {
            setCargando(false);
        }
    };

    const clasesProximas = clases.filter(c => new Date(c.fecha_hora) > new Date()).sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
    const clasesPasadas = clases.filter(c => new Date(c.fecha_hora) <= new Date()).sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

    const styles = {
        container: { padding: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' },
        seccion: { marginBottom: '2rem' },
        seccionTitulo: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' },
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', transition: 'all 0.3s' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
        cardNombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' },
        cardEstado: (activa) => ({ background: activa ? '#00C85120' : '#88820', color: activa ? '#00C851' : '#888', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        cardDetalle: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' },
        cardIcon: { color: '#FFD700', minWidth: '16px' },
        cardAsistencias: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        asistenciasLabel: { color: '#888', fontSize: '0.8rem' },
        asistenciasValor: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' },
        loading: { color: '#FFD700', textAlign: 'center', padding: '3rem' },
        vacio: { color: '#888', textAlign: 'center', padding: '2rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' },
    };

    if (cargando) return <InstructorLayout><div style={styles.loading}>Cargando clases...</div></InstructorLayout>;

    const renderClaseCard = (clase, esProxima) => (
        <div key={clase.PK_id_clase} style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={styles.cardNombre}>{clase.nombre_clase}</div>
                <div style={styles.cardEstado(esProxima)}>{esProxima ? 'Próxima' : 'Finalizada'}</div>
            </div>
            <div style={styles.cardDetalle}>
                <FaClock style={styles.cardIcon} /> {new Date(clase.fecha_hora).toLocaleString()}
            </div>
            <div style={styles.cardDetalle}>
                <FaMapMarkerAlt style={styles.cardIcon} /> {clase.lugar}
            </div>
            <div style={styles.cardDetalle}>
                <FaUsers style={styles.cardIcon} /> Capacidad máxima: {clase.capacidad_maxima}
            </div>
            <div style={styles.cardAsistencias}>
                <span style={styles.asistenciasLabel}>Asistentes registrados</span>
                <span style={styles.asistenciasValor}>{asistenciasPorClase[clase.PK_id_clase] || 0}</span>
            </div>
        </div>
    );

    return (
        <InstructorLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}>Mis Clases</h1>

                {/* Próximas clases */}
                <div style={styles.seccion}>
                    <div style={styles.seccionTitulo}><FaCalendarAlt /> Próximas Clases</div>
                    {clasesProximas.length > 0 ? (
                        <div style={styles.grid}>
                            {clasesProximas.map(clase => renderClaseCard(clase, true))}
                        </div>
                    ) : (
                        <div style={styles.vacio}>No tienes clases próximas programadas</div>
                    )}
                </div>

                {/* Clases pasadas */}
                <div style={styles.seccion}>
                    <div style={styles.seccionTitulo}><FaCalendarAlt /> Clases Anteriores</div>
                    {clasesPasadas.length > 0 ? (
                        <div style={styles.grid}>
                            {clasesPasadas.slice(0, 6).map(clase => renderClaseCard(clase, false))}
                        </div>
                    ) : (
                        <div style={styles.vacio}>No tienes clases anteriores</div>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
};

export default MisClases;