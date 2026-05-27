
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaDumbbell, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiInstagramFill } from 'react-icons/ri';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!correo.trim()) {
            setError('El correo es requerido');
            return;
        }
        if (!password) {
            setError('La contraseña es requerida');
            return;
        }

        try {
            const data = await login(correo, password);

            // VERIFICAR SI HAY PLAN SELECCIONADO EN LOCALSTORAGE
            const planSeleccionado = localStorage.getItem('planSeleccionado');

            if (planSeleccionado && data.tabla !== 'administrador' && data.tabla !== 'instructor') {
                // Si es cliente y tenía un plan seleccionado, ir a elegir plan
                navigate('/cliente/elegir-plan');
            } else if (data.tabla === 'administrador') {
                navigate('/admin/dashboard');
            } else if (data.tabla === 'instructor') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/cliente/dashboard');
            }
        } catch (err) {
            const mensaje = err.response?.data?.message;

            if (mensaje?.includes('Correo o contraseña incorrectos')) {
                setError('Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
            } else if (mensaje?.includes('requeridos')) {
                setError('Por favor completa todos los campos.');
            } else if (err.response?.status === 401) {
                setError('Credenciales inválidas. ¿Olvidaste tu contraseña?');
            } else if (err.response?.status === 500) {
                setError('Error del servidor. Inténtalo más tarde.');
            } else {
                setError(mensaje || 'Error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };

    // Login con redes sociales
    const loginConGoogle = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    const loginConFacebook = () => {
        window.location.href = 'http://localhost:3000/api/auth/facebook';
    };

    const loginConInstagram = () => {
        window.location.href = 'http://localhost:3000/api/auth/instagram';
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            background: '#0a0a0a',
        },
        leftPanel: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid #FFD700',
            zIndex: 1,
            boxShadow: '4px 0px 15px rgba(255, 215, 0, 0.1)',
        },
        leftContent: {
            textAlign: 'center',
            zIndex: 2,
        },
        icon: {
            color: '#FFD700',
            fontSize: '5rem',
            marginBottom: '1.5rem',
        },
        title: {
            color: '#FFD700',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            letterSpacing: '4px',
            marginBottom: '1rem',
        },
        subtitle: {
            color: '#888',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '400px',
        },
        stats: {
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            justifyContent: 'center',
        },
        statItem: {
            textAlign: 'center',
        },
        statNum: {
            color: '#FFD700',
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        statLabel: {
            color: '#666',
            fontSize: '0.85rem',
            marginTop: '0.3rem',
        },
        rightPanel: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflowY: 'auto',
        },
        card: {
            background: '#222222',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        },
        cardHeader: {
            textAlign: 'center',
            marginBottom: '1.5rem',
        },
        cardTitle: {
            color: '#FFD700',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
        },
        cardSubtitle: {
            color: '#888',
            fontSize: '0.9rem',
            marginTop: '0.3rem',
        },
        group: {
            marginBottom: '1.2rem',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#FFD700',
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
            fontWeight: '600',
            letterSpacing: '1px',
        },
        input: {
            width: '100%',
            padding: '0.9rem 1rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s',
            boxSizing: 'border-box',
        },
        inputError: {
            borderColor: '#ff4444',
            boxShadow: '0 0 0 1px #ff4444',
        },
        passwordContainer: {
            position: 'relative',
        },
        eyeIcon: {
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#888',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '1.1rem',
            padding: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        btn: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #FFD700, #B8860B)',
            border: 'none',
            borderRadius: '8px',
            color: '#0a0a0a',
            fontSize: '1rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginTop: '0.5rem',
            cursor: 'pointer',
            transition: 'opacity 0.3s',
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            color: '#666',
            fontSize: '0.85rem',
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            background: '#333',
        },
        dividerText: {
            padding: '0 1rem',
        },
        socialBtn: {
            width: '100%',
            padding: '0.9rem',
            border: '1px solid #333',
            borderRadius: '8px',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            transition: 'all 0.3s',
        },
        googleBtn: {
            borderColor: '#444',
        },
        googleIcon: {
            fontSize: '1.3rem',
        },
        facebookBtn: {
            background: '#1877F2',
            borderColor: '#1877F2',
            color: '#fff',
        },
        facebookIcon: {
            fontSize: '1.3rem',
        },
        instagramBtn: {
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            border: 'none',
            color: '#fff',
        },
        instagramIcon: {
            fontSize: '1.3rem',
        },
        error: {
            background: 'rgba(255,68,68,0.1)',
            border: '1px solid #ff4444',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#ff4444',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        footer: {
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#888',
            fontSize: '0.9rem',
        },
        link: {
            color: '#FFD700',
            fontWeight: 'bold',
            textDecoration: 'none',
        },
        forgotPassword: {
            textAlign: 'right',
            marginTop: '0.3rem',
            marginBottom: '0.5rem',
        },
        forgotLink: {
            color: '#FFD700',
            fontSize: '0.8rem',
            textDecoration: 'none',
        },
    };

    const tieneError = error.includes('correo') || error.includes('contraseña') || error.includes('Credenciales');

    return (
        <div style={styles.container}>
            {/* Panel izquierdo - Branding */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.icon}><FaDumbbell /></div>
                    <div style={styles.title}>GIMNASIO PR</div>
                    <div style={styles.subtitle}>
                        Tu mejor versión empieza aquí. Transformamos vidas a través del deporte y el bienestar en Apartadó, Antioquia.
                    </div>
                    <div style={styles.stats}>
                        <div style={styles.statItem}>
                            <div style={styles.statNum}>500+</div>
                            <div style={styles.statLabel}>Miembros</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statNum}>10+</div>
                            <div style={styles.statLabel}>Instructores</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statNum}>5</div>
                            <div style={styles.statLabel}>Años</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div style={styles.rightPanel}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitle}>BIENVENIDO</div>
                        <div style={styles.cardSubtitle}>Inicia sesión en tu cuenta</div>
                    </div>

                    {error && (
                        <div style={styles.error}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Botones de redes sociales */}
                    <button 
                        type="button" 
                        style={{...styles.socialBtn, ...styles.googleBtn}} 
                        onClick={loginConGoogle}
                    >
                        <FcGoogle style={styles.googleIcon} />
                        Continuar con Gmail
                    </button>

                    <button 
                        type="button" 
                        style={{...styles.socialBtn, ...styles.facebookBtn}} 
                        onClick={loginConFacebook}
                    >
                        <FaFacebook style={styles.facebookIcon} />
                        Continuar con Facebook
                    </button>

                    <button 
                        type="button" 
                        style={{...styles.socialBtn, ...styles.instagramBtn}} 
                        onClick={loginConInstagram}
                    >
                        <RiInstagramFill style={styles.instagramIcon} />
                        Continuar con Instagram
                    </button>

                    {/* Divisor */}
                    <div style={styles.divider}>
                        <div style={styles.dividerLine}></div>
                        <span style={styles.dividerText}>o</span>
                        <div style={styles.dividerLine}></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.group}>
                            <label style={styles.label}>
                                <FaEnvelope /> CORREO
                            </label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => {
                                    setCorreo(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                placeholder="tu@correo.com"
                                style={{
                                    ...styles.input,
                                    ...(tieneError && error.includes('correo') ? styles.inputError : {})
                                }}
                            />
                        </div>

                        <div style={styles.group}>
                            <label style={styles.label}>
                                <FaLock /> CONTRASEÑA
                            </label>
                            <div style={styles.passwordContainer}>
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        ...styles.input,
                                        paddingRight: '3rem',
                                        ...(tieneError && error.includes('contraseña') ? styles.inputError : {})
                                    }}
                                />
                                <button
                                    type="button"
                                    style={styles.eyeIcon}
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    tabIndex="-1"
                                >
                                    {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div style={styles.forgotPassword}>
                                <Link to="/recuperar-password" style={styles.forgotLink}>¿Olvidaste tu contraseña?</Link>
                            </div>
                        </div>

                        <button type="submit" style={styles.btn}>
                            INGRESAR
                        </button>
                    </form>

                    <div style={styles.footer}>
                        ¿No tienes cuenta? <Link to="/registro" style={styles.link}>Regístrate</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;