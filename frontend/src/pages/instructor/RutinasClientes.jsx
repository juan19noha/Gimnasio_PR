import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import { FaSearch, FaPlus, FaTimes, FaSave, FaDumbbell, FaTrash, FaUser } from 'react-icons/fa';

const RutinasClientes = () => {
    const [rutinas, setRutinas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalDetalle, setModalDetalle] = useState(false);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        FK_id_usuario: '', nombre_rutina: '', objetivo: ''
    });
    const [ejerciciosRutina, setEjerciciosRutina] = useState([{ FK_id_ejercicio: '', series: '', repeticiones: '', tiempo_descanso: '' }]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [rutinasRes, usuariosRes, ejerciciosRes] = await Promise.all([
                api.get('/rutinas'),
                api.get('/usuarios'),
                api.get('/ejercicios')
            ]);
            setRutinas(rutinasRes.data.data || []);
            setUsuarios(usuariosRes.data.data?.filter(u => u.nombre_rol === 'usuario') || []);
            setEjercicios(ejerciciosRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const rutinasFiltradas = rutinas.filter(r => 
        r.nombre_rutina?.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.usuario_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setRutinaSeleccionada(null);
        setFormData({ FK_id_usuario: '', nombre_rutina: '', objetivo: '' });
        setEjerciciosRutina([{ FK_id_ejercicio: '', series: '', repeticiones: '', tiempo_descanso: '' }]);
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalDetalle = async (rutina) => {
        try {
            setCargando(true);
            const { data } = await api.get(`/rutinas/${rutina.PK_id_rutina}`);
            setRutinaSeleccionada(data.data);
            setModalDetalle(true);
        } catch (error) {
            console.error('Error cargando detalle:', error);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEjercicioChange = (index, campo, valor) => {
        const nuevos = [...ejerciciosRutina];
        nuevos[index][campo] = valor;
        setEjerciciosRutina(nuevos);
    };

    const agregarEjercicio = () => {
        setEjerciciosRutina([...ejerciciosRutina, { FK_id_ejercicio: '', series: '', repeticiones: '', tiempo_descanso: '' }]);
    };

    const eliminarEjercicioForm = (index) => {
        if (ejerciciosRutina.length > 1) {
            setEjerciciosRutina(ejerciciosRutina.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            const { data } = await api.post('/rutinas', formData);
            const idRutina = data.data?.id || data.data?.PK_id_rutina;

            // Agregar ejercicios
            for (const ej of ejerciciosRutina.filter(e => e.FK_id_ejercicio)) {
                await api.post(`/rutinas/${idRutina}/ejercicios`, ej);
            }

            setMensaje('Rutina creada correctamente');
            setTimeout(() => {
                setModalAbierto(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al crear rutina');
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
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' },
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
        cardNombre: { color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' },
        cardCliente: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '0.75rem' },
        cardObjetivo: { color: '#888', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 },
        cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #333' },
        cardCount: { color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem' },
        vacio: { color: '#888', textAlign: 'center', padding: '3rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' },
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
        ejercicioRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end', marginBottom: '0.5rem' },
        btnAgregar: { width: '100%', padding: '0.5rem', background: 'transparent', border: '1px dashed #FFD700', borderRadius: '8px', color: '#FFD700', cursor: 'pointer', marginTop: '0.5rem', marginBottom: '1rem' },
        btnEliminar: { background: '#ff444420', border: 'none', color: '#ff4444', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', height: 'fit-content' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
        detalleEjercicio: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#111', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #333' },
        detalleNombre: { color: '#FFD700', fontWeight: 'bold' },
        detalleInfo: { color: '#888', fontSize: '0.85rem' },
    };

    return (
        <InstructorLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Rutinas de Clientes</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nueva Rutina
                    </button>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por nombre o cliente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.grid}>
                    {rutinasFiltradas.map((rutina) => (
                        <div key={rutina.PK_id_rutina} style={styles.card} onClick={() => abrirModalDetalle(rutina)}>
                            <div style={styles.cardHeader}>
                                <div style={styles.cardNombre}>{rutina.nombre_rutina}</div>
                            </div>
                            <div style={styles.cardCliente}>
                                <FaUser /> {rutina.usuario_nombre} {rutina.usuario_apellido}
                            </div>
                            <div style={styles.cardObjetivo}>{rutina.objetivo}</div>
                            <div style={styles.cardFooter}>
                                <span style={styles.cardCount}><FaDumbbell /> Ver detalles</span>
                            </div>
                        </div>
                    ))}
                    {rutinasFiltradas.length === 0 && (
                        <div style={styles.vacio}>
                            {busqueda ? 'No se encontraron resultados' : 'No hay rutinas creadas'}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear Rutina */}
            {modalAbierto && (
                <div style={styles.overlay} onClick={() => setModalAbierto(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>Nueva Rutina</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CLIENTE *</label>
                                <select style={styles.select} name="FK_id_usuario" value={formData.FK_id_usuario} onChange={handleChange} required>
                                    <option value="">Seleccionar cliente...</option>
                                    {usuarios.map(u => (
                                        <option key={u.PK_id_usuario} value={u.PK_id_usuario}>{u.nombre} {u.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NOMBRE DE LA RUTINA *</label>
                                <input style={styles.input} name="nombre_rutina" value={formData.nombre_rutina} onChange={handleChange} required placeholder="Ej: Rutina de Fuerza - Semana 1" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>OBJETIVO *</label>
                                <textarea style={styles.textarea} name="objetivo" value={formData.objetivo} onChange={handleChange} required placeholder="Ej: Aumentar masa muscular, perder grasa..." />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>EJERCICIOS</label>
                                {ejerciciosRutina.map((ej, index) => (
                                    <div key={index} style={styles.ejercicioRow}>
                                        <select style={styles.select} value={ej.FK_id_ejercicio} onChange={(e) => handleEjercicioChange(index, 'FK_id_ejercicio', e.target.value)} required>
                                            <option value="">Ejercicio...</option>
                                            {ejercicios.map(e => (
                                                <option key={e.PK_id_ejercicio} value={e.PK_id_ejercicio}>{e.nombre_ejercicio}</option>
                                            ))}
                                        </select>
                                        <input style={styles.input} type="number" placeholder="Series" value={ej.series} onChange={(e) => handleEjercicioChange(index, 'series', e.target.value)} />
                                        <input style={styles.input} type="number" placeholder="Reps" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(index, 'repeticiones', e.target.value)} />
                                        <input style={styles.input} placeholder="Descanso" value={ej.tiempo_descanso} onChange={(e) => handleEjercicioChange(index, 'tiempo_descanso', e.target.value)} />
                                        <button type="button" style={styles.btnEliminar} onClick={() => eliminarEjercicioForm(index)}><FaTrash /></button>
                                    </div>
                                ))}
                                <button type="button" style={styles.btnAgregar} onClick={agregarEjercicio}>+ Agregar Ejercicio</button>
                            </div>

                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Guardando...' : 'Crear Rutina'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detalle Rutina */}
            {modalDetalle && rutinaSeleccionada && (
                <div style={styles.overlay} onClick={() => setModalDetalle(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>{rutinaSeleccionada.nombre_rutina}</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalDetalle(false)}><FaTimes /></button>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ color: '#888', marginBottom: '0.5rem' }}><FaUser /> <strong style={{ color: '#FFD700' }}>Cliente:</strong> {rutinaSeleccionada.usuario_nombre} {rutinaSeleccionada.usuario_apellido}</div>
                            <div style={{ color: '#888' }}><strong style={{ color: '#FFD700' }}>Objetivo:</strong> {rutinaSeleccionada.objetivo}</div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>EJERCICIOS ASIGNADOS</label>
                            {rutinaSeleccionada.ejercicios?.map((ej, index) => (
                                <div key={index} style={styles.detalleEjercicio}>
                                    <div>
                                        <div style={styles.detalleNombre}>{ej.nombre_ejercicio}</div>
                                        <div style={styles.detalleInfo}>{ej.musculo_a_trabajar}</div>
                                    </div>
                                    <div style={{ color: '#FFD700', fontSize: '0.85rem' }}>
                                        {ej.series} series x {ej.repeticiones} reps | Descanso: {ej.tiempo_descanso}
                                    </div>
                                </div>
                            ))}
                            {(!rutinaSeleccionada.ejercicios || rutinaSeleccionada.ejercicios.length === 0) && (
                                <div style={styles.vacio}>No hay ejercicios asignados</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
};

export default RutinasClientes;