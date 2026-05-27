import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { FaUsers, FaTrash, FaSearch, FaEdit, FaPlus, FaTimes, FaSave } from 'react-icons/fa';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', apellido: '', telefono: '', sexo: 'Masculino' });
    const [mensaje, setMensaje] = useState('');

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = async () => {
        try {
            setCargando(true);
            const { data } = await api.get('/usuarios');
            setUsuarios(data.data || []);
        } finally {
            setCargando(false);
        }
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalEditar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setFormData({ nombre: usuario.nombre || '', apellido: usuario.apellido || '', telefono: usuario.telefono || '', sexo: usuario.sexo || 'Masculino' });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEliminar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalEliminar(true);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/usuarios/${usuarioSeleccionado.PK_id_usuario}`, formData);
            setMensaje('Usuario actualizado correctamente');
            setTimeout(() => { setModalAbierto(false); cargarUsuarios(); setMensaje(''); }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al actualizar');
        }
    };

    const handleEliminar = async () => {
        try {
            await api.delete(`/usuarios/${usuarioSeleccionado.PK_id_usuario}`);
            setMensaje('Usuario eliminado correctamente');
            setTimeout(() => { setModalEliminar(false); cargarUsuarios(); setMensaje(''); }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al eliminar');
        }
    };

    const styles = {
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { background: '#111', color: '#FFD700', padding: '1rem', textAlign: 'left', borderBottom: '2px solid #333', fontSize: '0.8rem', letterSpacing: '1px' },
        td: { padding: '1rem', borderBottom: '1px solid #222', color: '#fff', fontSize: '0.85rem' },
        acciones: { display: 'flex', gap: '0.5rem' },
        btnAccion: (color) => ({ background: color + '20', border: 'none', color, padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }),
        badge: { background: '#1a3a1a', color: '#00C851', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' },
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '480px' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
        modalEliminar: { textAlign: 'center', padding: '1rem 0' },
        modalTexto: { color: '#888', marginBottom: '1.5rem' },
        btnEliminar: { padding: '0.75rem 1.5rem', background: '#ff4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginRight: '0.5rem' },
        btnCancelar: { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#888', cursor: 'pointer' },
    };

    return (
        <AdminLayout>
            <div style={styles.header}>
                <h1 style={styles.titulo}><FaUsers /> Usuarios ({usuarios.length})</h1>
            </div>

            <div style={styles.buscador}>
                <FaSearch color="#888" />
                <input style={styles.inputBuscar} placeholder="Buscar por nombre o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div style={styles.tablaContainer}>
                <table style={styles.tabla}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>NOMBRE</th>
                            <th style={styles.th}>CORREO</th>
                            <th style={styles.th}>TELÉFONO</th>
                            <th style={styles.th}>SEXO</th>
                            <th style={styles.th}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan="6" style={{...styles.td, textAlign:'center', color:'#FFD700'}}>Cargando...</td></tr>
                        ) : usuariosFiltrados.map(u => (
                            <tr key={u.PK_id_usuario}>
                                <td style={styles.td}>#{u.PK_id_usuario}</td>
                                <td style={styles.td}>{u.nombre} {u.apellido}</td>
                                <td style={styles.td}>{u.correo}</td>
                                <td style={styles.td}>{u.telefono}</td>
                                <td style={styles.td}><span style={styles.badge}>{u.sexo}</span></td>
                                <td style={styles.td}>
                                    <div style={styles.acciones}>
                                        <button style={styles.btnAccion('#33b5e5')} onClick={() => abrirModalEditar(u)}>
                                            <FaEdit /> Editar
                                        </button>
                                        <button style={styles.btnAccion('#ff4444')} onClick={() => abrirModalEliminar(u)}>
                                            <FaTrash /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!cargando && usuariosFiltrados.length === 0 && (
                            <tr><td colSpan="6" style={{...styles.td, textAlign:'center', padding:'3rem'}}>
                                {busqueda ? 'No se encontraron resultados' : 'No hay usuarios registrados'}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalAbierto && (
                <div style={styles.overlay} onClick={() => setModalAbierto(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>Editar Usuario</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
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
                                <label style={styles.label}>TELÉFONO</label>
                                <input style={styles.input} name="telefono" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>SEXO</label>
                                <select style={styles.select} name="sexo" value={formData.sexo} onChange={handleChange}>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <button type="submit" style={styles.btnGuardar}><FaSave /> Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            )}

            {modalEliminar && (
                <div style={styles.overlay} onClick={() => setModalEliminar(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalEliminar}>
                            <h2 style={styles.modalTitulo}>¿Eliminar Usuario?</h2>
                            <p style={styles.modalTexto}>
                                ¿Estás seguro de eliminar a <strong style={{color:'#FFD700'}}>{usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}</strong>?<br/>
                                Esta acción no se puede deshacer.
                            </p>
                            {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                            <button style={styles.btnEliminar} onClick={handleEliminar}><FaTrash /> Sí, Eliminar</button>
                            <button style={styles.btnCancelar} onClick={() => setModalEliminar(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Usuarios;