import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaCalendarAlt } from 'react-icons/fa';

const ClasesAdmin = () => {
    const [clases, setClases] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        FK_id_instructor: '', FK_id_categoria: '', nombre_clase: '', fecha_hora: '', capacidad_maxima: '', lugar: '', descripcion_clase: ''
    });
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [clasesRes, instructoresRes, categoriasRes] = await Promise.all([
                api.get('/clases'),
                api.get('/instructores'),
                api.get('/categorias')
            ]);
            setClases(clasesRes.data.data || []);
            setInstructores(instructoresRes.data.data || []);
            setCategorias(categoriasRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const clasesFiltradas = clases.filter(c => 
        c.nombre_clase?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.instructor_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setClaseSeleccionada(null);
        setFormData({ FK_id_instructor: '', FK_id_categoria: '', nombre_clase: '', fecha_hora: '', capacidad_maxima: '', lugar: '', descripcion_clase: '' });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEditar = (clase) => {
        setClaseSeleccionada(clase);
        setFormData({
            FK_id_instructor: clase.FK_id_instructor || '',
            FK_id_categoria: clase.FK_id_categoria || '',
            nombre_clase: clase.nombre_clase || '',
            fecha_hora: clase.fecha_hora ? new Date(clase.fecha_hora).toISOString().slice(0, 16) : '',
            capacidad_maxima: clase.capacidad_maxima || '',
            lugar: clase.lugar || '',
            descripcion_clase: clase.descripcion_clase || ''
        });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEliminar = (clase) => {
        setClaseSeleccionada(clase);
        setModalEliminar(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            if (claseSeleccionada) {
                await api.put(`/clases/${claseSeleccionada.PK_id_clase}`, formData);
                setMensaje('Clase actualizada correctamente');
            } else {
                await api.post('/clases', formData);
                setMensaje('Clase creada correctamente');
            }
            setTimeout(() => {
                setModalAbierto(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al guardar clase');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async () => {
        try {
            setCargando(true);
            await api.delete(`/clases/${claseSeleccionada.PK_id_clase}`);
            setMensaje('Clase eliminada correctamente');
            setTimeout(() => {
                setModalEliminar(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al eliminar clase');
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        container: { padding: '1rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' },
        btnNuevo: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '1rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', background: '#111', letterSpacing: '1px' },
        td: { padding: '1rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        acciones: { display: 'flex', gap: '0.5rem' },
        btnAccion: (color) => ({ background: color + '20', border: 'none', color: color, padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }),
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
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
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Gestión de Clases</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nueva Clase
                    </button>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por nombre o instructor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.tablaContainer}>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>NOMBRE</th>
                                <th style={styles.th}>INSTRUCTOR</th>
                                <th style={styles.th}>FECHA/HORA</th>
                                <th style={styles.th}>CAPACIDAD</th>
                                <th style={styles.th}>LUGAR</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clasesFiltradas.map((clase) => (
                                <tr key={clase.PK_id_clase}>
                                    <td style={styles.td}>#{clase.PK_id_clase}</td>
                                    <td style={styles.td}>{clase.nombre_clase}</td>
                                    <td style={styles.td}>{clase.instructor_nombre} {clase.instructor_apellido}</td>
                                    <td style={styles.td}><span style={styles.badge('#33b5e5')}><FaCalendarAlt /> {clase.fecha_hora ? new Date(clase.fecha_hora).toLocaleString() : 'N/A'}</span></td>
                                    <td style={styles.td}>{clase.capacidad_maxima}</td>
                                    <td style={styles.td}>{clase.lugar}</td>
                                    <td style={styles.td}>
                                        <div style={styles.acciones}>
                                            <button style={styles.btnAccion('#33b5e5')} onClick={() => abrirModalEditar(clase)}>
                                                <FaEdit /> Editar
                                            </button>
                                            <button style={styles.btnAccion('#ff4444')} onClick={() => abrirModalEliminar(clase)}>
                                                <FaTrash /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clasesFiltradas.length === 0 && (
                                <tr><td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay clases registradas'}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalAbierto && (
                <div style={styles.overlay} onClick={() => setModalAbierto(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>{claseSeleccionada ? 'Editar Clase' : 'Nueva Clase'}</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NOMBRE DE LA CLASE *</label>
                                <input style={styles.input} name="nombre_clase" value={formData.nombre_clase} onChange={handleChange} required />
                            </div>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>INSTRUCTOR *</label>
                                    <select style={styles.select} name="FK_id_instructor" value={formData.FK_id_instructor} onChange={handleChange} required>
                                        <option value="">Seleccionar...</option>
                                        {instructores.map(inst => (
                                            <option key={inst.PK_id_usuario} value={inst.PK_id_usuario}>{inst.nombre} {inst.apellido}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CATEGORÍA *</label>
                                    <select style={styles.select} name="FK_id_categoria" value={formData.FK_id_categoria} onChange={handleChange} required>
                                        <option value="">Seleccionar...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.PK_id_categoria} value={cat.PK_id_categoria}>{cat.nombre_categoria}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>FECHA Y HORA *</label>
                                    <input style={styles.input} name="fecha_hora" type="datetime-local" value={formData.fecha_hora} onChange={handleChange} required />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CAPACIDAD MÁXIMA *</label>
                                    <input style={styles.input} name="capacidad_maxima" type="number" value={formData.capacidad_maxima} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>LUGAR</label>
                                <input style={styles.input} name="lugar" value={formData.lugar} onChange={handleChange} placeholder="Ej: Sala A, Piso 2" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>DESCRIPCIÓN</label>
                                <textarea style={styles.textarea} name="descripcion_clase" value={formData.descripcion_clase} onChange={handleChange} placeholder="Descripción de la clase..." />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Guardando...' : (claseSeleccionada ? 'Actualizar' : 'Crear')} Clase
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {modalEliminar && (
                <div style={styles.overlay} onClick={() => setModalEliminar(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalEliminar}>
                            <h2 style={styles.modalTitulo}>¿Eliminar Clase?</h2>
                            <p style={styles.modalTexto}>
                                ¿Estás seguro de eliminar <strong style={{color:'#FFD700'}}>{claseSeleccionada?.nombre_clase}</strong>?<br/>
                                Esta acción no se puede deshacer.
                            </p>
                            {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                            <div>
                                <button style={styles.btnEliminar} onClick={handleEliminar} disabled={cargando}>
                                    <FaTrash /> {cargando ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                                <button style={styles.btnCancelar} onClick={() => setModalEliminar(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ClasesAdmin;