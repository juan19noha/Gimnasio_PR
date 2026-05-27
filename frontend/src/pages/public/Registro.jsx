import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaDumbbell, FaEnvelope, FaLock, FaIdCard, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

const Registro = () => {
    const [datos, setDatos] = useState({
        tipo_documento: 'CC',
        numero_documento: '',
        nombre: '',
        apellido: '',
        sexo: 'Masculino',
        correo: '',
        telefono: '',
        password: '',
        confirmarPassword: ''
    });
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const { registro } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validarFormulario = () => {
        if (datos.password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        if (datos.password !== datos.confirmarPassword) {
            return 'Las contraseñas no coinciden';
        }
        if (!datos.correo.includes('@')) {
            return 'El correo no es válido';
        }
        if (datos.telefono.length < 7) {
            return 'El teléfono debe tener al menos 7 dígitos';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setCargando(true);

        const { confirmarPassword, ...datosParaEnviar } = datos;

        try {
            await registro(datosParaEnviar);
            setExito('¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errores = err.response?.data?.errores;
            if (errores && errores.length > 0) {
                const erroresTraducidos = errores.map(err => {
                    if (err.includes('password') && err.includes('6')) return 'La contraseña debe tener al menos 6 caracteres';
                    if (err.includes('correo')) return 'El correo debe ser válido';
                    if (err.includes('nombre')) return 'El nombre es requerido';
                    if (err.includes('apellido')) return 'El apellido es requerido';
                    return err;
                });
                setError(erroresTraducidos.join(', '));
            } else {
                setError(err.response?.data?.message || 'Error al registrarse');
            }
        } finally {
            setCargando(false);
        }
    };

    const fortalezaPassword = () => {
        const pass = datos.password;
        if (pass.length === 0) return { texto: '', color: '' };
        if (pass.length < 6) return { texto: 'Muy corta (mínimo 6)', color: '#ff4444' };
        if (pass.length < 8) return { texto: 'Débil', color: '#ff8800' };
        if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) return { texto: 'Media', color: '#ffdd00' };
        return { texto: 'Fuerte', color: '#00C851' };
    };

    const fuerza = fortalezaPassword();

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
        benefits: {
            marginTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'flex-start',
            maxWidth: '350px',
        },
        benefitItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#aaa',
            fontSize: '0.95rem',
        },
        benefitIcon: {
            color: '#FFD700',
            fontSize: '1.2rem',
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
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
            marginBottom: '1rem',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#FFD700',
            fontSize: '0.75rem',
            marginBottom: '0.4rem',
            fontWeight: '600',
            letterSpacing: '1px',
        },
        input: {
            width: '100%',
            padding: '0.8rem 1rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
        },
        inputError: {
            borderColor: '#ff4444',
        },
        select: {
            width: '100%',
            padding: '0.8rem 1rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
        },
        grid2: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
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
            marginTop: '0.5rem',
            cursor: 'pointer',
            letterSpacing: '1px',
        },
        btnDisabled: {
            opacity: '0.6',
            cursor: 'not-allowed',
        },
        error: {
            background: 'rgba(255,68,68,0.1)',
            border: '1px solid #ff4444',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff4444',
            marginBottom: '1rem',
            fontSize: '0.9rem',
        },
        exito: {
            background: 'rgba(0,200,81,0.1)',
            border: '1px solid #00C851',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#00C851',
            marginBottom: '1rem',
            fontSize: '0.9rem',
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
            fontSize: '1rem',
        },
        fortaleza: {
            fontSize: '0.8rem',
            marginTop: '0.3rem',
            fontWeight: '600',
        },
        hint: {
            color: '#888',
            fontSize: '0.75rem',
            marginTop: '0.2rem',
        },
    };

    return (
        <div style={styles.container}>
            {/* Panel izquierdo - Branding */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.icon}><FaDumbbell /></div>
                    <div style={styles.title}>GIMNASIO PR</div>
                    <div style={styles.subtitle}>
                        Únete a la comunidad fitness más grande de Apartadó. Entrena con los mejores instructores y alcanza tus metas.
                    </div>
                    <div style={styles.benefits}>
                        <div style={styles.benefitItem}>
                            <span style={styles.benefitIcon}>✓</span>
                            <span>Entrenadores certificados</span>
                        </div>
                        <div style={styles.benefitItem}>
                            <span style={styles.benefitIcon}>✓</span>
                            <span>Equipos de última generación</span>
                        </div>
                        <div style={styles.benefitItem}>
                            <span style={styles.benefitIcon}>✓</span>
                            <span>Planes personalizados</span>
                        </div>
                        <div style={styles.benefitItem}>
                            <span style={styles.benefitIcon}>✓</span>
                            <span>Clases grupales incluidas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div style={styles.rightPanel}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitle}>CREAR CUENTA</div>
                        <div style={styles.cardSubtitle}>Completa tus datos para registrarte</div>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}
                    {exito && <div style={styles.exito}>{exito}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.grid2}>
                            <div style={styles.group}>
                                <label style={styles.label}>TIPO DOC</label>
                                <select name="tipo_documento" value={datos.tipo_documento} onChange={handleChange} style={styles.select}>
                                    <option value="CC">Cédula</option>
                                    <option value="CE">C. Extranjería</option>
                                    <option value="TI">T. Identidad</option>
                                </select>
                            </div>
                            <div style={styles.group}>
                                <label style={styles.label}>NÚMERO DOC</label>
                                <input name="numero_documento" value={datos.numero_documento} onChange={handleChange} required style={styles.input} placeholder="12345678" />
                            </div>
                        </div>

                        <div style={styles.grid2}>
                            <div style={styles.group}>
                                <label style={styles.label}>NOMBRE</label>
                                <input name="nombre" value={datos.nombre} onChange={handleChange} required style={styles.input} placeholder="Juan" />
                            </div>
                            <div style={styles.group}>
                                <label style={styles.label}>APELLIDO</label>
                                <input name="apellido" value={datos.apellido} onChange={handleChange} required style={styles.input} placeholder="Pérez" />
                            </div>
                        </div>

                        <div style={styles.grid2}>
                            <div style={styles.group}>
                                <label style={styles.label}>SEXO</label>
                                <select name="sexo" value={datos.sexo} onChange={handleChange} style={styles.select}>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div style={styles.group}>
                                <label style={styles.label}><FaPhone /> TELÉFONO</label>
                                <input name="telefono" value={datos.telefono} onChange={handleChange} required style={styles.input} placeholder="3001234567" />
                            </div>
                        </div>

                        <div style={styles.group}>
                            <label style={styles.label}><FaEnvelope /> CORREO</label>
                            <input name="correo" type="email" value={datos.correo} onChange={handleChange} required style={styles.input} placeholder="tu@correo.com" />
                        </div>

                        <div style={styles.grid2}>
                            <div style={styles.group}>
                                <label style={styles.label}><FaLock /> CONTRASEÑA</label>
                                <div style={styles.passwordContainer}>
                                    <input 
                                        name="password" 
                                        type={mostrarPassword ? 'text' : 'password'} 
                                        value={datos.password} 
                                        onChange={handleChange} 
                                        required 
                                        style={{
                                            ...styles.input,
                                            ...(datos.password.length > 0 && datos.password.length < 6 ? styles.inputError : {})
                                        }} 
                                        placeholder="Mínimo 6 caracteres" 
                                    />
                                    <button type="button" style={styles.eyeIcon} onClick={() => setMostrarPassword(!mostrarPassword)}>
                                        {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {datos.password && (
                                    <div style={{ ...styles.fortaleza, color: fuerza.color }}>
                                        {fuerza.texto}
                                    </div>
                                )}
                            </div>

                            <div style={styles.group}>
                                <label style={styles.label}><FaLock /> CONFIRMAR</label>
                                <div style={styles.passwordContainer}>
                                    <input 
                                        name="confirmarPassword" 
                                        type={mostrarConfirmar ? 'text' : 'password'} 
                                        value={datos.confirmarPassword} 
                                        onChange={handleChange} 
                                        required 
                                        style={{
                                            ...styles.input,
                                            ...(datos.confirmarPassword && datos.confirmarPassword !== datos.password ? styles.inputError : {})
                                        }} 
                                        placeholder="Repite tu contraseña" 
                                    />
                                    <button type="button" style={styles.eyeIcon} onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                                        {mostrarConfirmar ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {datos.confirmarPassword && datos.confirmarPassword !== datos.password && (
                                    <div style={{ ...styles.fortaleza, color: '#ff4444' }}>
                                        No coinciden
                                    </div>
                                )}
                                {datos.confirmarPassword && datos.confirmarPassword === datos.password && datos.password.length >= 6 && (
                                    <div style={{ ...styles.fortaleza, color: '#00C851' }}>
                                        ✓ Coinciden
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            style={{ ...styles.btn, ...(cargando ? styles.btnDisabled : {}) }} 
                            disabled={cargando}
                        >
                            {cargando ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;