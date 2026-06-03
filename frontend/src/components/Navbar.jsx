import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDumbbell, FaUser, FaSignOutAlt, FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaCalendarAlt, FaBox } from 'react-icons/fa';

const Navbar = () => {
    const { usuario, logout, esAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const styles = {
        nav: {
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            borderBottom: '2px solid #FFD700',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.15)'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#FFD700',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '2px'
        },
        links: {
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
        },
        link: {
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.9rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
        },
        btnLogout: {
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <FaDumbbell />
                GIMNASIO PR
            </div>

            {usuario ? (
                <div style={styles.links}>
                    <Link to="/dashboard" style={styles.link}>
                        <FaTachometerAlt /> Dashboard
                    </Link>
                    <Link to="/clases" style={styles.link}>
                        <FaCalendarAlt /> Clases
                    </Link>
                    <Link to="/productos" style={styles.link}>
                        <FaBox /> Productos
                    </Link>
                    {esAdmin() && (
                        <>
                            <Link to="/usuarios" style={styles.link}>
                                <FaUsers /> Usuarios
                            </Link>
                            <Link to="/instructores" style={styles.link}>
                                <FaChalkboardTeacher /> Instructores
                            </Link>
                        </>
                    )}
                    <Link to="/perfil" style={styles.link}>
                        <FaUser /> {usuario.nombre}
                    </Link>
                    <button onClick={handleLogout} style={styles.btnLogout}>
                        <FaSignOutAlt /> Salir
                    </button>
                </div>
            ) : (
                <div style={styles.links}>
                    <Link to="/login" style={styles.link}>Login</Link>
                    <Link to="/registro" style={{...styles.btnLogout, textDecoration: 'none'}}>Registro</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;