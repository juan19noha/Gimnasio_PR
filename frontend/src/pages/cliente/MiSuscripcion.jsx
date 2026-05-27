
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { FaCreditCard, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

const MiSuscripcion = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [suscripcion, setSuscripcion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarCancelar, setMostrarCancelar] = useState(false);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');
    const [cancelando, setCancelando] = useState(false);

    useEffect(() => {
        const cargarSuscripcion = async () => {
            try {
                setCargando(true);
                const { data } = await api.get('/suscripciones/usuario/me');
                if (data.success) {
                    setSuscripcion(data.data);
                } else {
                    setSuscripcion(null);
                }
            } catch (err) {
                console.error('Error cargando suscripción:', err);
                setSuscripcion(null);
            } finally {
                setCargando(false);
            }
        };
        if (usuario) cargarSuscripcion();
    }, [usuario]);

    const handleCancelar = async () => {
        if (!motivoCancelacion.trim()) {
            setError('Debes indicar un motivo para cancelar');
            return;
        }
        try {
            setCancelando(true);
            await api.patch(`/suscripciones/${suscripcion.PK_id_suscripcion}/cancelar`, {
                motivo: motivoCancelacion
            });
            setSuscripcion(prev => ({ ...prev, estado: 'Cancelada' }));
            setMostrarCancelar(false);
            setMotivoCancelacion('');
        } catch (err) {
            setError('Error al cancelar');
        } finally {
            setCancelando(false);
        }
    };

    const styles = {
        header: { marginBottom: '2rem', borderBottom: '1px solid #222', paddingBottom: '1.5rem' },
        title: { color: '#FFD700', fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '2rem' },
        cardTitle: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        info: { color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' },
        price: { color: '#FFD700', fontSize: '1.8rem', fontWeight: 'bold' },
        badge: (activa) => ({ 
            background: activa ? '#1a3a1a' : '#3a1a1a', 
            color: activa ? '#00C851' : '#ff4444', 
            padding: '0.3rem 0.75rem', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem',
            marginTop: '0.5rem'
        }),
        btnPrimario: {
            background: '#FFD700',
            color: '#000',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
        },
        btnPeligro: {
            background: 'transparent',
            border: '1px solid #ff4444',
            color: '#ff4444',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '1rem',
        },
        sinDatos: { textAlign: 'center', padding: '3rem' },
        sinDatosIcon: { color: '#FFD700', fontSize: '3rem', marginBottom: '1rem' },
        sinDatosText: { color: '#888', marginBottom: '1.5rem' },
        modalOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
        },
        modal: {
            background: '#111',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
        },
        modalTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' },
        textarea: {
            width: '100%',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#fff',
            marginBottom: '1rem',
            minHeight: '80px',
            resize: 'none',
        },
        btnCancelar: {
            flex: 1,
            padding: '0.75rem',
            background: '#2a2a2a',
            border: 'none',
            color: '#888',
            borderRadius: '8px',
            cursor: 'pointer',
        },
        btnConfirmar: {
            flex: 1,
            padding: '0.75rem',
            background: '#ff4444',
            border: 'none',
            color: '#fff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        error: { color: '#ff4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
        infoBox: { background: '#1a1a1a', padding: '1rem', borderRadius: '8px' },
        infoLabel: { color: '#666', fontSize: '0.8rem', marginBottom: '0.25rem' },
        infoValue: { color: '#fff', fontWeight: 'bold' },
    };

    if (cargando) {
        return (
            <ClienteLayout>
                <div style={{ color: '#FFD700', textAlign: 'center', padding: '3rem' }}>
                    Cargando...
                </div>
            </ClienteLayout>
        );
    }

    // Si no tiene suscripción activa
    if (!suscripcion || suscripcion.estado === 'Cancelada') {
        return (
            <ClienteLayout>
                <div style={styles.header}>
                    <div style={styles.title}>
                        <FaCreditCard /> Mi Suscripción
                    </div>
                </div>

                <div style={styles.sinDatos}>
                    <div style={styles.sinDatosIcon}><FaExclamationTriangle /></div>
                    <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>No tienes suscripciones activas</h2>
                    <p style={styles.sinDatosText}>Explora nuestros planes y elige el que mejor se adapte a ti.</p>
                    <button onClick={() => navigate('/cliente/elegir-plan')} style={styles.btnPrimario}>
                        Ver Planes Disponibles <FaArrowRight />
                    </button>
                </div>
            </ClienteLayout>
        );
    }

    return (
        <ClienteLayout>
            <div style={styles.header}>
                <div style={styles.title}>
                    <FaCreditCard /> Mi Suscripción
                </div>
            </div>

            {error && (
                <div style={styles.error}><FaExclamationTriangle /> {error}</div>
            )}

            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={styles.cardTitle}>{suscripcion.nombre_plan}</div>
                        <span style={styles.badge(suscripcion.estado === 'Activa')}>
                            {suscripcion.estado === 'Activa' ? <FaCheckCircle /> : <FaTimesCircle />}
                            {suscripcion.estado}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={styles.price}>
                            ${parseFloat(suscripcion.precio_suscripcion).toLocaleString()}
                        </div>
                        <div style={styles.info}>/ {suscripcion.duracion_plan} días</div>
                    </div>
                </div>

                <div style={styles.grid2}>
                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>Fecha de inicio</div>
                        <div style={styles.infoValue}>
                            {new Date(suscripcion.fecha_inicio).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>Fecha de vencimiento</div>
                        <div style={styles.infoValue}>
                            {new Date(suscripcion.fecha_vencimiento).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                </div>

                {suscripcion.estado === 'Pendiente de pago' && (
                    <div style={{ background: 'rgba(255,187,51,0.1)', border: '1px solid rgba(255,187,51,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p style={{ color: '#ffbb33', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaExclamationTriangle /> Tu suscripción está pendiente de pago.
                            <button onClick={() => navigate('/cliente/elegir-plan')} style={{ background: 'none', border: 'none', color: '#ffbb33', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
                                Completar pago →
                            </button>
                        </p>
                    </div>
                )}

                {suscripcion.estado === 'Activa' && (
                    <button onClick={() => setMostrarCancelar(true)} style={styles.btnPeligro}>
                        <FaTimesCircle /> Cancelar Suscripción
                    </button>
                )}
            </div>

            {/* Modal de cancelación */}
            {mostrarCancelar && (
                <div style={styles.modalOverlay} onClick={() => setMostrarCancelar(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Cancelar Suscripción</h3>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            ¿Estás seguro? Tu acceso se revocará inmediatamente.
                        </p>
                        <textarea
                            value={motivoCancelacion}
                            onChange={(e) => setMotivoCancelacion(e.target.value)}
                            placeholder="Indica el motivo de cancelación..."
                            style={styles.textarea}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={() => { setMostrarCancelar(false); setMotivoCancelacion(''); setError(null); }}
                                style={styles.btnCancelar}
                            >
                                Volver
                            </button>
                            <button 
                                onClick={handleCancelar}
                                disabled={cancelando}
                                style={styles.btnConfirmar}
                            >
                                {cancelando ? 'Cancelando...' : 'Sí, Cancelar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
};

export default MiSuscripcion;