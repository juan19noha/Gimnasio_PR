import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import { useAuth } from '../../context/AuthContext';
import { FaCheck, FaTimes, FaSearch, FaUserCheck, FaUserTimes } from 'react-icons/fa';

const Asistencias = () => {
    const { usuario } = useAuth();
    const [clases, setClases] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState('');
    const [asistencias, setAsistencias] = useState([]);
    const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarClases();
    }, []);

    useEffect(() => {
        if (claseSeleccionada) {
            cargarAsistencias();
        }
    }, [claseSeleccionada]);

    const cargarClases = async () => {
        try {
            const { data } = await api.get(`/clases/instructor/${usuario?.id || usuario?.PK_id_usuario}`);
            setClases(data.data || []);
        } catch (error) {
            console.error('Error cargando clases:', error);
        }
    };

    const cargarAsistencias = async () => {
        try {
            setCargando(true);
            const [asistRes, usuariosRes] = await Promise.all([
                api.get(`/asistencias/clase/${claseSeleccionada}`),
                api.get('/usuarios')
            ]);
            setAsistencias(asistRes.data.data || []);
            
            // Filtrar usuarios que no están en asistencias
            const asistentesIds = asistRes.data.data?.map(a => a.FK_id_usuario) || [];
            const todosUsuarios = usuariosRes.data.data || [];
            setUsuariosDisponibles(todosUsuarios.filter(u => !asistentesIds.includes(u.PK_id_usuario) && u.nombre_rol === 'usuario'));
        } catch (error) {
            console.error('Error cargando asistencias:', error);
        } finally {
            setCargando(false);
        }
    };

    const registrarAsistencia = async (idUsuario) => {
        try {
            setCargando(true);
            await api.post('/asistencias', {
                FK_id_usuario: idUsuario,
                FK_id_clase: claseSeleccionada
            });
            setMensaje('Asistencia registrada correctamente');
            cargarAsistencias();
            setTimeout(() => setMensaje(''), 2000);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al registrar asistencia');
        } finally {
            setCargando(false);
        }
    };

    const eliminarAsistencia = async (idAsistencia) => {
        try {
            setCargando(true);
            await api.delete(`/asistencias/${idAsistencia}`);
            setMensaje('Asistencia eliminada correctamente');
            cargarAsistencias();
            setTimeout(() => setMensaje(''), 2000);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al eliminar asistencia');
        } finally {
            setCargando(false);
        }
    };

    const usuariosFiltrados = usuariosDisponibles.filter(u => 
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const claseActual = clases.find(c => c.PK_id_clase == claseSeleccionada);

    const styles = {
        container: { padding: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' },
        selector: { marginBottom: '2rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '1px' },
        select: { width: '100%', maxWidth: '400px', padding: '0.75rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' },
        mensaje: { color: '#00C851', fontSize: '0.85rem', marginBottom: '1rem' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
        panel: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' },
        panelTitulo: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1rem' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        lista: { maxHeight: '400px', overflowY: 'auto' },
        item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #222' },
        itemInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
        itemAvatar: { width: '35px', height: '35px', background: 'linear-gradient(135deg, #FFD700, #B8860B)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 'bold', fontSize: '0.8rem' },
        itemNombre: { color: '#fff', fontSize: '0.9rem' },
        itemCorreo: { color: '#888', fontSize: '0.75rem' },
        btnAccion: (color) => ({ background: color + '20', border: 'none', color: color, padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }),
        asistenciaItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#111', borderRadius: '8px', marginBottom: '0.5rem' },
        asistenciaInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
        contador: { color: '#888', fontSize: '0.85rem', marginBottom: '1rem' },
        vacio: { color: '#888', textAlign: 'center', padding: '2rem' },
        infoClase: { background: '#111', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #333' },
        infoClaseTitulo: { color: '#FFD700', fontWeight: 'bold', marginBottom: '0.5rem' },
        infoClaseDetalle: { color: '#888', fontSize: '0.85rem' },
    };

    return (
        <InstructorLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}>Registro de Asistencias</h1>

                <div style={styles.selector}>
                    <label style={styles.label}>SELECCIONAR CLASE</label>
                    <select 
                        style={styles.select} 
                        value={claseSeleccionada} 
                        onChange={(e) => setClaseSeleccionada(e.target.value)}
                    >
                        <option value="">-- Selecciona una clase --</option>
                        {clases.map(c => (
                            <option key={c.PK_id_clase} value={c.PK_id_clase}>
                                {c.nombre_clase} - {new Date(c.fecha_hora).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                {mensaje && <div style={styles.mensaje}>{mensaje}</div>}

                {claseActual && (
                    <div style={styles.infoClase}>
                        <div style={styles.infoClaseTitulo}>{claseActual.nombre_clase}</div>
                        <div style={styles.infoClaseDetalle}>
                            {new Date(claseActual.fecha_hora).toLocaleString()} | {claseActual.lugar} | Capacidad: {claseActual.capacidad_maxima}
                        </div>
                    </div>
                )}

                {claseSeleccionada && (
                    <div style={styles.grid}>
                        {/* Panel izquierdo: Usuarios disponibles */}
                        <div style={styles.panel}>
                            <div style={styles.panelTitulo}><FaUserTimes /> Agregar Asistencia</div>
                            <div style={styles.buscador}>
                                <FaSearch color="#888" />
                                <input 
                                    style={styles.inputBuscar} 
                                    placeholder="Buscar usuario..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <div style={styles.lista}>
                                {usuariosFiltrados.map((usuario) => (
                                    <div key={usuario.PK_id_usuario} style={styles.item}>
                                        <div style={styles.itemInfo}>
                                            <div style={styles.itemAvatar}>{usuario.nombre[0]}{usuario.apellido[0]}</div>
                                            <div>
                                                <div style={styles.itemNombre}>{usuario.nombre} {usuario.apellido}</div>
                                                <div style={styles.itemCorreo}>{usuario.correo}</div>
                                            </div>
                                        </div>
                                        <button style={styles.btnAccion('#00C851')} onClick={() => registrarAsistencia(usuario.PK_id_usuario)}>
                                            <FaCheck /> Agregar
                                        </button>
                                    </div>
                                ))}
                                {usuariosFiltrados.length === 0 && (
                                    <div style={styles.vacio}>No hay usuarios disponibles</div>
                                )}
                            </div>
                        </div>

                        {/* Panel derecho: Asistencias registradas */}
                        <div style={styles.panel}>
                            <div style={styles.panelTitulo}><FaUserCheck /> Asistencias Registradas</div>
                            <div style={styles.contador}>Total: {asistencias.length} asistentes</div>
                            <div style={styles.lista}>
                                {asistencias.map((asistencia) => (
                                    <div key={asistencia.PK_id_asistencia} style={styles.asistenciaItem}>
                                        <div style={styles.asistenciaInfo}>
                                            <div style={styles.itemAvatar}>{asistencia.usuario_nombre?.[0]}{asistencia.usuario_apellido?.[0]}</div>
                                            <div>
                                                <div style={styles.itemNombre}>{asistencia.usuario_nombre} {asistencia.usuario_apellido}</div>
                                                <div style={styles.itemCorreo}>{asistencia.fecha_asistencia ? new Date(asistencia.fecha_asistencia).toLocaleString() : 'Hoy'}</div>
                                            </div>
                                        </div>
                                        <button style={styles.btnAccion('#ff4444')} onClick={() => eliminarAsistencia(asistencia.PK_id_asistencia)}>
                                            <FaTimes /> Quitar
                                        </button>
                                    </div>
                                ))}
                                {asistencias.length === 0 && (
                                    <div style={styles.vacio}>No hay asistencias registradas</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
};

export default Asistencias;