import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FaCalendarAlt, FaClipboardList, FaDumbbell, FaAppleAlt, FaShoppingBag, FaCalendarCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const DashboardCliente = () => {
    const { usuario } = useAuth();
    const [suscripcion, setSuscripcion] = useState(null);
    const [clases, setClases] = useState([]);
    const [rutinas, setRutinas] = useState([]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const id = usuario?.PK_id_usuario;
                if (!id) return;

                const [suscRes, clasesRes, rutinasRes] = await Promise.all([
                    api.get(`/suscripciones/usuario/${id}`),
                    api.get('/clases'),
                    api.get(`/rutinas/usuario/${id}`),
                ]);

                setSuscripcion(suscRes.data.data?.[0] || null);
                setClases(clasesRes.data.data?.slice(0, 3) || []);
                setRutinas(rutinasRes.data.data || []);
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };
        cargar();
    }, [usuario]);

    const styles = {
        header: { marginBottom: '2rem', borderBottom: '1px solid #222', paddingBottom: '1.5rem' },
        title: { color: '#FFD700', fontSize: '1.8rem', fontWeight: 'bold' },
        subtitle: { color: '#888', marginTop: '0.25rem' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' },
        grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', textDecoration: 'none', color: '#fff', display: 'block', borderLeft: '4px solid #FFD700' },
        sectionTitle: { color: '#FFD700', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '1rem' },
        suscCard: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' },
        suscNombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' },
        suscInfo: { color: '#888', fontSize: '0.85rem', marginBottom: '0.3rem' },
        badge: (activa) => ({ background: activa ? '#1a3a1a' : '#3a1a1a', color: activa ? '#00C851' : '#ff4444', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }),
        claseCard: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem' },
        claseNombre: { color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' },
        claseInfo: { color: '#888', fontSize: '0.8rem', marginTop: '0.25rem' },
        rutinaCard: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem' },
        icon: { color: '#FFD700', fontSize: '1.5rem', marginBottom: '0.5rem' },
        menuCard: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', color: '#fff', display: 'block', textAlign: 'center' },
        menuIcon: { color: '#FFD700', fontSize: '1.5rem', marginBottom: '0.5rem' },
        menuTitle: { fontWeight: 'bold', fontSize: '0.9rem' },
        menuDesc: { color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' },
        sinDatos: { color: '#555', fontSize: '0.85rem', fontStyle: 'italic' },
        btnVerPlanes: { 
            color: '#FFD700', 
            fontSize: '0.85rem', 
            marginTop: '0.75rem', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(255,215,0,0.3)',
        },
    };

    return (
        <ClienteLayout>
            <div style={styles.header}>
                <div style={styles.title}> Hola, {usuario?.nombre}!</div>
                <div style={styles.subtitle}>Bienvenido a tu área personal</div>
            </div>

            <div style={styles.grid2}>
                {/* Suscripción */}
                <div>
                    <div style={styles.sectionTitle}>MI SUSCRIPCIÓN</div>
                    {suscripcion ? (
                        <div style={styles.suscCard}>
                            <div style={styles.suscNombre}>{suscripcion.nombre_plan}</div>
                            <div style={styles.suscInfo}> Inicio: {new Date(suscripcion.fecha_inicio).toLocaleDateString()}</div>
                            <div style={styles.suscInfo}> Vence: {new Date(suscripcion.fecha_vencimiento).toLocaleDateString()}</div>
                            <div style={styles.suscInfo}> ${Number(suscripcion.precio_suscripcion).toLocaleString()}</div>
                            <span style={styles.badge(suscripcion.estado === 'Activa')}>
                                {suscripcion.estado === 'Activa' ? <FaCheckCircle /> : <FaTimesCircle />}
                                {suscripcion.estado}
                            </span>
                        </div>
                    ) : (
                        <div style={styles.suscCard}>
                            <div style={styles.sinDatos}>No tienes suscripción activa.</div>
                            <Link to="/cliente/elegir-plan" style={styles.btnVerPlanes}>
                                Ver planes disponibles →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Próximas clases */}
                <div>
                    <div style={styles.sectionTitle}>PRÓXIMAS CLASES</div>
                    {clases.length > 0 ? clases.map(c => (
                        <div key={c.PK_id_clase} style={styles.claseCard}>
                            <div style={styles.claseNombre}>{c.nombre_clase}</div>
                            <div style={styles.claseInfo}>🕐 {new Date(c.fecha_hora).toLocaleString()}</div>
                            <div style={styles.claseInfo}>📍 {c.lugar}</div>
                        </div>
                    )) : <div style={styles.sinDatos}>No hay clases programadas.</div>}
                </div>
            </div>

            {/* Mis rutinas */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={styles.sectionTitle}>MIS RUTINAS</div>
                <div style={styles.grid3}>
                    {rutinas.length > 0 ? rutinas.map(r => (
                        <div key={r.PK_id_rutina} style={styles.rutinaCard}>
                            <div style={styles.icon}>💪</div>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{r.nombre_rutina}</div>
                            <div style={{ color: '#888', fontSize: '0.8rem' }}>🎯 {r.objetivo}</div>
                        </div>
                    )) : <div style={styles.sinDatos}>No tienes rutinas asignadas.</div>}
                </div>
            </div>

            {/* Accesos rápidos */}
            <div style={styles.sectionTitle}>ACCESOS RÁPIDOS</div>
            <div style={styles.grid3}>
                <Link to="/cliente/clases" style={styles.menuCard}><div style={styles.menuIcon}><FaCalendarAlt /></div><div style={styles.menuTitle}>Clases</div><div style={styles.menuDesc}>Ver disponibles</div></Link>
                <Link to="/cliente/dieta" style={styles.menuCard}><div style={styles.menuIcon}><FaAppleAlt /></div><div style={styles.menuTitle}>Mi Dieta</div><div style={styles.menuDesc}>Plan nutricional</div></Link>
                <Link to="/cliente/tienda" style={styles.menuCard}><div style={styles.menuIcon}><FaShoppingBag /></div><div style={styles.menuTitle}>Tienda</div><div style={styles.menuDesc}>Suplementos</div></Link>
                <Link to="/cliente/eventos" style={styles.menuCard}><div style={styles.menuIcon}><FaCalendarCheck /></div><div style={styles.menuTitle}>Eventos</div><div style={styles.menuDesc}>Próximos eventos</div></Link>
            </div>
        </ClienteLayout>
    );
};

export default DashboardCliente;