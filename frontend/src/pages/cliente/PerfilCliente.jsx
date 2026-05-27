import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import { FaUser, FaSave, FaLock, FaEye, FaEyeSlash, FaCalendarAlt, FaDumbbell } from 'react-icons/fa';

const PerfilCliente = () => {
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', correo: '', telefono: '',
        sexo: 'M', tipo_documento: 'CC', numero_documento: ''
    });
    const [passwordData, setPasswordData] = useState({
        passwordActual: '', passwordNueva: '', passwordConfirmar: ''
    });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mensajePassword, setMensajePassword] = useState('');
    const [activeTab, setActiveTab] = useState('datos');
    const [suscripcion, setSuscripcion] = useState(null);

    useEffect(() => {
        cargarPerfil();
        cargarSuscripcion();
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
                sexo: userData.sexo || 'M',
                tipo_documento: userData.tipo_documento || 'CC',
                numero_documento: userData.numero_documento || ''
            });
        } catch (error) {
            console.error('Error cargando perfil:', error);
        }
    };

    const cargarSuscripcion = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
            const { data } = await api.get(`/suscripciones/usuario/${userData.PK_id_usuario}`);
            setSuscripcion(data.data?.[0] || null);
        } catch (error) {
            console.log('No hay suscripción activa');
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
            await api.put(`/usuarios/${usuario.PK_id_usuario}`, formData);
            
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
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
        passwordContainer: { position: 'relative' },
        eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' },
        suscripcionCard: { background: 'rgba(255,215,0,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' },
        suscripcionTitulo: { color: '#FFD700', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        suscripcionTexto: { color: '#888', fontSize: '0.85rem', marginBottom: '0.3rem' },
        estadoActivo: { color: '#00C851', fontWeight: 'bold' },
        estadoInactivo: { color: '#ff4444', fontWeight: 'bold' }
    };

    return (
        <ClienteLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}><FaUser /> Mi Perfil</h1>
                
                <div style={styles.tabs}>
                    <button style={styles.tab(activeTab === 'datos')} onClick={() => setActiveTab('datos')}>Mis Datos</button>
                    <button style={styles.tab(activeTab === 'password')} onClick={() => setActiveTab('password')}>Cambiar Contraseña</button>
                </div>

                {activeTab === 'datos' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={styles.avatar}>👤</div>
                        </div>
                        
                        {suscripcion && (
                            <div style={styles.suscripcionCard}>
                                <div style={styles.suscripcionTitulo}><FaDumbbell /> Mi Plan Actual</div>
                                <div style={styles.suscripcionTexto}><strong>Plan:</strong> {suscripcion.nombre_plan}</div>
                                <div style={styles.suscripcionTexto}><strong>Estado:</strong> <span style={suscripcion.estado === 'activa' ? styles.estadoActivo : styles.estadoInactivo}>{suscripcion.estado}</span></div>
                                <div style={styles.suscripcionTexto}><strong>Inicio:</strong> {new Date(suscripcion.fecha_inicio).toLocaleDateString()}</div>
                                <div style={styles.suscripcionTexto}><strong>Fin:</strong> {new Date(suscripcion.fecha_fin).toLocaleDateString()}</div>
                            </div>
                        )}
                        
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
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>TIPO DOCUMENTO</label>
                                    <select style={styles.select} name="tipo_documento" value={formData.tipo_documento} onChange={handleChange}>
                                        <option value="CC">CC</option>
                                        <option value="CE">CE</option>
                                        <option value="TI">TI</option>
                                        <option value="PAS">PAS</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>NÚMERO DOCUMENTO</label>
                                    <input style={styles.input} name="numero_documento" value={formData.numero_documento} onChange={handleChange} />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>SEXO</label>
                                <select style={styles.select} name="sexo" value={formData.sexo} onChange={handleChange}>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
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
        </ClienteLayout>
    );
};

export default PerfilCliente;