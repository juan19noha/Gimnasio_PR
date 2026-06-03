import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { 
    FaDumbbell, FaInstagram, FaFacebook, FaWhatsapp, 
    FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
    FaUsers, FaTrophy, FaStar, FaBars, FaTimes,
    FaUser, FaSignOutAlt, FaTachometerAlt, FaCrown,
    FaChalkboardTeacher, FaChevronDown, FaChevronUp,
    FaCalendarAlt, FaBox, FaShoppingCart, FaMoneyBillWave,
    FaClipboardList, FaFileInvoiceDollar, FaCheckSquare,
    FaAppleAlt, FaShoppingBag, FaCalendarCheck, FaHome,
    FaArrowRight, FaCheckCircle
} from 'react-icons/fa';

// CONFIGURACIÓN DE PLANES: días y beneficios por ID de plan
const PLANES_CONFIG = {
    1: { // Plan Básico Mensual
        duracion_texto: '30 días',
        beneficios: [
            'Acceso ilimitado al área de pesas',
            'Máquinas y zona cardiovascular',
            'Soporte básico del instructor',
            'Locker estándar'
        ],
        color: '#FFD700'
    },
    2: { // Plan Premium
        duracion_texto: '30 días',
        beneficios: [
            'Todo lo del Plan Básico',
            'Clases grupales ilimitadas',
            'Vestuarios con sauna',
            '1 invitado al mes incluido'
        ],
        color: '#FF6B35'
    },
    3: { // Plan Anual
        duracion_texto: '1 año',
        beneficios: [
            'Todo lo del Plan Premium',
            '12 meses de membresía',
            'Precio mensual más bajo',
            '2 consultas nutricionales'
        ],
        color: '#4ECDC4'
    },
    4: { // Plan Funcional
        duracion_texto: '30 días',
        beneficios: [
            'Entrenamientos funcionales HIIT',
            'Entrenador personal incluido',
            'Acceso a zona de pesas',
            'Planificación mensual'
        ],
        color: '#FFD700'
    },
    5: { // Plan Diario
        duracion_texto: '1 día',
        beneficios: [
            'Acceso completo por un día',
            'Todas las zonas del gimnasio',
            'Ideal para visitantes',
            'Sin compromiso'
        ],
        color: '#FF6B35'
    }
};

