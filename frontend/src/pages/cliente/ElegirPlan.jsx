
import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    FaCheck, FaCrown, FaStar, FaBolt, FaDumbbell, 
    FaCalendarAlt, FaCheckCircle, FaCreditCard, 
    FaMoneyBillWave, FaUniversity, FaArrowLeft,
    FaFileInvoice, FaExclamationTriangle
} from 'react-icons/fa';

// CONFIGURACIÓN DE PLANES: días y beneficios por ID de plan
const PLANES_CONFIG = {
    1: { // Plan Básico Mensual
        duracion_dias: 30,
        duracion_texto: '30 días',
        beneficios: [
            'Acceso ilimitado al área de pesas',
            'Acceso a máquinas y zona cardiovascular',
            'Soporte básico del instructor',
            'Locker estándar'
        ],
        icono: <FaBolt />,
        color: '#FFD700'
    },
    2: { // Plan Premium
        duracion_dias: 30,
        duracion_texto: '30 días',
        beneficios: [
            'Todo lo del Plan Básico',
            'Clases grupales ilimitadas',
            'Vestuarios con sauna',
            '1 invitado al mes incluido'
        ],
        icono: <FaCrown />,
        color: '#FF6B35'
    },
    3: { // Plan Anual
        duracion_dias: 365,
        duracion_texto: '1 año',
        beneficios: [
            'Todo lo del Plan Premium',
            '12 meses de membresía',
            'Precio mensual más bajo del mercado',
            '2 consultas nutricionales gratis'
        ],
        icono: <FaStar />,
        color: '#4ECDC4'
    },
    4: { // Plan Funcional
        duracion_dias: 30,
        duracion_texto: '30 días',
        beneficios: [
            'Entrenamientos funcionales de alta intensidad',
            'Entrenador personal incluido',
            'Acceso a zona de pesas',
            'Planificación de rutinas mensual'
        ],
        icono: <FaDumbbell />,
        color: '#FFD700'
    },
    5: { // Plan Diario
        duracion_dias: 1,
        duracion_texto: '1 día',
        beneficios: [
            'Acceso completo por un día',
            'Todas las zonas del gimnasio',
            'Ideal para visitantes',
            'Sin compromiso de permanencia'
        ],
        icono: <FaCalendarAlt />,
        color: '#FF6B35'
    }
};

