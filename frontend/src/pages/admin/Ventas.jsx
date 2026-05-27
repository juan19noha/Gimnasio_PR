import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaPlus, FaTimes, FaSave, FaMoneyBillWave, FaShoppingBag } from 'react-icons/fa';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [formData, setFormData] = useState({
        FK_id_usuario: '', FK_id_producto: '', FK_id_evento: '', cantidad: '1'
    });
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [ventasRes, productosRes, usuariosRes, eventosRes] = await Promise.all([
                api.get('/ventas'),
                api.get('/productos'),
                api.get('/usuarios'),
                api.get('/eventos').catch(() => ({ data: { data: [] } }))
            ]);
            setVentas(ventasRes.data.data || []);
            setProductos(productosRes.data.data || []);
            setUsuarios(usuariosRes.data.data || []);
            setEventos(eventosRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const ventasFiltradas = ventas.filter(v => 
        v.usuario_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.nombre_producto?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setFormData({ FK_id_usuario: '', FK_id_producto: '', FK_id_evento: '', cantidad: '1' });
        setModalAbierto(true);
        setMensaje('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            await api.post('/ventas', formData);
            setMensaje('Venta registrada correctamente');
            setTimeout(() => {
                setModalAbierto(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al registrar venta');
        } finally {
            setCargando(false);
        }
    };

    const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);

    const styles = {
        container: { padding: '1rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' },
        resumen: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid #FFD700' },
        cardValor: { fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' },
        cardTitulo: { fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' },
        btnNuevo: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '1rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', background: '#111', letterSpacing: '1px' },
        td: { padding: '1rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
    };

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Ventas</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nueva Venta
                    </button>
                </div>

                <div style={styles.resumen}>
                    <div style={styles.card}>
                        <div style={styles.cardValor}>${totalVentas.toLocaleString()}</div>
                        <div style={styles.cardTitulo}>Total en Ventas</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardValor}>{ventas.length}</div>
                        <div style={styles.cardTitulo}>Transacciones</div>
                    </div>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por cliente o producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.tablaContainer}>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>CLIENTE</th>
                                <th style={styles.th}>PRODUCTO</th>
                                <th style={styles.th}>EVENTO</th>
                                <th style={styles.th}>CANTIDAD</th>
                                <th style={styles.th}>TOTAL</th>
                                <th style={styles.th}>FECHA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasFiltradas.map((venta) => (
                                <tr key={venta.PK_id_venta || venta.id}>
                                    <td style={styles.td}>#{venta.PK_id_venta || venta.id}</td>
                                    <td style={styles.td}>{venta.usuario_nombre} {venta.usuario_apellido}</td>
                                    <td style={styles.td}>{venta.nombre_producto}</td>
                                    <td style={styles.td}>{venta.nombre_evento || 'N/A'}</td>
                                    <td style={styles.td}>{venta.cantidad}</td>
                                    <td style={styles.td}><span style={styles.badge('#FFD700')}>${venta.total?.toLocaleString()}</span></td>
                                    <td style={styles.td}>{venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                            {ventasFiltradas.length === 0 && (
                                <tr><td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay ventas registradas'}
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
                            <h2 style={styles.modalTitulo}>Nueva Venta</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CLIENTE *</label>
                                <select style={styles.select} name="FK_id_usuario" value={formData.FK_id_usuario} onChange={handleChange} required>
                                    <option value="">Seleccionar cliente...</option>
                                    {usuarios.map(u => (
                                        <option key={u.PK_id_usuario} value={u.PK_id_usuario}>{u.nombre} {u.apellido} - {u.correo}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>PRODUCTO *</label>
                                <select style={styles.select} name="FK_id_producto" value={formData.FK_id_producto} onChange={handleChange} required>
                                    <option value="">Seleccionar producto...</option>
                                    {productos.map(p => (
                                        <option key={p.PK_id_producto} value={p.PK_id_producto}>{p.nombre_producto} - ${p.precio_producto} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>EVENTO (Opcional)</label>
                                <select style={styles.select} name="FK_id_evento" value={formData.FK_id_evento} onChange={handleChange}>
                                    <option value="">Sin evento...</option>
                                    {eventos.map(e => (
                                        <option key={e.PK_id_evento} value={e.PK_id_evento}>{e.nombre_evento}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CANTIDAD *</label>
                                <input style={styles.input} name="cantidad" type="number" min="1" value={formData.cantidad} onChange={handleChange} required />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Registrando...' : 'Registrar Venta'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Ventas;