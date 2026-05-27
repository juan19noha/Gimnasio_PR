import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const RecuperarPassword = () => {
    const [correo, setCorreo] = useState('');
    const [cargando, setCargando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!correo.includes('@')) {
            setError('Por favor ingresa un correo válido');
            return;
        }
        try {
            setCargando(true);
            setError('');
            await api.post('/auth/recuperar-password', { correo });
            setEnviado(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al enviar solicitud. Verifica tu correo.');
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
        input: { width: '100%', padding: '0.75rem 1rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.95rem' },
        btnEnviar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' },
        error: { color: '#ff4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
        success: { color: '#00C851', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
        backLink: { color: '#888', fontSize: '0.85rem', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
        successIcon: { fontSize: '3rem', color: '#00C851', marginBottom: '1rem' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}></div>
                
                {!enviado ? (
                    <>
                        <h1 style={styles.titulo}>Recuperar Contraseña</h1>
                        <p style={styles.subtitulo}>Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</p>
                        
                        {error && <div style={styles.error}><FaExclamationTriangle /> {error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CORREO ELECTRÓNICO</label>
                                <input 
                                    style={styles.input} 
                                    type="email" 
                                    value={correo} 
                                    onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                                    placeholder="tu@correo.com"
                                    required 
                                />
                                
                            </div>
                            <button type="submit" style={styles.btnEnviar} disabled={cargando}>
                                {cargando ? 'Enviando...' : <><FaEnvelope /> Enviar Instrucciones</>}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={styles.successIcon}><FaCheckCircle /></div>
                        <h1 style={styles.titulo}>¡Correo Enviado!</h1>
                        <p style={styles.subtitulo}>Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.</p>
                        <div style={styles.success}><FaCheckCircle /> Si no lo encuentras, revisa tu carpeta de spam.</div>
                    </>
                )}
                
                <Link to="/login" style={styles.backLink}>
                    <FaArrowLeft /> Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
};

export default RecuperarPassword;