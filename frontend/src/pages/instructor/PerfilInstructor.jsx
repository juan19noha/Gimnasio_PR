import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import { FaUser, FaSave, FaLock, FaEye, FaEyeSlash, FaStar, FaDumbbell } from 'react-icons/fa';

const PerfilInstructor = () => {
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', correo: '', telefono: '',
        especialidad: '', horario_laboral: '', descripcion: ''
    });
    const [passwordData, setPasswordData] = useState({
        passwordActual: '', passwordNueva: '', passwordConfirmar: ''
    });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mensajePassword, setMensajePassword] = useState('');
    const [activeTab, setActiveTab] = useState('datos');

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
            setUsuario(userData);
            setFormData({
                nombre: userData.nombre || '',
                apellido: userData.apellido || '',
                correo: userData.correo || '',
                telefono: userData.telefono || '',
                especialidad: userData.especialidad || '',
                horario_laboral: userData.horario_laboral || '',
                descripcion: userData.descripcion || ''
            });
        } catch (error) {
            console.error('Error cargando perfil:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMensaje('');
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setMensajePassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            await api.put(`/instructores/${usuario.PK_id_usuario}`, formData);
            
            const updatedUser = { ...usuario, ...formData };
            localStorage.setItem('usuario', JSON.stringify(updatedUser));
            setUsuario(updatedUser);
            
            setMensaje('Perfil actualizado correctamente');
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al actualizar perfil');
        } finally {
            setCargando(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.passwordNueva !== passwordData.passwordConfirmar) {
            setMensajePassword('Las contraseñas no coinciden');
            return;
        }
        if (passwordData.passwordNueva.length < 6) {
            setMensajePassword('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        try {
            setCargando(true);
            await api.put(`/usuarios/${usuario.PK_id_usuario}/password`, {
                passwordActual: passwordData.passwordActual,
                passwordNueva: passwordData.passwordNueva
            });
            setMensajePassword('Contraseña actualizada correctamente');
            setPasswordData({ passwordActual: '', passwordNueva: '', passwordConfirmar: '' });
        } catch (error) {
            setMensajePassword(error.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        container: { padding: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' },
        tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' },
        tab: (active) => ({
            background: 'none', border: 'none', color: active ? '#FFD700' : '#888',
            fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer',
            padding: '0.5rem 1rem', borderBottom: active ? '2px solid #FFD700' : '2px solid transparent'
        }),
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', maxWidth: '600px' },
        avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #B8860B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' },
        formGroup: { marginBottom: '1.2rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
        passwordContainer: { position: 'relative' },
        eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' },
        infoBox: { background: 'rgba(255,215,0,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' },
        infoText: { color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' },
        infoLabel: { color: '#FFD700', fontWeight: 'bold' }
    };

    return (
        <InstructorLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}><FaDumbbell /> Mi Perfil de Instructor</h1>
                
                <div style={styles.tabs}>
                    <button style={styles.tab(activeTab === 'datos')} onClick={() => setActiveTab('datos')}>Datos Profesionales</button>
                    <button style={styles.tab(activeTab === 'password')} onClick={() => setActiveTab('password')}>Cambiar Contraseña</button>
                </div>

                {activeTab === 'datos' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                      
                        </div>
                        
                        <div style={styles.infoBox}>
                            <div style={styles.infoText}><span style={styles.infoLabel}>Especialidad:</span> {usuario?.especialidad || 'No definida'}</div>
                            <div style={styles.infoText}><span style={styles.infoLabel}>Puntuación:</span> <FaStar color="#FFD700" /> {usuario?.puntuacion || 'N/A'}/5</div>
                            <div style={styles.infoText}><span style={styles.infoLabel}>Miembro desde:</span> {usuario?.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>NOMBRE</label>
                                    <input style={styles.input} name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>APELLIDO</label>
                                    <input style={styles.input} name="apellido" value={formData.apellido} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CORREO</label>
                                <input style={styles.input} name="correo" type="email" value={formData.correo} onChange={handleChange} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>TELÉFONO</label>
                                <input style={styles.input} name="telefono" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>ESPECIALIDAD</label>
                                <input style={styles.input} name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Ej: CrossFit, Yoga, Pesas..." />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>HORARIO LABORAL</label>
                                <input style={styles.input} name="horario_laboral" value={formData.horario_laboral} onChange={handleChange} placeholder="Ej: Lunes-Viernes 6AM-2PM" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>DESCRIPCIÓN</label>
                                <textarea style={styles.textarea} name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Breve descripción sobre ti..." />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ ...styles.avatar, background: 'linear-gradient(135deg, #ff4444, #cc0000)' }}><FaLock /></div>
                        </div>
                        
                        {mensajePassword && <div style={styles.mensaje(mensajePassword.includes('Error') || mensajePassword.includes('coinciden') ? 'error' : 'success')}>{mensajePassword}</div>}
                        
                        <form onSubmit={handlePasswordSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CONTRASEÑA ACTUAL</label>
                                <div style={styles.passwordContainer}>
                                    <input style={styles.input} name="passwordActual" type={mostrarPassword ? 'text' : 'password'} value={passwordData.passwordActual} onChange={handlePasswordChange} required />
                                    <button type="button" style={styles.eyeBtn} onClick={() => setMostrarPassword(!mostrarPassword)}>
                                        {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NUEVA CONTRASEÑA</label>
                                <input style={styles.input} name="passwordNueva" type="password" value={passwordData.passwordNueva} onChange={handlePasswordChange} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CONFIRMAR NUEVA CONTRASEÑA</label>
                                <input style={styles.input} name="passwordConfirmar" type="password" value={passwordData.passwordConfirmar} onChange={handlePasswordChange} required />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaLock /> {cargando ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
};

export default PerfilInstructor;