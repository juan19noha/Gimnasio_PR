import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Token inválido o expirado. Solicita un nuevo enlace de recuperación.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (password !== confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            setCargando(true);
            setError('');
            await api.post('/auth/reset-password', { token, password });
            setExito(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al restablecer contraseña. El token puede haber expirado.');
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)', padding: '1rem' },
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', textAlign: 'center' },
        logo: { color: '#FFD700', fontSize: '2.5rem', marginBottom: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        subtitulo: { color: '#888', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 },
        formGroup: { marginBottom: '1.2rem', textAlign: 'left' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        inputContainer: { position: 'relative' },
        input: { width: '100%', padding: '0.75rem 1rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.95rem' },
        eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' },
        btnEnviar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' },
        error: { color: '#ff4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' },
        success: { color: '#00C851', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
        successIcon: { fontSize: '3rem', color: '#00C851', marginBottom: '1rem' },
        backLink: { color: '#888', fontSize: '0.85rem', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer', border: 'none', background: 'none' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {!exito ? (
                    <>
                        <div style={styles.logo}>🔑</div>
                        <h1 style={styles.titulo}>Nueva Contraseña</h1>
                        <p style={styles.subtitulo}>Crea una contraseña segura para tu cuenta.</p>
                        
                        {error && <div style={styles.error}>{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NUEVA CONTRASEÑA</label>
                                <div style={styles.inputContainer}>
                                    <input 
                                        style={styles.input} 
                                        type={mostrar ? 'text' : 'password'} 
                                        value={password} 
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        placeholder="Mínimo 6 caracteres"
                                        required 
                                    />
                                    <button type="button" style={styles.eyeBtn} onClick={() => setMostrar(!mostrar)}>
                                        {mostrar ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CONFIRMAR CONTRASEÑA</label>
                                <input 
                                    style={styles.input} 
                                    type={mostrar ? 'text' : 'password'} 
                                    value={confirmar} 
                                    onChange={(e) => { setConfirmar(e.target.value); setError(''); }}
                                    placeholder="Repite tu contraseña"
                                    required 
                                />
                            </div>
                            <button type="submit" style={styles.btnEnviar} disabled={cargando || !token}>
                                {cargando ? 'Guardando...' : <><FaLock /> Restablecer Contraseña</>}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={styles.successIcon}><FaCheckCircle /></div>
                        <h1 style={styles.titulo}>¡Contraseña Actualizada!</h1>
                        <p style={styles.subtitulo}>Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión.</p>
                        <div style={styles.success}><FaCheckCircle /> Redirigiendo en 3 segundos...</div>
                        <button style={styles.backLink} onClick={() => navigate('/login')}>
                            <FaArrowLeft /> Ir al login ahora
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;