const LandingPage = () => {
    const { usuario, logout, esAdmin, esCliente, esInstructor } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [planes, setPlanes] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const cargarPlanes = async () => {
            try {
                const { data } = await api.get('/planes');
                setPlanes(data.data);
            } catch (error) {
                console.error('Error cargando planes:', error);
            }
        };
        cargarPlanes();

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

        const handleLogout = () => {
        logout();
        setDropdownAbierto(false);
    
    };

    const getRoleBadge = () => {
        if (esAdmin()) return 'Admin';
        if (esInstructor()) return 'Instructor';
        if (esCliente()) return 'Cliente';
        return '';
    };

    const getDropdownItems = () => {
        if (esAdmin()) {
            return [
                { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
                { path: '/admin/perfil', icon: <FaUser />, label: 'Mi Perfil' },
                { path: '/admin/usuarios', icon: <FaUsers />, label: 'Usuarios' },
                { path: '/admin/instructores', icon: <FaChalkboardTeacher />, label: 'Instructores' },
                { path: '/admin/clases', icon: <FaCalendarAlt />, label: 'Clases' },
                { path: '/admin/productos', icon: <FaBox />, label: 'Productos' },
                { path: '/admin/compras', icon: <FaShoppingCart />, label: 'Compras' },
                { path: '/admin/ventas', icon: <FaMoneyBillWave />, label: 'Ventas' },
                { path: '/admin/suscripciones', icon: <FaClipboardList />, label: 'Suscripciones' },
                { path: '/admin/facturas', icon: <FaFileInvoiceDollar />, label: 'Facturas' },
            ];
        }
        if (esInstructor()) {
            return [
                { path: '/instructor/dashboard', icon: <FaTachometerAlt />, label: 'Mi Dashboard' },
                { path: '/instructor/perfil', icon: <FaUser />, label: 'Mi Perfil' },
                { path: '/instructor/clases', icon: <FaCalendarAlt />, label: 'Mis Clases' },
                { path: '/instructor/asistencias', icon: <FaCheckSquare />, label: 'Asistencias' },
                { path: '/instructor/rutinas', icon: <FaClipboardList />, label: 'Rutinas Clientes' },
            ];
        }
        return [
            { path: '/cliente/dashboard', icon: <FaTachometerAlt />, label: 'Mi Dashboard' },
            { path: '/cliente/perfil', icon: <FaUser />, label: 'Mi Perfil' },
            { path: '/cliente/clases', icon: <FaCalendarAlt />, label: 'Mis Clases' },
            { path: '/cliente/suscripcion', icon: <FaClipboardList />, label: 'Mi Suscripción' },
            { path: '/cliente/rutinas', icon: <FaDumbbell />, label: 'Mis Rutinas' },
            { path: '/cliente/dieta', icon: <FaAppleAlt />, label: 'Mi Dieta' },
            { path: '/cliente/compras', icon: <FaShoppingBag />, label: 'Mis Compras' },
            { path: '/cliente/tienda', icon: <FaShoppingCart />, label: 'Tienda' },
            { path: '/cliente/eventos', icon: <FaCalendarCheck />, label: 'Eventos' },
        ];
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuAbierto(false);
    };

    // GUARDAR PLAN EN LOCALSTORAGE Y REDIRIGIR A REGISTRO
    const inscribirseConPlan = (planId) => {
        localStorage.setItem('planSeleccionado', planId);
        navigate('/registro');
    };

    const getPlanConfig = (planId) => {
        return PLANES_CONFIG[planId] || {
            duracion_texto: '30 días',
            beneficios: ['Acceso completo', 'Soporte instructor', 'Clases grupales'],
            color: '#FFD700'
        };
    };

    const instructores = [
        { nombre: 'Carlos Ramírez', especialidad: 'CrossFit y Pesas', descripcion: 'Especialista en entrenamiento funcional con 8 años de experiencia.' },
        { nombre: 'Laura Fitness', especialidad: 'Yoga y Pilates', descripcion: 'Instructora certificada en bienestar y flexibilidad corporal.'},
        { nombre: 'Diego Morales', especialidad: 'Cardio y Resistencia', descripcion: 'Ex atleta profesional especializado en rendimiento cardiovascular.'},
    ];

    const servicios = [
        { emoji: '🏋️', titulo: 'Entrenamiento Personal', desc: 'Planes personalizados con instructores certificados adaptados a tus objetivos.' },
        { emoji: '🧘', titulo: 'Clases Grupales', desc: 'Yoga, Pilates, Zumba, Spinning y más. ¡Entrena en comunidad!' },
        { emoji: '🥗', titulo: 'Nutrición', desc: 'Planes alimenticios diseñados para maximizar tus resultados.' },
        { emoji: '💪', titulo: 'Zona de Pesas', desc: 'Equipos de última generación para tu entrenamiento de fuerza.' },
        { emoji: '🏃', titulo: 'Cardio', desc: 'Amplia zona cardiovascular con treadmills, bicicletas y elípticas.' },
        { emoji: '🛁', titulo: 'Vestuarios', desc: 'Instalaciones modernas con duchas, casilleros y sauna.' },
    ];

    const styles = {
        navbar: {
            position: 'fixed', top: 0, width: '100%', zIndex: 9999,
            background: scrolled ? 'rgba(10,10,10,0.98)' : 'transparent',
            borderBottom: scrolled ? '1px solid #333' : 'none',
            padding: '1rem 2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'all 0.3s ease',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
        },
        navLogo: { color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
        navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
        navLink: { color: '#fff', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.3s', background: 'none', border: 'none' },
        btnLogin: { background: 'transparent', border: '1px solid #FFD700', color: '#FFD700', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'none' },
        btnRegistro: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none' },
        userMenu: { position: 'relative', zIndex: 10000 },
        userNameBtn: { 
            color: '#FFD700', 
            fontSize: '0.9rem', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: scrolled ? 'rgba(255,215,0,0.1)' : 'transparent',
            border: '1px solid #FFD700',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.2s',
        },
        roleBadge: { 
            background: 'rgba(255,215,0,0.2)', 
            border: '1px solid #FFD700', 
            color: '#FFD700', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '10px', 
            fontSize: '0.65rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
        },
        dropdown: {
            position: 'absolute',
            top: 'calc(100% + 0.75rem)',
            right: 0,
            background: '#1a1a1a',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            padding: '0.75rem 0',
            minWidth: '260px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 20px rgba(255,215,0,0.1)',
            zIndex: 10001,
            animation: 'dropdownSlide 0.2s ease-out',
        },
        dropdownItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1.25rem',
            color: '#e0e0e0',
            textDecoration: 'none',
            fontSize: '0.85rem',
            transition: 'all 0.15s',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            fontFamily: "'Segoe UI', sans-serif",
        },
        dropdownDivider: {
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #444, transparent)',
            margin: '0.5rem 1rem',
        },
        dropdownLogout: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1.25rem',
            color: '#ff6b6b',
            textDecoration: 'none',
            fontSize: '0.85rem',
            transition: 'all 0.15s',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: 'bold',
        },
        dropdownHeader: {
            padding: '0.75rem 1.25rem 0.5rem',
            borderBottom: '1px solid #333',
            marginBottom: '0.5rem',
        },
        dropdownHeaderText: {
            color: '#FFD700',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
        },
        dropdownHeaderSub: {
            color: '#888',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
        },
        hero: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
            position: 'relative', overflow: 'hidden',
        },
        heroContent: { maxWidth: '800px', zIndex: 1 },
        heroTag: { background: 'rgba(255,215,0,0.1)', border: '1px solid #FFD700', color: '#FFD700', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem', letterSpacing: '2px' },
        heroTitle: { color: '#fff', fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1.5rem' },
        heroTitleGold: { color: '#FFD700', display: 'block' },
        heroSubtitle: { color: '#888', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 },
        heroBtns: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
        heroBtnPrimary: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '1rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
        heroBtnSecondary: { background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', padding: '1rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
        stats: { background: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '3rem 2rem' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
        statNum: { color: '#FFD700', fontSize: '2.5rem', fontWeight: 'bold' },
        statLabel: { color: '#888', fontSize: '0.9rem', marginTop: '0.3rem' },
        section: { padding: '5rem 2rem' },
        sectionDark: { padding: '5rem 2rem', background: '#111' },
        sectionTitle: { color: '#FFD700', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' },
        sectionSubtitle: { color: '#888', textAlign: 'center', marginBottom: '3rem', fontSize: '1rem' },
        maxWidth: { maxWidth: '1100px', margin: '0 auto' },
        sobreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' },
        sobreCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', borderLeft: '4px solid #FFD700' },
        sobreIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
        sobreCardTitle: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.75rem' },
        sobreCardText: { color: '#888', fontSize: '0.9rem', lineHeight: 1.6 },
        serviciosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
        servicioCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', transition: 'all 0.3s' },
        servicioEmoji: { fontSize: '2rem', marginBottom: '0.75rem' },
        servicioTitulo: { color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' },
        servicioDesc: { color: '#888', fontSize: '0.85rem', lineHeight: 1.5 },
        planesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
        planCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' },
        planCardDestacado: { background: '#1a1a0a', border: '2px solid #FFD700', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' },
        planBadge: { background: '#FFD700', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.3rem 0.75rem', borderRadius: '20px', display: 'inline-block', marginBottom: '1rem' },
        planNombre: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        planPrecio: { color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' },
        planMoneda: { color: '#888', fontSize: '1rem' },
        planDesc: { color: '#888', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' },
        planBeneficios: { textAlign: 'left', marginBottom: '1.5rem', padding: '0 0.5rem' },
        planBeneficio: { color: '#aaa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' },
        planDuracion: { color: '#666', fontSize: '0.8rem', marginBottom: '1rem' },
        planBtn: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        planBtnOutline: { width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid #FFD700', borderRadius: '8px', color: '#FFD700', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        equipoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
        equipoCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', textAlign: 'center', borderTop: '3px solid #FFD700' },
        equipoAvatar: { width: '80px', height: '80px', background: 'linear-gradient(135deg, #FFD700, #B8860B)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' },
        equipoNombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.3rem' },
        equipoEspecialidad: { background: '#1a1a0a', color: '#FFD700', border: '1px solid #FFD700', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', display: 'inline-block', margin: '0.5rem 0' },
        equipoDesc: { color: '#888', fontSize: '0.85rem', lineHeight: 1.5, marginTop: '0.5rem' },
        ubicacionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' },
        mapaContainer: { borderRadius: '12px', overflow: 'hidden', border: '2px solid #333', height: '400px' },
        infoUbicacion: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        infoItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
        infoIcon: { color: '#FFD700', fontSize: '1.3rem', marginTop: '0.2rem', minWidth: '20px' },
        infoTexto: { color: '#888', fontSize: '0.9rem', lineHeight: 1.5 },
        infoLabel: { color: '#fff', fontWeight: 'bold', marginBottom: '0.25rem' },
        contactoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
        formGroup: { marginBottom: '1.2rem' },
        formLabel: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        formInput: { width: '100%', padding: '0.8rem 1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', outline: 'none' },
        formTextarea: { width: '100%', padding: '0.8rem 1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'vertical', minHeight: '120px' },
        formBtn: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
        contactoInfo: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        contactoItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' },
        contactoIcon: { color: '#FFD700', fontSize: '1.5rem', minWidth: '24px' },
        contactoLabel: { color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' },
        contactoTexto: { color: '#888', fontSize: '0.9rem' },
        redesGrid: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
        redBtn: (color) => ({ background: color, border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', textDecoration: 'none' }),
        footer: { background: '#050505', borderTop: '1px solid #222', padding: '3rem 2rem 1.5rem' },
        footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' },
        footerLogo: { color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
        footerDesc: { color: '#666', fontSize: '0.85rem', lineHeight: 1.6 },
        footerTitle: { color: '#FFD700', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '1px' },
        footerLink: { color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' },
        footerBottom: { borderTop: '1px solid #222', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', color: '#555', fontSize: '0.8rem', maxWidth: '1100px', margin: '2rem auto 0' },
        whatsappFloat: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#25D366', border: 'none', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999, textDecoration: 'none' },
    };

    const roleBadge = getRoleBadge();
    const dropdownItems = getDropdownItems();

    return (
        <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', sans-serif" }}>
            <style>{`
                @keyframes dropdownSlide {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dropdown-item:hover {
                    background: rgba(255,215,0,0.15) !important;
                    color: #FFD700 !important;
                }
                .dropdown-logout:hover {
                    background: rgba(255,68,68,0.15) !important;
                    color: #ff4444 !important;
                }
            `}</style>

            <nav style={styles.navbar}>
                <div style={styles.navLogo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <FaDumbbell /> GIMNASIO PR
                </div>

                <div style={styles.navLinks}>
                    <button style={styles.navLink} onClick={() => scrollTo('inicio')}>Inicio</button>
                    <button style={styles.navLink} onClick={() => scrollTo('servicios')}>Servicios</button>
                    <button style={styles.navLink} onClick={() => scrollTo('planes')}>Planes</button>
                    <button style={styles.navLink} onClick={() => scrollTo('equipo')}>Equipo</button>
                    <button style={styles.navLink} onClick={() => scrollTo('contacto')}>Contacto</button>

                    {usuario ? (
                        <div style={styles.userMenu} ref={dropdownRef}>
                            <button 
                                style={styles.userNameBtn} 
                                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                            >
                                <FaUser /> 
                                <span>{usuario?.nombre}</span>
                                {roleBadge && <span style={styles.roleBadge}>{roleBadge}</span>}
                                {dropdownAbierto ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                            </button>

                            {dropdownAbierto && (
                                <div style={styles.dropdown}>
                                    <div style={styles.dropdownHeader}>
                                        <div style={styles.dropdownHeaderText}>
                                            {esAdmin() ? 'Panel de Administración' : esInstructor() ? 'Panel de Instructor' : 'Mi Cuenta'}
                                        </div>
                                        <div style={styles.dropdownHeaderSub}>
                                            {usuario?.correo || usuario?.email}
                                        </div>
                                    </div>

                                    {dropdownItems.map((item, i) => (
                                        <Link 
                                            key={i}
                                            to={item.path} 
                                            className="dropdown-item"
                                            style={styles.dropdownItem}
                                            onClick={() => setDropdownAbierto(false)}
                                        >
                                            <span style={{ color: '#FFD700', fontSize: '0.9rem' }}>{item.icon}</span> 
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}

                                    <div style={styles.dropdownDivider}></div>

                                    <button 
                                        className="dropdown-logout"
                                        style={styles.dropdownLogout}
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt /> Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login" style={styles.btnLogin}>Iniciar Sesión</Link>
                            <Link to="/registro" style={styles.btnRegistro}>Registrarse</Link>
                        </div>
                    )}
                </div>
            </nav>

            <section id="inicio" style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroTag}> TU MEJOR VERSIÓN EMPIEZA AQUÍ</div>
                    <h1 style={styles.heroTitle}>
                        Transforma tu cuerpo
                        <span style={styles.heroTitleGold}>en Gimnasio PR</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        El gimnasio más completo de Apartadó, Antioquia. Entrenadores certificados,
                        equipos de última generación y planes adaptados a tus metas.
                    </p>
                    <div style={styles.heroBtns}>
                        {usuario ? (
                            <Link to={dropdownItems[0].path} style={styles.heroBtnPrimary}>
                                Ir a mi {esAdmin() ? 'Panel Admin' : esInstructor() ? 'Panel Instructor' : 'Dashboard'}
                            </Link>
                        ) : (
                            <Link to="/registro" style={styles.heroBtnPrimary}>
                                Inscríbete ya <FaArrowRight />
                            </Link>
                        )}
                        <button style={styles.heroBtnSecondary} onClick={() => scrollTo('planes')}>Ver Planes</button>
                    </div>
                </div>
            </section>

            <div style={styles.stats}>
                <div style={styles.statsGrid}>
                    <div><div style={styles.statNum}>500+</div><div style={styles.statLabel}>Miembros Activos</div></div>
                    <div><div style={styles.statNum}>10+</div><div style={styles.statLabel}>Instructores Certificados</div></div>
                    <div><div style={styles.statNum}>5</div><div style={styles.statLabel}>Años de Experiencia</div></div>
                    <div><div style={styles.statNum}>20+</div><div style={styles.statLabel}>Clases Semanales</div></div>
                </div>
            </div>

            <section id="nosotros" style={styles.sectionDark}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Sobre Nosotros</div>
                    <p style={styles.sectionSubtitle}>Conoce quiénes somos y qué nos hace diferentes</p>
                    <div style={styles.sobreGrid}>
                        <div style={styles.sobreCard}>
                            <div style={styles.sobreIcon}>🏆</div>
                            <div style={styles.sobreCardTitle}>Nuestra Historia</div>
                            <p style={styles.sobreCardText}>
                                Fundado en 2019 en Apartadó, Antioquia, Gimnasio PR nació con la misión de ofrecer
                                a la comunidad un espacio de bienestar, disciplina y transformación personal.
                            </p>
                        </div>
                        <div style={styles.sobreCard}>
                            <div style={styles.sobreIcon}>🎯</div>
                            <div style={styles.sobreCardTitle}>Nuestra Misión</div>
                            <p style={styles.sobreCardText}>
                                Brindar a cada miembro las herramientas, el acompañamiento y la motivación necesaria
                                para alcanzar sus metas físicas y mentales.
                            </p>
                        </div>
                        <div style={styles.sobreCard}>
                            <div style={styles.sobreIcon}>👁️</div>
                            <div style={styles.sobreCardTitle}>Nuestra Visión</div>
                            <p style={styles.sobreCardText}>
                                Ser el gimnasio líder del Urabá Antioqueño, reconocido por la calidad de sus instalaciones
                                y el impacto positivo en la salud de nuestra comunidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicios" style={styles.section}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Nuestros Servicios</div>
                    <p style={styles.sectionSubtitle}>Todo lo que necesitas para alcanzar tus metas</p>
                    <div style={styles.serviciosGrid}>
                        {servicios.map((s, i) => (
                            <div key={i} style={styles.servicioCard}>
                                <div style={styles.servicioEmoji}>{s.emoji}</div>
                                <div style={styles.servicioTitulo}>{s.titulo}</div>
                                <div style={styles.servicioDesc}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLANES - CON DURACIÓN Y BENEFICIOS REALES */}
            <section id="planes" style={styles.sectionDark}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Planes y Precios</div>
                    <p style={styles.sectionSubtitle}>Elige el plan que mejor se adapte a ti</p>
                    <div style={styles.planesGrid}>
                        {planes.map((plan, i) => {
                            const config = getPlanConfig(plan.PK_id_Plan);
                            const esPopular = plan.PK_id_Plan === 2;

                            return (
                                <div key={plan.PK_id_Plan} style={esPopular ? styles.planCardDestacado : styles.planCard}>
                                    {esPopular && <div style={styles.planBadge}>⭐ MÁS POPULAR</div>}
                                    <div style={styles.planNombre}>{plan.nombre_plan}</div>
                                    <div style={styles.planPrecio}>
                                        <span style={styles.planMoneda}>$</span>
                                        {Number(plan.precio_plan).toLocaleString()}
                                    </div>
                                    <div style={styles.planDuracion}>/{config.duracion_texto}</div>

                                    <div style={styles.planBeneficios}>
                                        {config.beneficios.map((beneficio, idx) => (
                                            <div key={idx} style={styles.planBeneficio}>
                                                <FaCheckCircle color={config.color} size={12} /> {beneficio}
                                            </div>
                                        ))}
                                    </div>

                                    {usuario ? (
                                        <Link to="/cliente/elegir-plan" style={esPopular ? styles.planBtn : styles.planBtnOutline}>
                                            Elegir Plan <FaArrowRight />
                                        </Link>
                                    ) : (
                                        <button 
                                            onClick={() => inscribirseConPlan(plan.PK_id_Plan)}
                                            style={esPopular ? styles.planBtn : styles.planBtnOutline}
                                        >
                                            Inscríbete ya <FaArrowRight />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="equipo" style={styles.section}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Nuestro Equipo</div>
                    <p style={styles.sectionSubtitle}>Instructores certificados comprometidos con tu progreso</p>
                    <div style={styles.equipoGrid}>
                        {instructores.map((instructor, i) => (
                            <div key={i} style={styles.equipoCard}>
                                <div style={styles.equipoAvatar}>👤</div>
                                <div style={styles.equipoNombre}>{instructor.nombre}</div>
                                <div style={styles.equipoEspecialidad}>{instructor.especialidad}</div>
                                <p style={styles.equipoDesc}>{instructor.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="ubicacion" style={styles.sectionDark}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Ubicación</div>
                    <p style={styles.sectionSubtitle}>Encuéntranos en Apartadó, Antioquia</p>
                    <div style={styles.ubicacionGrid}>
                        <div style={styles.mapaContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-76.6272!3d7.8801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sApartad%C3%B3%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1"
                                width="100%" height="100%" style={{ border: 0 }}
                                allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <div style={styles.infoUbicacion}>
                            <div style={styles.infoItem}>
                                <FaMapMarkerAlt style={styles.infoIcon} />
                                <div>
                                    <div style={styles.infoLabel}>Dirección</div>
                                    <div style={styles.infoTexto}>Barrio Serranía, Calle 108B Diagonal 104B<br />Apartadó, Antioquia, Colombia</div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <FaClock style={styles.infoIcon} />
                                <div>
                                    <div style={styles.infoLabel}>Horarios</div>
                                    <div style={styles.infoTexto}>
                                        Lunes a Viernes: 5:00 AM - 10:00 PM<br />
                                        Sábados: 6:00 AM - 8:00 PM<br />
                                        Domingos: 7:00 AM - 2:00 PM
                                    </div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <FaPhone style={styles.infoIcon} />
                                <div>
                                    <div style={styles.infoLabel}>Teléfono</div>
                                    <div style={styles.infoTexto}>+57 311 772 8640</div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <FaEnvelope style={styles.infoIcon} />
                                <div>
                                    <div style={styles.infoLabel}>Correo</div>
                                    <div style={styles.infoTexto}>info@gimnasiopr.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacto" style={styles.section}>
                <div style={styles.maxWidth}>
                    <div style={styles.sectionTitle}>Contáctanos</div>
                    <p style={styles.sectionSubtitle}>¿Tienes preguntas? Estamos aquí para ayudarte</p>
                    <div style={styles.contactoGrid}>
                        <div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>NOMBRE</label>
                                <input style={styles.formInput} placeholder="Tu nombre completo" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>CORREO</label>
                                <input type="email" style={styles.formInput} placeholder="tu@correo.com" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>ASUNTO</label>
                                <input style={styles.formInput} placeholder="¿En qué podemos ayudarte?" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>MENSAJE</label>
                                <textarea style={styles.formTextarea} placeholder="Escribe tu mensaje aquí..." />
                            </div>
                            <button style={styles.formBtn}>ENVIAR MENSAJE</button>
                        </div>
                        <div style={styles.contactoInfo}>
                            <div style={styles.contactoItem}>
                                <FaPhone style={styles.contactoIcon} />
                                <div>
                                    <div style={styles.contactoLabel}>Teléfono</div>
                                    <div style={styles.contactoTexto}>+57 311 772 8640</div>
                                </div>
                            </div>
                            <div style={styles.contactoItem}>
                                <FaEnvelope style={styles.contactoIcon} />
                                <div>
                                    <div style={styles.contactoLabel}>Correo</div>
                                    <div style={styles.contactoTexto}>info@gimnasiopr.com</div>
                                </div>
                            </div>
                            <div style={styles.contactoItem}>
                                <FaMapMarkerAlt style={styles.contactoIcon} />
                                <div>
                                    <div style={styles.contactoLabel}>Dirección</div>
                                    <div style={styles.contactoTexto}>Barrio Serranía, Calle 108B<br />Diagonal 104B, Apartadó</div>
                                </div>
                            </div>
                            <div style={styles.contactoItem}>
                                <FaClock style={styles.contactoIcon} />
                                <div>
                                    <div style={styles.contactoLabel}>Horarios</div>
                                    <div style={styles.contactoTexto}>Lun-Vie: 5AM - 10PM<br />Sáb: 6AM - 8PM | Dom: 7AM - 2PM</div>
                                </div>
                            </div>
                            <div>
                                <div style={styles.contactoLabel}>Síguenos en redes</div>
                                <div style={styles.redesGrid}>
                                    <a href="#" style={styles.redBtn('#E1306C')}><FaInstagram /></a>
                                    <a href="#" style={styles.redBtn('#1877F2')}><FaFacebook /></a>
                                    <a href="https://wa.me/573117728640" target="_blank" rel="noreferrer" style={styles.redBtn('#25D366')}><FaWhatsapp /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <div style={styles.footerGrid}>
                    <div>
                        <div style={styles.footerLogo}><FaDumbbell /> GIMNASIO PR</div>
                        <p style={styles.footerDesc}>Tu mejor versión empieza aquí. Transformamos vidas a través del deporte y el bienestar en Apartadó, Antioquia.</p>
                        <div style={{ ...styles.redesGrid, marginTop: '1rem' }}>
                            <a href="#" style={styles.redBtn('#E1306C')}><FaInstagram /></a>
                            <a href="#" style={styles.redBtn('#1877F2')}><FaFacebook /></a>
                            <a href="https://wa.me/573117728640" target="_blank" rel="noreferrer" style={styles.redBtn('#25D366')}><FaWhatsapp /></a>
                        </div>
                    </div>
                    <div>
                        <div style={styles.footerTitle}>NAVEGACIÓN</div>
                        <button style={styles.footerLink} onClick={() => scrollTo('inicio')}>Inicio</button>
                        <button style={styles.footerLink} onClick={() => scrollTo('servicios')}>Servicios</button>
                        <button style={styles.footerLink} onClick={() => scrollTo('planes')}>Planes</button>
                        <button style={styles.footerLink} onClick={() => scrollTo('equipo')}>Nuestro Equipo</button>
                        <button style={styles.footerLink} onClick={() => scrollTo('contacto')}>Contacto</button>
                    </div>
                    <div>
                        <div style={styles.footerTitle}>SERVICIOS</div>
                        <span style={styles.footerLink}>Entrenamiento Personal</span>
                        <span style={styles.footerLink}>Clases Grupales</span>
                        <span style={styles.footerLink}>Nutrición</span>
                        <span style={styles.footerLink}>Zona de Pesas</span>
                        <span style={styles.footerLink}>Cardio</span>
                    </div>
                    <div>
                        <div style={styles.footerTitle}>CONTACTO</div>
                        <span style={styles.footerLink}>📍 Barrio Serranía, Apartadó</span>
                        <span style={styles.footerLink}>📞 +57 311 772 8640</span>
                        <span style={styles.footerLink}>✉️ info@gimnasiopr.com</span>
                        <span style={styles.footerLink}>🕐 Lun-Vie: 5AM - 10PM</span>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    © 2026 Gimnasio PR. Todos los derechos reservados. | Desarrollado con 💪 en Apartadó, Antioquia
                </div>
            </footer>

            <a href="https://wa.me/573117728640" target="_blank" rel="noreferrer" style={styles.whatsappFloat}>
                <FaWhatsapp />
            </a>

        </div>
    );
};

export default LandingPage;