import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaStar } from 'react-icons/fa';

const Instructores = () => {
    const [instructores, setInstructores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', correo: '', password: '', especialidad: '', 
        horario_laboral: '', salario: '', puntuacion: 5, descripcion: ''
    });
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarInstructores();
    }, []);

    const cargarInstructores = async () => {
        try {
            setCargando(true);
            const { data } = await api.get('/instructores');
            setInstructores(data.data || []);
        } catch (error) {
            console.error('Error cargando instructores:', error);
            setMensaje('Error al cargar instructores');
        } finally {
            setCargando(false);
        }
    };

    const instructoresFiltrados = instructores.filter(i => 
        i.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.especialidad?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setInstructorSeleccionado(null);
        setFormData({ nombre: '', apellido: '', correo: '', password: '', especialidad: '', horario_laboral: '', salario: '', puntuacion: 5, descripcion: '' });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEditar = (instructor) => {
        setInstructorSeleccionado(instructor);
        setFormData({
            nombre: instructor.nombre || '',
            apellido: instructor.apellido || '',
            correo: instructor.correo || '',
            password: '',
            especialidad: instructor.especialidad || '',
            horario_laboral: instructor.horario_laboral || '',
            salario: instructor.salario || '',
            puntuacion: instructor.puntuacion || 5,
            descripcion: instructor.descripcion || ''
        });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEliminar = (instructor) => {
        setInstructorSeleccionado(instructor);
        setModalEliminar(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            const datosEnviar = { ...formData };
            if (!datosEnviar.password) delete datosEnviar.password;
            
            if (instructorSeleccionado) {
                await api.put(`/instructores/${instructorSeleccionado.PK_id_usuario}`, datosEnviar);
                setMensaje('Instructor actualizado correctamente');
            } else {
                await api.post('/instructores', datosEnviar);
                setMensaje('Instructor creado correctamente');
            }
            setTimeout(() => {
                setModalAbierto(false);
                cargarInstructores();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al guardar instructor');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async () => {
        try {
            setCargando(true);
            await api.delete(`/instructores/${instructorSeleccionado.PK_id_usuario}`);
            setMensaje('Instructor eliminado correctamente');
            setTimeout(() => {
                setModalEliminar(false);
                cargarInstructores();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al eliminar instructor');
        } finally {
            setCargando(false);
        }
    };

    const renderEstrellas = (puntuacion) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar key={i} color={i < puntuacion ? '#FFD700' : '#333'} size={12} />
        ));
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
        especialidad: { background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
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
                    <h1 style={styles.titulo}>Gestión de Instructores</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nuevo Instructor
                    </button>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por nombre o especialidad..."
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
                                <th style={styles.th}>ESPECIALIDAD</th>
                                <th style={styles.th}>HORARIO</th>
                                <th style={styles.th}>SALARIO</th>
                                <th style={styles.th}>PUNTUACIÓN</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructoresFiltrados.map((instructor) => (
                                <tr key={instructor.PK_id_usuario}>
                                    <td style={styles.td}>#{instructor.PK_id_usuario}</td>
                                    <td style={styles.td}>{instructor.nombre} {instructor.apellido}</td>
                                    <td style={styles.td}><span style={styles.especialidad}>{instructor.especialidad}</span></td>
                                    <td style={styles.td}>{instructor.horario_laboral || 'N/A'}</td>
                                    <td style={styles.td}>${instructor.salario?.toLocaleString() || '0'}</td>
                                    <td style={styles.td}>
                                        <div style={{display:'flex', gap:'2px'}}>{renderEstrellas(instructor.puntuacion)}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.acciones}>
                                            <button style={styles.btnAccion('#33b5e5')} onClick={() => abrirModalEditar(instructor)}>
                                                <FaEdit /> Editar
                                            </button>
                                            <button style={styles.btnAccion('#ff4444')} onClick={() => abrirModalEliminar(instructor)}>
                                                <FaTrash /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {instructoresFiltrados.length === 0 && (
                                <tr><td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay instructores registrados'}
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
                            <h2 style={styles.modalTitulo}>{instructorSeleccionado ? 'Editar Instructor' : 'Nuevo Instructor'}</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>NOMBRE *</label>
                                    <input style={styles.input} name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>APELLIDO *</label>
                                    <input style={styles.input} name="apellido" value={formData.apellido} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CORREO *</label>
                                <input style={styles.input} name="correo" type="email" value={formData.correo} onChange={handleChange} required />
                            </div>
                            {!instructorSeleccionado && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CONTRASEÑA *</label>
                                    <input style={styles.input} name="password" type="password" value={formData.password} onChange={handleChange} required={!instructorSeleccionado} />
                                </div>
                            )}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>ESPECIALIDAD *</label>
                                <input style={styles.input} name="especialidad" value={formData.especialidad} onChange={handleChange} required placeholder="Ej: CrossFit, Yoga, Pesas..." />
                            </div>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>HORARIO LABORAL</label>
                                    <input style={styles.input} name="horario_laboral" value={formData.horario_laboral} onChange={handleChange} placeholder="Ej: Lunes-Viernes 6AM-2PM" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>SALARIO</label>
                                    <input style={styles.input} name="salario" type="number" value={formData.salario} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>PUNTUACIÓN (1-5)</label>
                                <input style={styles.input} name="puntuacion" type="number" min="1" max="5" value={formData.puntuacion} onChange={handleChange} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>DESCRIPCIÓN</label>
                                <textarea style={styles.textarea} name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Breve descripción del instructor..." />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Guardando...' : (instructorSeleccionado ? 'Actualizar' : 'Crear')} Instructor
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {modalEliminar && (
                <div style={styles.overlay} onClick={() => setModalEliminar(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalEliminar}>
                            <h2 style={styles.modalTitulo}>¿Eliminar Instructor?</h2>
                            <p style={styles.modalTexto}>
                                ¿Estás seguro de eliminar a <strong style={{color:'#FFD700'}}>{instructorSeleccionado?.nombre} {instructorSeleccionado?.apellido}</strong>?<br/>
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

export default Instructores;