const ElegirPlan = () => {
    const [planes, setPlanes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [solicitando, setSolicitando] = useState(false);
    const [pagando, setPagando] = useState(false);
    const [planSeleccionado, setPlanSeleccionado] = useState(null);
    const [suscripcionCreada, setSuscripcionCreada] = useState(null);
    const [modalPago, setModalPago] = useState(false);
    const [modalExito, setModalExito] = useState(false);
    const [metodoPago, setMetodoPago] = useState('Transferencia bancaria');
    const [error, setError] = useState('');
    const [factura, setFactura] = useState(null);
    const { usuario, cargando: cargandoAuth } = useAuth();
    const navigate = useNavigate();

    const getUsuario = () => {
        if (usuario) return usuario;
        try {
            const stored = localStorage.getItem('usuario');
            if (stored && stored !== 'undefined') return JSON.parse(stored);
        } catch (e) {}
        return null;
    };

    useEffect(() => {
        const cargarPlanes = async () => {
            try {
                const { data } = await api.get('/planes');
                setPlanes(data.data || []);
            } catch (err) {
                setError('Error al cargar los planes');
            } finally {
                setCargando(false);
            }
        };
        cargarPlanes();

        // Auto-abrir modal si hay plan preseleccionado en localStorage
        const planIdGuardado = localStorage.getItem('planSeleccionado');
        if (planIdGuardado) {
            const id = parseInt(planIdGuardado);
            const timer = setTimeout(() => {
                const planEncontrado = planes.find(p => p.PK_id_Plan === id);
                if (planEncontrado) {
                    abrirPago(planEncontrado);
                    localStorage.removeItem('planSeleccionado');
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [planes]);

    const abrirPago = (plan) => {
        setPlanSeleccionado(plan);
        setModalPago(true);
        setError('');
        setSuscripcionCreada(null);
    };

    const cerrarPago = () => {
        setModalPago(false);
        setPlanSeleccionado(null);
        setSuscripcionCreada(null);
        setError('');
    };

    const solicitarPlan = async () => {
        if (!planSeleccionado) return;
        const userActual = getUsuario();
        if (!userActual?.PK_id_usuario) {
            setError('Error: Usuario no identificado. Inicia sesión de nuevo.');
            return;
        }

        setSolicitando(true);
        setError('');

        try {
            const { data } = await api.post('/suscripciones/solicitar', {
                idPlan: planSeleccionado.PK_id_Plan
            });
            setSuscripcionCreada(data.data);
        } catch (err) {
            console.error('Error solicitando:', err);
            setError(err.response?.data?.message || 'Error al solicitar el plan');
        } finally {
            setSolicitando(false);
        }
    };

    const procesarPago = async () => {
        if (!suscripcionCreada) return;
        const userActual = getUsuario();
        if (!userActual?.PK_id_usuario) {
            setError('Error: Usuario no identificado.');
            return;
        }

        setPagando(true);
        setError('');

        try {
            const { data } = await api.post('/suscripciones/pagar', {
                idSuscripcion: suscripcionCreada.id_suscripcion,
                metodoPago: metodoPago
            });
            setFactura(data.data);
            setModalPago(false);
            setModalExito(true);
        } catch (err) {
            console.error('Error pagando:', err);
            setError(err.response?.data?.message || 'Error al procesar el pago');
        } finally {
            setPagando(false);
        }
    };

    const irAMiSuscripcion = () => {
        navigate('/cliente/suscripcion');
    };

    const getPlanConfig = (planId) => {
        return PLANES_CONFIG[planId] || {
            duracion_dias: 30,
            duracion_texto: '30 días',
            beneficios: ['Acceso completo', 'Soporte instructor', 'Clases grupales'],
            icono: <FaBolt />,
            color: '#FFD700'
        };
    };

    const metodosPago = [
        { id: 'Transferencia bancaria', icon: <FaUniversity />, label: 'Transferencia bancaria' },
        { id: 'Efectivo', icon: <FaMoneyBillWave />, label: 'Pago en efectivo' },
        { id: 'Tarjeta de crédito', icon: <FaCreditCard />, label: 'Tarjeta de crédito' },
        { id: 'Tarjeta de débito', icon: <FaCreditCard />, label: 'Tarjeta de débito' },
    ];

    const styles = {
        header: { marginBottom: '2rem', borderBottom: '1px solid #222', paddingBottom: '1.5rem' },
        title: { color: '#FFD700', fontSize: '1.8rem', fontWeight: 'bold' },
        subtitle: { color: '#888', marginTop: '0.25rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
        card: (color) => ({
            background: '#111',
            border: '1px solid #222',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `4px solid ${color}`,
        }),
        iconContainer: (color) => ({
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: color,
            marginBottom: '1rem',
        }),
        planName: { color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        planDesc: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' },
        price: { color: '#FFD700', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' },
        priceLabel: { color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' },
        featureList: { listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' },
        featureItem: { color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
        btnSuscribir: (color) => ({
            width: '100%',
            padding: '0.9rem',
            background: color,
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
        }),
        popularBadge: {
            position: 'absolute',
            top: '12px',
            right: '-30px',
            background: '#FFD700',
            color: '#000',
            padding: '4px 40px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            transform: 'rotate(45deg)',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
        },
        modal: {
            background: '#111',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
        },
        modalTitle: { color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        modalSection: { marginBottom: '1.5rem' },
        modalLabel: { color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' },
        modalValue: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' },
        modalPrice: { color: '#FFD700', fontSize: '2rem', fontWeight: 'bold' },
        metodosGrid: { display: 'grid', gap: '0.75rem' },
        metodoItem: (selected) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: selected ? 'rgba(255,215,0,0.1)' : '#1a1a1a',
            border: selected ? '2px solid #FFD700' : '1px solid #333',
            borderRadius: '10px',
            cursor: 'pointer',
            color: selected ? '#FFD700' : '#aaa',
        }),
        modalButtons: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
        btnCancelar: {
            flex: 1,
            padding: '0.8rem',
            background: 'transparent',
            border: '1px solid #444',
            color: '#888',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.95rem',
        },
        btnConfirmar: {
            flex: 1,
            padding: '0.8rem',
            background: '#FFD700',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
        },
        modalExito: {
            background: '#111',
            border: '1px solid #00C851',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
        },
        exitoIcon: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#1a3a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: '#00C851',
            margin: '0 auto 1.5rem',
        },
        exitoTitle: { color: '#00C851', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        exitoText: { color: '#aaa', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' },
        facturaBox: {
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
        },
        facturaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' },
        facturaTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #333', color: '#FFD700', fontWeight: 'bold' },
        error: { color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        loading: { color: '#FFD700', textAlign: 'center', padding: '3rem', fontSize: '1.2rem' },
        noPlans: { color: '#888', textAlign: 'center', padding: '3rem' },
        stepIndicator: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '8px',
        },
        step: (active) => ({
            color: active ? '#FFD700' : '#666',
            fontSize: '0.85rem',
            fontWeight: active ? 'bold' : 'normal',
        }),
    };

    if (cargandoAuth) {
        return (
            <ClienteLayout>
                <div style={styles.loading}><FaDumbbell /> Cargando...</div>
            </ClienteLayout>
        );
    }

    return (
        <ClienteLayout>
            <div style={styles.header}>
                <div style={styles.title}>Elegir Plan</div>
                <div style={styles.subtitle}>Selecciona el plan que mejor se adapte a tus objetivos</div>
            </div>

            {cargando ? (
                <div style={styles.loading}><FaDumbbell /> Cargando planes...</div>
            ) : planes.length === 0 ? (
                <div style={styles.noPlans}>No hay planes disponibles.</div>
            ) : (
                <div style={styles.grid}>
                    {planes.map((plan, index) => {
                        const config = getPlanConfig(plan.PK_id_Plan);
                        const esPopular = plan.PK_id_Plan === 2; // Plan Premium es el más popular

                        return (
                            <div key={plan.PK_id_Plan} style={styles.card(config.color)}>
                                {esPopular && <div style={styles.popularBadge}>MÁS POPULAR</div>}

                                <div style={styles.iconContainer(config.color)}>
                                    {config.icono}
                                </div>

                                <div style={styles.planName}>{plan.nombre_plan}</div>
                                <div style={styles.planDesc}>{plan.descripcion_plan || 'Plan de entrenamiento'}</div>

                                <div style={styles.price}>
                                    ${Number(plan.precio_plan).toLocaleString()}
                                </div>
                                <div style={styles.priceLabel}>/ {config.duracion_texto}</div>

                                <ul style={styles.featureList}>
                                    {config.beneficios.map((beneficio, i) => (
                                        <li key={i} style={styles.featureItem}>
                                            <FaCheckCircle color={config.color} /> {beneficio}
                                        </li>
                                    ))}
                                </ul>

                                <button style={styles.btnSuscribir(config.color)} onClick={() => abrirPago(plan)}>
                                    <FaCalendarAlt style={{ marginRight: '0.5rem' }} /> Seleccionar Plan
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL DE PAGO */}
            {modalPago && planSeleccionado && (
                <div style={styles.modalOverlay} onClick={cerrarPago}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

                        <div style={styles.stepIndicator}>
                            <span style={styles.step(!suscripcionCreada)}>1. Solicitar</span>
                            <span style={{color:'#666'}}>→</span>
                            <span style={styles.step(suscripcionCreada)}>2. Pagar</span>
                            <span style={{color:'#666'}}>→</span>
                            <span style={styles.step(false)}>3. ¡Listo!</span>
                        </div>

                        <div style={styles.modalTitle}>
                            <FaCreditCard /> {suscripcionCreada ? 'Confirmar Pago' : 'Solicitar Plan'}
                        </div>

                        <div style={styles.modalSection}>
                            <div style={styles.modalLabel}>Plan seleccionado</div>
                            <div style={styles.modalValue}>{planSeleccionado.nombre_plan}</div>
                        </div>

                        <div style={styles.modalSection}>
                            <div style={styles.modalLabel}>Duración</div>
                            <div style={styles.modalValue}>
                                {getPlanConfig(planSeleccionado.PK_id_Plan).duracion_texto}
                            </div>
                        </div>

                        <div style={styles.modalSection}>
                            <div style={styles.modalLabel}>Total a pagar</div>
                            <div style={styles.modalPrice}>
                                ${Number(planSeleccionado.precio_plan).toLocaleString()} COP
                            </div>
                        </div>

                        {!suscripcionCreada ? (
                            <>
                                {error && (
                                    <div style={styles.error}>
                                        <FaExclamationTriangle /> {error}
                                    </div>
                                )}
                                <div style={styles.modalButtons}>
                                    <button style={styles.btnCancelar} onClick={cerrarPago}>
                                        <FaArrowLeft /> Volver
                                    </button>
                                    <button style={styles.btnConfirmar} onClick={solicitarPlan} disabled={solicitando}>
                                        {solicitando ? 'Solicitando...' : 'Continuar al Pago'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={styles.modalSection}>
                                    <div style={styles.modalLabel}>Método de pago</div>
                                    <div style={styles.metodosGrid}>
                                        {metodosPago.map((metodo) => (
                                            <div key={metodo.id} style={styles.metodoItem(metodoPago === metodo.id)} onClick={() => setMetodoPago(metodo.id)}>
                                                {metodo.icon} {metodo.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {metodoPago === 'Transferencia bancaria' && (
                                    <div style={{...styles.modalSection, background:'#1a1a1a', padding:'1rem', borderRadius:'8px'}}>
                                        <div style={{color:'#FFD700', fontSize:'0.85rem', marginBottom:'0.5rem'}}>
                                            <FaUniversity /> Datos para transferencia
                                        </div>
                                        <div style={{color:'#aaa', fontSize:'0.85rem', lineHeight:'1.6'}}>
                                            Banco: Bancolombia<br/>
                                            Cuenta: 123-456789-00<br/>
                                            Titular: Gimnasio PR S.A.S<br/>
                                            Referencia: Suscripción #{suscripcionCreada.id_suscripcion}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div style={styles.error}>
                                        <FaExclamationTriangle /> {error}
                                    </div>
                                )}

                                <div style={styles.modalButtons}>
                                    <button style={styles.btnCancelar} onClick={cerrarPago}>
                                        Cancelar
                                    </button>
                                    <button style={styles.btnConfirmar} onClick={procesarPago} disabled={pagando}>
                                        {pagando ? 'Procesando...' : `Pagar $${Number(planSeleccionado.precio_plan).toLocaleString()}`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL DE ÉXITO */}
            {modalExito && factura && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalExito}>
                        <div style={styles.exitoIcon}>
                            <FaCheckCircle />
                        </div>
                        <div style={styles.exitoTitle}>¡Pago Exitoso!</div>
                        <div style={styles.exitoText}>
                            Tu suscripción ha sido activada correctamente.
                        </div>

                        <div style={styles.facturaBox}>
                            <div style={{...styles.facturaRow, color:'#FFD700', fontWeight:'bold', marginBottom:'0.75rem'}}>
                                <span><FaFileInvoice /> Factura</span>
                                <span>{factura.factura?.numero_factura}</span>
                            </div>
                            <div style={styles.facturaRow}>
                                <span>Método</span>
                                <span>{metodoPago}</span>
                            </div>
                            <div style={styles.facturaTotal}>
                                <span>Total pagado</span>
                                <span>${Number(factura.factura?.total_pagado).toLocaleString()} COP</span>
                            </div>
                        </div>

                        <button style={{...styles.btnConfirmar, width:'100%'}} onClick={irAMiSuscripcion}>
                            <FaCheckCircle /> Ir a Mi Suscripción
                        </button>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
};

export default ElegirPlan;