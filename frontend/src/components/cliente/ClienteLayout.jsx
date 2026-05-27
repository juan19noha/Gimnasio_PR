import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaDumbbell, FaTachometerAlt, FaCalendarAlt, FaClipboardList, FaDumbbell as FaRutina, FaAppleAlt, FaShoppingBag, FaShoppingCart, FaCalendarCheck, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa';

const ClienteLayout = ({ children }) => {
    const { usuario, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout(); // AuthContext ya redirige a '/' (LandingPage)
    };

    const menuItems = [
        { path: '/cliente/dashboard', icon: <FaTachometerAlt />, label: 'Mi Dashboard' },
        { path: '/cliente/perfil', icon: <FaUser />, label: 'Mi Perfil' },
        { path: '/cliente/clases', icon: <FaCalendarAlt />, label: 'Mis Clases' },
        { path: '/cliente/suscripcion', icon: <FaClipboardList />, label: 'Mi Suscripción' },
        { path: '/cliente/rutinas', icon: <FaRutina />, label: 'Mis Rutinas' },
        { path: '/cliente/dieta', icon: <FaAppleAlt />, label: 'Mi Dieta' },
        { path: '/cliente/compras', icon: <FaShoppingBag />, label: 'Mis Compras' },
        { path: '/cliente/tienda', icon: <FaShoppingCart />, label: 'Tienda' },
        { path: '/cliente/eventos', icon: <FaCalendarCheck />, label: 'Eventos' },
    ];

    const styles = {
        container: { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
        sidebar: { width: '260px', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', overflowY: 'auto' },
        logo: { padding: '1.5rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' },
        nav: { padding: '1rem 0', flex: 1 },
        navItem: (isActive) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1.5rem', color: isActive ? '#FFD700' : '#888',
            background: isActive ? 'rgba(255,215,0,0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid #FFD700' : '3px solid transparent',
            textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s',
            cursor: 'pointer',
        }),
        userSection: { padding: '1rem 1.5rem', borderTop: '1px solid #222' },
        userName: { color: '#fff', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        btnLogout: { width: '100%', padding: '0.6rem', background: 'transparent', border: '1px solid #444', borderRadius: '6px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' },
        main: { marginLeft: '260px', flex: 1 },
        header: { background: '#111', borderBottom: '1px solid #222', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
        headerTitle: { color: '#FFD700', fontSize: '0.85rem', letterSpacing: '2px' },
        content: { padding: '2rem' },
        volverLink: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.75rem 1.5rem', 
            color: '#888',
            textDecoration: 'none', 
            fontSize: '0.9rem',
            borderBottom: '1px solid #222',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}><FaDumbbell /> GIMNASIO PR</div>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.volverLink}>
                        <FaHome /> Volver al Inicio
                    </Link>

                    {menuItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            style={styles.navItem(location.pathname === item.path)}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>
                <div style={styles.userSection}>
                    <div style={styles.userName}><FaUser /> {usuario?.nombre}</div>
                    <button onClick={handleLogout} style={styles.btnLogout}><FaSignOutAlt /> Cerrar sesión</button>
                </div>
            </aside>
            <div style={styles.main}>
                <header style={styles.header}>
                    <span style={styles.headerTitle}>ÁREA DE CLIENTES</span>
                    <span style={{color:'#888', fontSize:'0.85rem'}}>👤 {usuario?.nombre}</span>
                </header>
                <main style={styles.content}>{children}</main>
            </div>
        </div>
    );
};

export default ClienteLayout;